"""Emergency Alert Endpoints with Explicit User Confirmation Workflow.

Provides:
- POST /api/emergency/alerts: Create an emergency record with explicit user confirmation.
- GET /api/emergency/alerts: Retrieve emergency event history for authenticated user.
"""

from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query, status
from app.dependencies.auth import get_current_user
from app.schemas import (
    EmergencyAlertCreate,
    EmergencyAlert,
    EmergencyAlertResponse,
    EmergencyStatus,
)
from app.services.firestore_service import firestore_service

router = APIRouter(prefix="/api/emergency", tags=["Emergency Workflows"])


@router.post(
    "/alerts",
    response_model=EmergencyAlertResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record Emergency Event with User Confirmation",
)
async def create_emergency_alert(
    payload: EmergencyAlertCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Register an emergency event. Requires explicit user confirmation.

    DOES NOT automatically dial 911 or dispatch emergency services.
    Enforces clear academic prototype safety guardrails.
    """
    uid = current_user["uid"]

    alert_status = (
        EmergencyStatus.CONFIRMED_BY_USER
        if payload.user_confirmed
        else EmergencyStatus.PENDING_CONFIRMATION
    )

    now = datetime.now(timezone.utc)
    alert_record_data = {
        **payload.model_dump(),
        "status": alert_status,
        "triggered_at": now.isoformat(),
        "confirmed_at": now.isoformat() if payload.user_confirmed else None,
        "notification_dispatched": False,
    }

    saved = await firestore_service.save_emergency_alert(uid, alert_record_data)
    alert_obj = EmergencyAlert(**saved)

    confirmation_msg = (
        "Emergency event confirmed by user. Emergency contact guidance displayed."
        if payload.user_confirmed
        else "Emergency alert created in pending state. Awaiting explicit user confirmation."
    )

    return EmergencyAlertResponse(
        alert=alert_obj,
        message=confirmation_msg,
    )


@router.get(
    "/alerts",
    response_model=List[EmergencyAlert],
    summary="List Emergency Event History",
)
async def list_emergency_alerts(
    limit: int = Query(default=20, ge=1, le=50),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve emergency alert events strictly isolated to caller's verified UID."""
    uid = current_user["uid"]
    records = await firestore_service.get_emergency_alerts(uid, limit=limit)
    return [EmergencyAlert(**r) for r in records]
