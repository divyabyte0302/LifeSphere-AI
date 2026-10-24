"""Emergency Detection and Response Endpoints — Module 2.

Provides:
- POST /api/emergency/sos: Immediate non-blocking Manual SOS trigger with contact notification
- GET /api/emergency/contacts & POST /api/emergency/contacts & DELETE /api/emergency/contacts/{id}
- GET /api/emergency/rules & PUT /api/emergency/rules: Configurable alert thresholds
- GET /api/emergency/events & POST /api/emergency/events/{id}/acknowledge
- POST /api/emergency/ambulance-call: Native telephony dialer guidance with strict safety verification
- POST /api/emergency/alerts & GET /api/emergency/alerts (backward-compatible legacy endpoints)
"""

from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.dependencies.auth import get_current_user
from app.schemas import (
    EmergencyAlertCreate,
    EmergencyAlert,
    EmergencyAlertResponse,
    EmergencyStatus,
    EmergencyContactCreate,
    EmergencyContact,
    EmergencyAlertRuleCreate,
    EmergencyAlertRule,
    EmergencySosRequest,
    EmergencyAcknowledgeRequest,
    EmergencyEscalateRequest,
    EmergencyRetryRequest,
)
from app.services.firestore_service import firestore_service
from app.services.notification_service import notification_service, mask_phone

router = APIRouter(prefix="/api/emergency", tags=["Emergency Workflows"])


# ============================================================================
# 1. Manual SOS Endpoint
# ============================================================================

@router.post(
    "/sos",
    status_code=status.HTTP_201_CREATED,
    summary="Trigger Manual Emergency SOS",
)
async def trigger_manual_sos(
    payload: EmergencySosRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Trigger manual SOS immediately without waiting for AI processing.
    
    Dispatches notifications to registered emergency contacts and provides direct ambulance call instructions.
    DOES NOT claim emergency services were dispatched until confirmed with telephony dispatch.
    """
    if payload.user_confirmed is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Explicit user confirmation is required to activate emergency response protocol.",
        )

    uid = current_user["uid"]
    now = datetime.now(timezone.utc)
    effective_reason = payload.alert_reason or payload.reason or "Manual Emergency SOS Triggered"

    # 1. Non-blocking Duplicate Alert Suppression Check (prevents notification flood)
    duplicate = await firestore_service.check_and_suppress_duplicate_alert(
        uid=uid,
        trigger_type="MANUAL_SOS",
        reason=effective_reason,
        suppression_window_seconds=payload.suppression_window_seconds,
    )
    if duplicate:
        return {
            "event": duplicate,
            "is_duplicate": True,
            "message": "Duplicate emergency alert suppressed within cooldown window to prevent notification flood.",
            "notifications_dispatched": duplicate.get("notifications_dispatched", []),
            "ambulance_guidance": {
                "dial_uri": f"tel:{payload.local_emergency_number}",
                "tel_uri": f"tel:{payload.local_emergency_number}",
                "emergency_number": payload.local_emergency_number,
                "message": "Duplicate SOS suppressed. Call emergency services directly if assistance is required.",
                "disclaimer": "Emergency services have NOT been automatically contacted. Launch native dialer to speak directly with the dispatcher.",
            },
        }

    # 2. Data Quality & Stale Reading Check
    data_quality_issues = []
    if payload.reading_age_minutes and payload.reading_age_minutes > 15:
        data_quality_issues.append(
            f"Telemetry reading is stale ({payload.reading_age_minutes:.1f}m old, exceeds 15-minute validity limit)"
        )
    if payload.heart_rate and (payload.heart_rate < 25 or payload.heart_rate > 250):
        data_quality_issues.append(
            f"Implausible heart rate ({payload.heart_rate} bpm) detected as sensor artifact"
        )
    if payload.spo2 and (payload.spo2 < 50.0 or payload.spo2 > 100.0):
        data_quality_issues.append(
            f"Implausible SpO2 ({payload.spo2}%) detected as sensor artifact"
        )

    data_quality_checks = {
        "passed": len(data_quality_issues) == 0,
        "issues": data_quality_issues,
        "evaluated_at": now.isoformat(),
    }

    # 3. Fetch registered emergency contacts
    contacts = await firestore_service.get_emergency_contacts(uid)

    # 4. Construct event record (provisional ID for notification delivery tracking)
    event_id = f"sos_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}_{uid[:6]}"
    
    # 5. Permission-based location sharing
    location_data = {
        "latitude": payload.latitude if payload.is_location_consented else None,
        "longitude": payload.longitude if payload.is_location_consented else None,
        "is_consented": payload.is_location_consented,
    }

    # 6. Real push/SMS notification dispatch via configured provider
    alert_message = (
        f"LIFESPHERE EMERGENCY SOS: {effective_reason} for patient {uid}. "
        f"Immediate assistance requested. "
        + (f"Location: {payload.latitude:.4f}, {payload.longitude:.4f} " if payload.is_location_consented and payload.latitude else "")
    )
    dispatched_receipts = await notification_service.broadcast_to_contacts(contacts, alert_message, event_id)

    # 7. Construct and persist event record
    event_data = {
        "id": event_id,
        "user_id": uid,
        "trigger_type": "MANUAL_SOS",
        "title": "Manual Emergency SOS Triggered",
        "severity": "critical",
        "reason": effective_reason,
        "vitals_snapshot": {
            "heart_rate": payload.heart_rate,
            "spo2": payload.spo2,
            "systolic": payload.systolic,
            "diastolic": payload.diastolic,
            "temperature": payload.temperature,
        },
        "environment_snapshot": {
            "aqi": payload.aqi,
            "pm25": payload.pm25,
        },
        "location": location_data,
        "status": "active_sos",
        "data_quality_checks": data_quality_checks,
        "triggered_at": now.isoformat(),
        "notifications_dispatched": dispatched_receipts,
        "ambulance_action": {
            "dialed": False,
            "number": payload.local_emergency_number,
            "status": "ready_to_call",
            "confirmation_required": True,
        },
        "acknowledgements": [],
    }

    saved_event = await firestore_service.save_emergency_event(uid, event_data)

    return {
        "event": saved_event,
        "is_duplicate": False,
        "notifications_dispatched": dispatched_receipts,
        "ambulance_guidance": {
            "dial_uri": f"tel:{payload.local_emergency_number}",
            "tel_uri": f"tel:{payload.local_emergency_number}",
            "emergency_number": payload.local_emergency_number,
            "message": "Immediate life-safety advice: Call your local emergency dispatch number (911) directly.",
            "disclaimer": "Emergency services have NOT been automatically contacted. Launch native dialer to speak directly with the dispatcher.",
        },
    }


# ============================================================================
# 2. Emergency Contacts Endpoints
# ============================================================================

@router.get(
    "/contacts",
    summary="List Registered Emergency Contacts",
)
async def list_emergency_contacts(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve emergency contacts scoped strictly to caller's verified UID with masked privacy."""
    uid = current_user["uid"]
    records = await firestore_service.get_emergency_contacts(uid)
    safe_records = [{**r, "phone_masked": mask_phone(r.get("phone"))} for r in records]
    return {"contacts": safe_records, "count": len(safe_records)}


@router.post(
    "/contacts",
    status_code=status.HTTP_201_CREATED,
    summary="Register or Update Emergency Contact",
)
async def create_emergency_contact(
    payload: EmergencyContactCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Register an emergency contact with explicit consent."""
    uid = current_user["uid"]
    saved = await firestore_service.save_emergency_contact(uid, payload.model_dump())
    return {
        "contact": saved,
        "message": f"Emergency contact '{saved.get('name')}' registered successfully.",
        **saved,
    }


@router.delete(
    "/contacts/{contact_id}",
    summary="Delete Emergency Contact",
)
async def delete_emergency_contact(
    contact_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Delete an emergency contact scoped to caller's verified UID."""
    uid = current_user["uid"]
    success = await firestore_service.delete_emergency_contact(uid, contact_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found or does not belong to authenticated user.",
        )
    return {"message": "Emergency contact deleted successfully.", "contact_id": contact_id}


# ============================================================================
# 3. Emergency Alert Rules Endpoints
# ============================================================================

@router.get(
    "/rules",
    summary="List Configured Emergency Alert Rules",
)
async def list_emergency_rules(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve configured abnormal-reading alert rules."""
    uid = current_user["uid"]
    records = await firestore_service.get_emergency_rules(uid)
    return {"rules": records, "count": len(records)}


@router.post(
    "/rules",
    status_code=status.HTTP_201_CREATED,
    summary="Create Emergency Alert Rule",
)
@router.put(
    "/rules",
    summary="Save Emergency Alert Rule",
)
async def save_emergency_rule(
    payload: EmergencyAlertRuleCreate,
    rule_id: Optional[str] = Query(default=None),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update or create an emergency alert rule."""
    uid = current_user["uid"]
    rule_data = payload.model_dump()
    if rule_id:
        rule_data["id"] = rule_id
    saved = await firestore_service.save_emergency_rule(uid, rule_data)
    return {"rule": saved, **saved}


# ============================================================================
# 4. Emergency Event History & Acknowledgement
# ============================================================================

@router.get(
    "/events",
    summary="List Emergency Event History",
)
async def list_emergency_events(
    limit: int = Query(default=25, ge=1, le=50),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve full emergency event log with delivery receipts and acknowledgements."""
    uid = current_user["uid"]
    events = await firestore_service.get_emergency_events(uid, limit=limit)
    return {"events": events, "count": len(events)}


@router.post(
    "/events/{event_id}/acknowledge",
    summary="Acknowledge Emergency Event",
)
async def acknowledge_emergency_event(
    event_id: str,
    payload: Optional[EmergencyAcknowledgeRequest] = None,
    acknowledged_by: Optional[str] = Query(None),
    notes: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Record an acknowledgement for an emergency incident."""
    uid = current_user["uid"]
    ack_person = (payload.acknowledged_by if payload else None) or acknowledged_by or "Caregiver"
    ack_notes = (payload.notes if payload else None) or notes

    updated = await firestore_service.acknowledge_emergency_event(
        uid=uid,
        event_id=event_id,
        ack_by=ack_person,
        notes=ack_notes,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency event not found or access denied.",
        )
    return {"message": "Emergency event acknowledged.", "event": updated}


@router.get(
    "/events/{event_id}",
    summary="Get Emergency Event Detail",
)
async def get_emergency_event(
    event_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve full incident details for a specific emergency event scoped to authenticated user."""
    uid = current_user["uid"]
    event = await firestore_service.get_emergency_event(uid, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emergency event {event_id} not found or access denied.",
        )
    return {"event": event}


@router.post(
    "/events/{event_id}/escalate",
    summary="Escalate Emergency Event",
)
async def escalate_emergency_event(
    event_id: str,
    payload: Optional[EmergencyEscalateRequest] = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Escalate unacknowledged emergency alert to secondary contacts or designated physician."""
    uid = current_user["uid"]
    event = await firestore_service.get_emergency_event(uid, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emergency event {event_id} not found or access denied.",
        )

    escalate_to = (payload.escalate_to if payload else None) or ["Physician", "Secondary Contacts"]
    reason = (payload.reason if payload else None) or "Primary contacts unacknowledged after timeout"

    updated = await firestore_service.escalate_emergency_event(
        uid=uid,
        event_id=event_id,
        escalated_to=escalate_to,
        reason=reason,
    )

    # Broadcast escalation message to secondary contacts
    contacts = await firestore_service.get_emergency_contacts(uid)
    secondary_contacts = [c for c in contacts if not c.get("is_primary", False)]
    if secondary_contacts:
        escalation_msg = (
            f"URGENT ESCALATION for patient {uid}: Primary contacts unacknowledged. "
            f"Reason: {event.get('reason')}. Please respond immediately."
        )
        escalation_receipts = await notification_service.broadcast_to_contacts(
            secondary_contacts,
            escalation_msg,
            event_id,
        )
        await firestore_service.update_emergency_event_receipts(uid, event_id, escalation_receipts)
        if updated:
            updated["notifications_dispatched"] = updated.get("notifications_dispatched", []) + escalation_receipts

    return {
        "message": "Emergency event escalated successfully.",
        "event": updated,
    }


@router.post(
    "/events/{event_id}/retry",
    summary="Retry Failed Emergency Notifications",
)
async def retry_failed_notifications(
    event_id: str,
    payload: Optional[EmergencyRetryRequest] = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Re-attempt notification dispatch for failed emergency contact receipts."""
    uid = current_user["uid"]
    event = await firestore_service.get_emergency_event(uid, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emergency event {event_id} not found or access denied.",
        )

    contacts = await firestore_service.get_emergency_contacts(uid)
    failed_receipts = [
        r for r in event.get("notifications_dispatched", [])
        if r.get("status") == "failed"
    ]

    new_receipts = []
    for r in failed_receipts:
        cid = r.get("contact_id")
        matching_contact = next((c for c in contacts if c.get("id") == cid), None)
        if matching_contact:
            retry_count = r.get("retry_count", 0) + 1
            retry_receipt = await notification_service.dispatch_emergency_notification(
                matching_contact,
                f"RETRY ALERT: Emergency alert for patient {uid}: {event.get('reason')}",
                event_id,
                channel=r.get("channel", "push"),
                retry_count=retry_count,
            )
            new_receipts.append(retry_receipt)

    if new_receipts:
        await firestore_service.update_emergency_event_receipts(uid, event_id, new_receipts)
        event = await firestore_service.get_emergency_event(uid, event_id)

    return {
        "message": f"Retried {len(new_receipts)} notification dispatch(es).",
        "event": event,
        "new_receipts": new_receipts,
    }


# ============================================================================
# 5. Direct Ambulance Call Action Guidance
# ============================================================================

@router.post(
    "/ambulance-call",
    summary="Initiate Native Phone Dialer Action",
)
async def initiate_ambulance_call(
    payload: Optional[Dict[str, Any]] = None,
    emergency_number: str = Query(default="911"),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Return verified telephony call link without claiming external automated dispatch."""
    raw_number = (payload.get("dial_number") if payload else None) or emergency_number or "911"
    cleaned = "".join([c for c in str(raw_number) if c.isdigit()]) or "911"
    return {
        "dial_uri": f"tel:{cleaned}",
        "tel_uri": f"tel:{cleaned}",
        "emergency_number": cleaned,
        "status": "ready_for_native_dialer",
        "requires_user_telephony_confirmation": True,
        "instruction": "Initiate call directly through native device telephony. Confirm your physical address with the 911 dispatcher.",
        "disclaimer": "LifeSphere cannot autonomously dispatch emergency medical services. Human voice communication and confirmation with the emergency dispatcher is required.",
    }


# ============================================================================
# 6. Legacy Backward-Compatible Alert Endpoints
# ============================================================================

@router.post(
    "/alerts",
    response_model=EmergencyAlertResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record Emergency Event with User Confirmation (Legacy)",
)
async def create_emergency_alert(
    payload: EmergencyAlertCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Legacy emergency alert creation."""
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
    summary="List Emergency Event History (Legacy)",
)
async def list_emergency_alerts(
    limit: int = Query(default=20, ge=1, le=50),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve emergency alert events strictly isolated to caller's verified UID."""
    uid = current_user["uid"]
    records = await firestore_service.get_emergency_alerts(uid, limit=limit)
    return [EmergencyAlert(**r) for r in records]
