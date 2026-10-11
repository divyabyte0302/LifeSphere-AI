"""Tests for Firebase Authentication verification, User Profile, and Data Isolation."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

settings.firebase_mock_auth_for_dev = True


@pytest.mark.asyncio
async def test_auth_missing_token_returns_401():
    """Verify missing authorization header returns HTTP 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/users/me")
        assert response.status_code == 401
        assert "Missing Authorization header" in response.json()["detail"]


@pytest.mark.asyncio
async def test_auth_malformed_header_returns_401():
    """Verify malformed authorization headers return HTTP 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Missing 'Bearer' prefix
        resp1 = await client.get("/api/users/me", headers={"Authorization": "TokenXYZ"})
        assert resp1.status_code == 401

        # Invalid token explicitly rejected
        resp2 = await client.get("/api/users/me", headers={"Authorization": "Bearer invalid-token"})
        assert resp2.status_code == 401


@pytest.mark.asyncio
async def test_user_profile_lifecycle():
    """Verify GET, PATCH, and DELETE /api/users/me flow."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-patient-007"}

        # 1. First get auto-creates profile
        res_get = await client.get("/api/users/me", headers=headers)
        assert res_get.status_code == 200
        profile = res_get.json()
        assert profile["uid"] == "patient-007"
        assert profile["hipaa_consent_given"] is True

        # 2. Update profile
        update_payload = {
            "display_name": "James Vance",
            "emergency_contact_name": "Dr. Sarah Vance",
            "emergency_contact_phone": "+1-555-0199",
        }
        res_patch = await client.patch("/api/users/me", json=update_payload, headers=headers)
        assert res_patch.status_code == 200
        updated = res_patch.json()
        assert updated["display_name"] == "James Vance"
        assert updated["emergency_contact_phone"] == "+1-555-0199"

        # 3. Purge account
        res_delete = await client.delete("/api/users/me", headers=headers)
        assert res_delete.status_code == 200
        assert res_delete.json()["status"] == "success"
