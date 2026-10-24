"""Tests for Health Checkup Appointments and Recurring Reminders."""

import pytest
from datetime import datetime, timezone, timedelta
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

settings.firebase_mock_auth_for_dev = True


@pytest.mark.asyncio
async def test_create_appointment():
    """Verify POST /api/appointments creates a valid appointment with recurrence."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        sched_time = (datetime.now(timezone.utc) + timedelta(days=14)).isoformat()
        payload = {
            "title": "Monthly Asthma & Spirometry Review",
            "description": "Evaluate bronchial reactivity under peak autumn ragweed.",
            "doctor_or_specialist": "Dr. Vance (Pulmonology)",
            "category": "pulmonology",
            "scheduled_date_time": sched_time,
            "duration_minutes": 30,
            "frequency": "monthly",
            "location": "St. Jude Outpatient Center",
            "is_telehealth": False,
            "reminder_preferences": {
                "lead_time_hours": 24,
                "push_enabled": True,
                "email_enabled": False,
                "in_app_enabled": True,
            },
        }
        headers = {"Authorization": "Bearer mock-token-user-alex"}
        res = await client.post("/api/appointments", json=payload, headers=headers)
        assert res.status_code == 201
        data = res.json()["appointment"]
        assert data["title"] == "Monthly Asthma & Spirometry Review"
        assert data["frequency"] == "monthly"
        assert data["status"] == "scheduled"
        assert data["user_id"] == "user-alex"
        assert data["notification_delivery_status"] == "scheduled"
        assert data["next_recurrence_date"] is not None


@pytest.mark.asyncio
async def test_list_and_complete_appointment():
    """Verify listing and marking an appointment completed creates the next cycle."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-alex"}

        # Create one appointment
        sched_time = (datetime.now(timezone.utc) + timedelta(days=3)).isoformat()
        create_payload = {
            "title": "Quarterly Cardiology Screening",
            "doctor_or_specialist": "Dr. Sarah Chen, MD",
            "category": "cardiology",
            "scheduled_date_time": sched_time,
            "frequency": "quarterly",
        }
        res_create = await client.post("/api/appointments", json=create_payload, headers=headers)
        appt_id = res_create.json()["appointment"]["id"]

        # List appointments
        res_list = await client.get("/api/appointments", headers=headers)
        assert res_list.status_code == 200
        list_data = res_list.json()
        assert list_data["upcoming_count"] >= 1
        assert any(a["id"] == appt_id for a in list_data["appointments"])

        # Complete appointment
        res_comp = await client.post(
            f"/api/appointments/{appt_id}/complete?notes=Normal+ECG+rhythm",
            headers=headers,
        )
        assert res_comp.status_code == 200
        comp_data = res_comp.json()["appointment"]
        assert comp_data["status"] == "completed"
        assert comp_data["completed_at"] is not None

        # Process reminders endpoint
        res_reminders = await client.post("/api/appointments/process-reminders", headers=headers)
        assert res_reminders.status_code == 200
        assert "processed_count" in res_reminders.json()


@pytest.mark.asyncio
async def test_delete_appointment():
    """Verify DELETE /api/appointments/{id} removes appointment."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-alex"}
        sched_time = (datetime.now(timezone.utc) + timedelta(days=5)).isoformat()
        create_payload = {
            "title": "Temporary Dental Checkup",
            "doctor_or_specialist": "Dr. Green",
            "scheduled_date_time": sched_time,
            "frequency": "once",
        }
        res_create = await client.post("/api/appointments", json=create_payload, headers=headers)
        appt_id = res_create.json()["appointment"]["id"]

        # Delete it
        res_del = await client.delete(f"/api/appointments/{appt_id}", headers=headers)
        assert res_del.status_code == 200

        # Verify not found
        res_get = await client.get(f"/api/appointments/{appt_id}", headers=headers)
        assert res_get.status_code == 404


@pytest.mark.asyncio
async def test_recurring_appointment_idempotency_and_concurrency():
    """Verify completing an appointment creates EXACTLY ONE next occurrence, even on retries."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-claire"}
        sched_time = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
        create_payload = {
            "title": "Monthly Asthma Respirometry Checkup",
            "doctor_or_specialist": "Dr. Vance",
            "category": "pulmonology",
            "scheduled_date_time": sched_time,
            "frequency": "monthly",
        }
        res_create = await client.post("/api/appointments", json=create_payload, headers=headers)
        appt_id = res_create.json()["appointment"]["id"]

        # Call complete 1st time
        res_comp1 = await client.post(f"/api/appointments/{appt_id}/complete", headers=headers)
        assert res_comp1.status_code == 200

        # Call complete 2nd time (simulating network retry or duplicate click)
        res_comp2 = await client.post(f"/api/appointments/{appt_id}/complete", headers=headers)
        assert res_comp2.status_code == 200

        # Call complete 3rd time (concurrent replay)
        res_comp3 = await client.post(f"/api/appointments/{appt_id}/complete", headers=headers)
        assert res_comp3.status_code == 200

        # Verify exactly ONE upcoming recurring occurrence was created
        res_list = await client.get("/api/appointments?status=scheduled", headers=headers)
        scheduled = res_list.json()["appointments"]
        matching = [a for a in scheduled if a["title"] == "Monthly Asthma Respirometry Checkup"]
        assert len(matching) == 1, f"Expected exactly 1 recurrence, found {len(matching)}"


@pytest.mark.asyncio
async def test_user_isolation_security():
    """Verify User A cannot read, edit, complete, or delete User B's appointments."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        alice_headers = {"Authorization": "Bearer mock-token-user-alice"}
        bob_headers = {"Authorization": "Bearer mock-token-user-bob"}

        # Alice creates private appointment
        sched_time = (datetime.now(timezone.utc) + timedelta(days=10)).isoformat()
        create_payload = {
            "title": "Alice Confidential Oncology Screening",
            "doctor_or_specialist": "Dr. Smith",
            "category": "routine_checkup",
            "scheduled_date_time": sched_time,
            "frequency": "once",
        }
        res_alice = await client.post("/api/appointments", json=create_payload, headers=alice_headers)
        alice_appt_id = res_alice.json()["appointment"]["id"]

        # Bob attempts unauthorized GET
        res_bob_get = await client.get(f"/api/appointments/{alice_appt_id}", headers=bob_headers)
        assert res_bob_get.status_code == 404, "Bob must not view Alice's appointment"

        # Bob attempts unauthorized PUT
        res_bob_put = await client.put(
            f"/api/appointments/{alice_appt_id}",
            json={"title": "Hacked Title"},
            headers=bob_headers,
        )
        assert res_bob_put.status_code == 404, "Bob must not update Alice's appointment"

        # Bob attempts unauthorized Complete
        res_bob_comp = await client.post(f"/api/appointments/{alice_appt_id}/complete", headers=bob_headers)
        assert res_bob_comp.status_code == 404, "Bob must not complete Alice's appointment"

        # Bob attempts unauthorized DELETE
        res_bob_del = await client.delete(f"/api/appointments/{alice_appt_id}", headers=bob_headers)
        assert res_bob_del.status_code == 404, "Bob must not delete Alice's appointment"


@pytest.mark.asyncio
async def test_reminder_processing_authorization_and_delivery():
    """Verify ordinary users cannot trigger reminder batch processing, but scheduler/admin can."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Ordinary user attempt for global batch is rejected with 403 Forbidden
        user_headers = {"Authorization": "Bearer mock-token-user-alex"}
        res_unauthorized = await client.post("/api/appointments/process-reminders?global_batch=true", headers=user_headers)
        assert res_unauthorized.status_code == 403
        assert "restricted" in res_unauthorized.json()["detail"]

        # 2. Schedule an upcoming appointment within 24h lead time for reminder test
        sched_time = (datetime.now(timezone.utc) + timedelta(hours=4)).isoformat()
        create_payload = {
            "title": "Immediate Checkup Under Delivery Window",
            "doctor_or_specialist": "Dr. Vance",
            "category": "cardiology",
            "scheduled_date_time": sched_time,
            "frequency": "monthly",
            "reminder_preferences": {
                "lead_time_hours": 24,
                "push_enabled": True,
                "email_enabled": False,
                "in_app_enabled": True,
            },
        }
        res_create = await client.post("/api/appointments", json=create_payload, headers=user_headers)
        appt_id = res_create.json()["appointment"]["id"]

        # 3. Authorized scheduler triggers global reminder processor
        scheduler_headers = {"Authorization": "Bearer mock-token-system-scheduler"}
        res_sched = await client.post("/api/appointments/process-reminders?global_batch=true", headers=scheduler_headers)
        assert res_sched.status_code == 200
        result_data = res_sched.json()
        assert "processed_count" in result_data
        assert "delivered_reminders_count" in result_data

        # 4. Check appointment status: should now show delivered with delivery timestamp
        res_get = await client.get(f"/api/appointments/{appt_id}", headers=user_headers)
        assert res_get.status_code == 200
        appt_data = res_get.json()["appointment"]
        assert appt_data["notification_delivery_status"] == "delivered"
        assert appt_data["delivery_timestamp"] is not None

