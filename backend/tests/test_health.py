"""Tests for System Health and Health Telemetry Endpoints."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

# Force mock auth during tests
settings.firebase_mock_auth_for_dev = True


@pytest.mark.asyncio
async def test_health_check_endpoint():
    """Verify GET /api/health returns 200 and healthy status."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "LifeSphere AI-X" in data["service"]
        assert "version" in data


@pytest.mark.asyncio
async def test_measurements_unauthenticated_rejected():
    """Verify POST /api/health/measurements returns 401 when no token is supplied."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {"heart_rate": 72, "spo2": 98.5}
        response = await client.post("/api/health/measurements", json=payload)
        assert response.status_code == 401
        assert "Missing Authorization header" in response.json()["detail"]


@pytest.mark.asyncio
async def test_measurements_valid_creation():
    """Verify POST /api/health/measurements succeeds with valid authenticated token."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "heart_rate": 74,
            "spo2": 98.0,
            "body_temperature": 36.8,
            "respiratory_rate": 16,
            "activity_level": "resting",
            "sensor_source": "Polar H10 BLE",
        }
        headers = {"Authorization": "Bearer mock-token-user-alex"}
        response = await client.post("/api/health/measurements", json=payload, headers=headers)
        assert response.status_code == 201
        data = response.json()
        assert data["heart_rate"] == 74
        assert data["spo2"] == 98.0
        assert data["user_id"] == "user-alex"
        assert "id" in data
        assert "created_at" in data


@pytest.mark.asyncio
async def test_measurements_invalid_inputs_rejected():
    """Verify validation bounds reject out-of-range physiological values."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-alex"}

        # Out-of-bounds heart rate (300 > 240)
        invalid_hr = {"heart_rate": 300, "spo2": 98.0}
        resp1 = await client.post("/api/health/measurements", json=invalid_hr, headers=headers)
        assert resp1.status_code == 422

        # Out-of-bounds SpO2 (60 < 70)
        invalid_spo2 = {"heart_rate": 75, "spo2": 60.0}
        resp2 = await client.post("/api/health/measurements", json=invalid_spo2, headers=headers)
        assert resp2.status_code == 422


@pytest.mark.asyncio
async def test_measurements_list_isolated_to_user():
    """Verify User A cannot view User B's measurements."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create for User A
        await client.post(
            "/api/health/measurements",
            json={"heart_rate": 65, "spo2": 99.0},
            headers={"Authorization": "Bearer mock-token-userA"},
        )

        # Create for User B
        await client.post(
            "/api/health/measurements",
            json={"heart_rate": 95, "spo2": 94.0},
            headers={"Authorization": "Bearer mock-token-userB"},
        )

        # Fetch for User A
        res_a = await client.get(
            "/api/health/measurements",
            headers={"Authorization": "Bearer mock-token-userA"},
        )
        assert res_a.status_code == 200
        records_a = res_a.json()
        assert all(r["user_id"] == "userA" for r in records_a)

        # Fetch for User B
        res_b = await client.get(
            "/api/health/measurements",
            headers={"Authorization": "Bearer mock-token-userB"},
        )
        assert res_b.status_code == 200
        records_b = res_b.json()
        assert all(r["user_id"] == "userB" for r in records_b)


@pytest.mark.asyncio
async def test_health_summary_calculation():
    """Verify GET /api/health/summary computes averages and trends correctly."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-summaryUser"}

        # Ingest two readings
        await client.post(
            "/api/health/measurements",
            json={"heart_rate": 70, "spo2": 98.0},
            headers=headers,
        )
        await client.post(
            "/api/health/measurements",
            json={"heart_rate": 80, "spo2": 96.0},
            headers=headers,
        )

        resp = await client.get("/api/health/summary", headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["user_id"] == "summaryUser"
        assert data["total_measurements"] >= 2
        assert data["average_heart_rate_24h"] == 75.0
        assert data["min_spo2_24h"] == 96.0


@pytest.mark.asyncio
async def test_hydration_persistence_and_isolation():
    """Verify daily water intake entries are saved to users/{uid}/hydration and isolated between users."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        user_a_headers = {"Authorization": "Bearer mock-token-patientA"}
        user_b_headers = {"Authorization": "Bearer mock-token-patientB"}

        # 1. User A logs 350ml water
        payload_a = {
            "volume_ml": 350,
            "effective_ml": 350,
            "beverage_type": "water",
            "source": "quick_preset",
            "notes": "Morning glass",
        }
        res_a = await client.post("/api/health/hydration", json=payload_a, headers=user_a_headers)
        assert res_a.status_code == 201
        entry_a = res_a.json()
        assert entry_a["user_id"] == "patientA"
        assert entry_a["volume_ml"] == 350
        assert "id" in entry_a

        # 2. User B logs 500ml electrolyte
        payload_b = {
            "volume_ml": 500,
            "effective_ml": 550,
            "beverage_type": "electrolyte",
            "source": "custom_entry",
            "notes": "Post workout recovery",
        }
        res_b = await client.post("/api/health/hydration", json=payload_b, headers=user_b_headers)
        assert res_b.status_code == 201
        entry_b = res_b.json()
        assert entry_b["user_id"] == "patientB"

        # 3. User A queries hydration entries - only sees User A's logs
        list_a = await client.get("/api/health/hydration", headers=user_a_headers)
        assert list_a.status_code == 200
        items_a = list_a.json()
        assert any(item["id"] == entry_a["id"] for item in items_a)
        assert all(item["user_id"] == "patientA" for item in items_a)
        assert not any(item["id"] == entry_b["id"] for item in items_a)

        # 4. User A deletes entry
        del_res = await client.delete(f"/api/health/hydration/{entry_a['id']}", headers=user_a_headers)
        assert del_res.status_code == 200
        assert del_res.json()["status"] == "success"

