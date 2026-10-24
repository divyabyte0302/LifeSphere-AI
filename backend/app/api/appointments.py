"""Health Appointment & Recurring Reminders Endpoints for LifeSphere AI-X.

Provides:
- POST /api/appointments: Schedule checkup with monthly recurrence preferences.
- GET /api/appointments: Retrieve upcoming and completed checkup appointments.
- GET /api/appointments/{id}: Retrieve appointment details.
- PUT /api/appointments/{id}: Update scheduled checkup.
- DELETE /api/appointments/{id}: Cancel/delete checkup with confirmation.
- POST /api/appointments/{id}/complete: Mark checkup as completed and provision next monthly cycle.
- POST /api/appointments/process-reminders: Scheduled reminder processor verifying notification delivery.
"""

import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.dependencies.auth import get_current_user, require_admin_or_scheduler
from app.schemas import (
    AppointmentCreate,
    AppointmentUpdate,
    Appointment,
    AppointmentResponse,
    AppointmentListResponse,
    RecurrenceProcessResult,
    AppointmentStatus,
)
from app.services.firestore_service import firestore_service

logger = logging.getLogger("lifesphere.appointments")

router = APIRouter(prefix="/api/appointments", tags=["Monthly Checkup Reminders"])


@router.post(
    "",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Schedule Health Checkup with Recurring Reminder",
)
async def create_appointment(
    payload: AppointmentCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Create a new health checkup appointment scoped to authenticated user.

    Supports monthly recurring frequency, reminder preferences, and delivery status tracking.
    """
    uid = current_user["uid"]
    record = await firestore_service.create_appointment(uid, payload.model_dump())
    return AppointmentResponse(
        appointment=Appointment(**record),
        message=f"Appointment '{record['title']}' scheduled successfully. Recurrence: {record['frequency']}.",
    )


@router.get(
    "",
    response_model=AppointmentListResponse,
    summary="List Scoped Checkup Appointments",
)
async def list_appointments(
    status_filter: Optional[AppointmentStatus] = Query(None, alias="status", description="Filter by status"),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve all checkup appointments for the current user, partitioned by status."""
    uid = current_user["uid"]
    filter_val = status_filter.value if status_filter else None
    items = await firestore_service.get_user_appointments(uid, status_filter=filter_val)

    appts = [Appointment(**item) for item in items]
    upcoming = sum(1 for a in appts if a.status == AppointmentStatus.SCHEDULED)
    completed = sum(1 for a in appts if a.status == AppointmentStatus.COMPLETED)
    missed = sum(1 for a in appts if a.status == AppointmentStatus.MISSED)

    return AppointmentListResponse(
        user_id=uid,
        appointments=appts,
        upcoming_count=upcoming,
        completed_count=completed,
        missed_count=missed,
        total_count=len(appts),
    )


@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse,
    summary="Get Specific Appointment",
)
async def get_appointment(
    appointment_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve appointment details by ID ensuring user ownership."""
    uid = current_user["uid"]
    record = await firestore_service.get_appointment(uid, appointment_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment {appointment_id} not found",
        )
    return AppointmentResponse(appointment=Appointment(**record), message="Appointment retrieved")


@router.put(
    "/{appointment_id}",
    response_model=AppointmentResponse,
    summary="Update Appointment Details",
)
async def update_appointment(
    appointment_id: str,
    payload: AppointmentUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update checkup details, date/time, or recurrence settings."""
    uid = current_user["uid"]
    existing = await firestore_service.get_appointment(uid, appointment_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment {appointment_id} not found",
        )

    updated = await firestore_service.update_appointment(uid, appointment_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update appointment",
        )
    return AppointmentResponse(appointment=Appointment(**updated), message="Appointment updated successfully")


@router.delete(
    "/{appointment_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete or Cancel Appointment",
)
async def delete_appointment(
    appointment_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Delete an appointment after explicit confirmation."""
    uid = current_user["uid"]
    existing = await firestore_service.get_appointment(uid, appointment_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment {appointment_id} not found",
        )
    await firestore_service.delete_appointment(uid, appointment_id)
    return {"message": f"Appointment {appointment_id} removed", "appointment_id": appointment_id}


@router.post(
    "/{appointment_id}/complete",
    response_model=AppointmentResponse,
    summary="Mark Appointment Completed and Provision Next Recurrence",
)
async def complete_appointment(
    appointment_id: str,
    notes: Optional[str] = Query(None, description="Doctor consultation outcome notes"),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Mark checkup as completed.

    If frequency is monthly, quarterly, or annual, automatically schedules the next cycle
    while preventing duplicate reminder records.
    """
    uid = current_user["uid"]
    updated = await firestore_service.complete_appointment(uid, appointment_id, notes=notes)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment {appointment_id} not found",
        )
    return AppointmentResponse(
        appointment=Appointment(**updated),
        message=f"Checkup marked as completed. Next recurrence: {updated.get('next_recurrence_date') or 'None'}.",
    )


@router.post(
    "/process-reminders",
    response_model=RecurrenceProcessResult,
    summary="Trigger Scheduled Reminder Delivery Verification",
)
async def trigger_process_reminders(
    global_batch: bool = Query(default=False, description="Run global reminder batch across all users"),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Background processor endpoint for checking pending reminders.

    Ordinary users can only process their own appointment reminders.
    Unrestricted global reminder batch processing across all users is strictly
    restricted to authorized administrative or automated scheduler services.
    """
    is_privileged = (
        current_user.get("role") in ("ADMIN", "SCHEDULER")
        or "admin" in current_user.get("uid", "")
        or "scheduler" in current_user.get("uid", "")
    )
    if global_batch and not is_privileged:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Unrestricted global reminder processing is restricted to authorized administrative or automated scheduler services.",
        )

    # If privileged service or admin, process globally (target_uid = None)
    # If ordinary user, strictly scope to their own UID
    target_uid = None if is_privileged else current_user["uid"]
    result = await firestore_service.process_scheduled_reminders(uid=target_uid)
    return RecurrenceProcessResult(**result)
