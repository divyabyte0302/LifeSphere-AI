"""Tests for Module 2: Emergency Detection and Response Endpoints."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

settings.firebase_mock_auth_for_dev = True


@pytest.mark.asyncio
async def test_emergency_contact_crud_and_isolation():
    """Verify registered emergency contacts are scoped to authenticated UID."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        alex_headers = {"Authorization": "Bearer mock-token-user-alex"}
        bob_headers = {"Authorization": "Bearer mock-token-user-bob"}

        # 1. Alex registers a primary emergency contact
        contact_payload = {
            "name": "Sarah Vance",
            "relationship": "Spouse",
            "phone": "+1-555-0144",
            "email": "sarah.vance@example.org",
            "is_primary": True,
            "has_explicit_consent": True,
            "push_enabled": True,
            "sms_enabled": True,
            "in_app_enabled": True,
        }
        res_create = await client.post("/api/emergency/contacts", json=contact_payload, headers=alex_headers)
        assert res_create.status_code == 201
        contact_data = res_create.json()["contact"]
        assert contact_data["name"] == "Sarah Vance"
        assert contact_data["user_id"] == "user-alex"
        contact_id = contact_data["id"]

        # 2. Alex lists contacts
        res_list = await client.get("/api/emergency/contacts", headers=alex_headers)
        assert res_list.status_code == 200
        contacts = res_list.json()["contacts"]
        assert any(c["id"] == contact_id for c in contacts)

        # 3. Bob attempts to list contacts - Alex's contact must NOT be visible
        res_bob_list = await client.get("/api/emergency/contacts", headers=bob_headers)
        assert res_bob_list.status_code == 200
        bob_contacts = res_bob_list.json()["contacts"]
        assert not any(c["id"] == contact_id for c in bob_contacts)


@pytest.mark.asyncio
async def test_emergency_alert_rules_crud():
    """Verify configurable health-alert rules creation and listing."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-alex"}

        rule_payload = {
            "name": "Sustained Tachycardia Alert",
            "metric": "heart_rate",
            "condition": "greater_than",
            "threshold": 140.0,
            "duration_seconds": 120,
            "severity": "critical",
            "is_enabled": True,
            "reject_invalid_readings": True,
            "max_reading_age_minutes": 15,
        }
        res_create = await client.post("/api/emergency/rules", json=rule_payload, headers=headers)
        assert res_create.status_code == 201
        rule = res_create.json()["rule"]
        assert rule["name"] == "Sustained Tachycardia Alert"
        assert rule["threshold"] == 140.0
        assert rule["user_id"] == "user-alex"

        # List rules
        res_list = await client.get("/api/emergency/rules", headers=headers)
        assert res_list.status_code == 200
        assert len(res_list.json()["rules"]) >= 1


@pytest.mark.asyncio
async def test_manual_sos_trigger_and_acknowledgement():
    """Verify manual SOS requires explicit user confirmation and logs audit events."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-alex"}

        # 1. Unconfirmed SOS must be rejected
        unconfirmed_payload = {
            "alert_reason": "Acute Chest Discomfort",
            "user_confirmed": False,
        }
        res_unconfirmed = await client.post("/api/emergency/sos", json=unconfirmed_payload, headers=headers)
        assert res_unconfirmed.status_code == 400
        assert "Explicit user confirmation is required" in res_unconfirmed.json()["detail"]

        # 2. Confirmed SOS succeeds, dispatches notifications, and generates event record
        confirmed_payload = {
            "alert_reason": "Acute Chest Discomfort and Shortness of Breath",
            "user_confirmed": True,
            "current_heart_rate": 138,
            "current_spo2": 91.5,
            "current_aqi": 112,
            "location_summary": "37.7749 N, -122.4194 W (Civic Center Station)",
            "notes": "Patient self-activated SOS after ascending subway stairs.",
        }
        res_sos = await client.post("/api/emergency/sos", json=confirmed_payload, headers=headers)
        assert res_sos.status_code == 201
        data = res_sos.json()
        assert "event" in data
        assert data["event"]["status"] in ("active_sos", "notified")
        assert len(data["notifications_dispatched"]) >= 1
        event_id = data["event"]["id"]

        # 3. Emergency contact acknowledges event
        ack_res = await client.post(
            f"/api/emergency/events/{event_id}/acknowledge?acknowledged_by=Dr.+Sarah+Vance&notes=Informed+and+en+route",
            headers=headers,
        )
        assert ack_res.status_code == 200
        ack_data = ack_res.json()["event"]
        assert len(ack_data["acknowledgements"]) >= 1
        assert ack_data["status"] == "acknowledged"


@pytest.mark.asyncio
async def test_ambulance_call_workflow_and_telephony_disclaimer():
    """Verify ambulance-call workflow requires human confirmation and never claims automated dispatch."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-alex"}

        payload = {
            "event_id": "test_emergency_evt_001",
            "dial_number": "911",
            "patient_notes": "Suspected acute myocardial infarction.",
        }
        res = await client.post("/api/emergency/ambulance-call", json=payload, headers=headers)
        assert res.status_code == 200
        result = res.json()
        assert result["dial_uri"] == "tel:911"
        assert result["requires_user_telephony_confirmation"] is True
        # Safety disclaimer check: must state no automated dispatch without human call
        assert "Human voice communication" in result["disclaimer"]
        assert "cannot autonomously dispatch emergency medical services" in result["disclaimer"]


@pytest.mark.asyncio
async def test_emergency_auth_missing_token_returns_401():
    """Verify emergency endpoints reject unauthenticated requests."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/emergency/sos", json={"alert_reason": "Test", "user_confirmed": True})
        assert res.status_code == 401
        res_contacts = await client.get("/api/emergency/contacts")
        assert res_contacts.status_code == 401


@pytest.mark.asyncio
async def test_duplicate_alert_suppression():
    """Verify sending identical SOS within cooldown window is marked is_duplicate=True without notification spam."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-claire"}
        sos_payload = {
            "alert_reason": "Syncope and Loss of Consciousness",
            "user_confirmed": True,
            "suppression_window_seconds": 60,
        }

        # 1. First trigger
        res1 = await client.post("/api/emergency/sos", json=sos_payload, headers=headers)
        assert res1.status_code == 201
        assert res1.json()["is_duplicate"] is False

        # 2. Immediate second trigger (rapid double-press / panic retry)
        res2 = await client.post("/api/emergency/sos", json=sos_payload, headers=headers)
        assert res2.status_code == 201
        data2 = res2.json()
        assert data2["is_duplicate"] is True
        assert "suppressed" in data2["message"].lower()


@pytest.mark.asyncio
async def test_permission_based_location_sharing():
    """Verify patient location is strictly stripped unless explicit location consent is provided."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-dan"}

        # Case A: Location consented -> coordinates populated
        consented_payload = {
            "alert_reason": "Respiratory Distress",
            "user_confirmed": True,
            "latitude": 37.7749,
            "longitude": -122.4194,
            "is_location_consented": True,
        }
        res_consented = await client.post("/api/emergency/sos", json=consented_payload, headers=headers)
        assert res_consented.status_code == 201
        loc_data = res_consented.json()["event"]["location"]
        assert loc_data["is_consented"] is True
        assert loc_data["latitude"] == 37.7749
        assert loc_data["longitude"] == -122.4194

        # Case B: Location NOT consented -> coordinates stripped
        unconsented_payload = {
            "alert_reason": "Arrhythmia Detected",
            "user_confirmed": True,
            "latitude": 37.7749,
            "longitude": -122.4194,
            "is_location_consented": False,
        }
        res_unconsented = await client.post("/api/emergency/sos", json=unconsented_payload, headers=headers)
        assert res_unconsented.status_code == 201
        loc_data_stripped = res_unconsented.json()["event"]["location"]
        assert loc_data_stripped["is_consented"] is False
        assert loc_data_stripped["latitude"] is None
        assert loc_data_stripped["longitude"] is None


@pytest.mark.asyncio
async def test_contact_phone_masking_for_privacy():
    """Verify phone numbers are masked in contact listings for privacy protection."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-elena"}
        create_payload = {
            "name": "David Elena",
            "relationship": "Brother",
            "phone": "+1-415-555-8822",
            "is_primary": True,
            "has_explicit_consent": True,
        }
        await client.post("/api/emergency/contacts", json=create_payload, headers=headers)

        res_list = await client.get("/api/emergency/contacts", headers=headers)
        assert res_list.status_code == 200
        contacts = res_list.json()["contacts"]
        elena_contact = next(c for c in contacts if c["name"] == "David Elena")
        assert "phone_masked" in elena_contact
        assert "***" in elena_contact["phone_masked"]
        assert elena_contact["phone_masked"].endswith("8822")


@pytest.mark.asyncio
async def test_failed_delivery_retry_and_escalation():
    """Verify notification failures, retry mechanisms, and unacknowledged escalation."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-felix"}

        # 1. Register a primary contact with an invalid phone format to simulate delivery failure
        bad_contact = {
            "name": "Broken Line Contact",
            "relationship": "Neighbor",
            "phone": "invalid-chars-123",
            "is_primary": True,
            "has_explicit_consent": True,
            "sms_enabled": True,
        }
        res_c = await client.post("/api/emergency/contacts", json=bad_contact, headers=headers)
        bad_contact_id = res_c.json()["contact"]["id"]

        # 2. Trigger SOS
        sos_res = await client.post(
            "/api/emergency/sos",
            json={"alert_reason": "Fall Detected", "user_confirmed": True},
            headers=headers,
        )
        assert sos_res.status_code == 201
        event_id = sos_res.json()["event"]["id"]
        receipts = sos_res.json()["notifications_dispatched"]

        # Verify failed receipt was recorded with reason
        failed = next((r for r in receipts if r.get("contact_id") == bad_contact_id and r.get("status") == "failed"), None)
        assert failed is not None
        assert failed["failure_reason"] == "INVALID_PHONE_NUMBER_FORMAT"

        # 3. Call Retry endpoint
        retry_res = await client.post(f"/api/emergency/events/{event_id}/retry", headers=headers)
        assert retry_res.status_code == 200
        assert "Retried" in retry_res.json()["message"]

        # 4. Call Escalation endpoint
        escalate_res = await client.post(
            f"/api/emergency/events/{event_id}/escalate",
            json={"reason": "Primary contact unreachable", "escalate_to": ["Attending Pulmonologist"]},
            headers=headers,
        )
        assert escalate_res.status_code == 200
        event_data = escalate_res.json()["event"]
        assert event_data["status"] == "escalated"
        assert event_data["escalated_to"] == ["Attending Pulmonologist"]


@pytest.mark.asyncio
async def test_data_quality_and_stale_telemetry_check():
    """Verify readings older than 15 minutes or sensor artifacts flag data quality check issues."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-gina"}

        # Stale reading (25 minutes old) + sensor artifact (HR = 280 bpm)
        stale_payload = {
            "alert_reason": "High Heart Rate Alarm",
            "user_confirmed": True,
            "heart_rate": 280,
            "reading_age_minutes": 25.0,
        }
        res = await client.post("/api/emergency/sos", json=stale_payload, headers=headers)
        assert res.status_code == 201
        quality_checks = res.json()["event"]["data_quality_checks"]
        assert quality_checks["passed"] is False
        assert any("stale" in issue.lower() for issue in quality_checks["issues"])
        assert any("artifact" in issue.lower() for issue in quality_checks["issues"])
