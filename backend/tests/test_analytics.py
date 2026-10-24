"""Tests for Health Analytics and Longitudinal Chart Endpoints."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

settings.firebase_mock_auth_for_dev = True


@pytest.mark.asyncio
async def test_get_health_trends_weekly():
    """Verify GET /api/analytics/trends returns weekly aggregated points."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-alex"}
        res = await client.get("/api/analytics/trends?horizon=weekly", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert data["horizon"] == "weekly"
        assert len(data["trends"]) > 0
        assert len(data["summaries"]) > 0
        assert "environmental_correlation" in data
        assert any(pt["metric_type"] == "heart_rate" for pt in data["trends"])
        assert any(pt["metric_type"] == "blood_pressure" for pt in data["trends"])


@pytest.mark.asyncio
async def test_get_analytics_summary():
    """Verify GET /api/analytics/summary returns clinical biomarker cards."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-alex"}
        res = await client.get("/api/analytics/summary", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert "summaries" in data
        summaries = data["summaries"]
        assert any(s["metric_type"] == "blood_pressure" for s in summaries)


@pytest.mark.asyncio
async def test_analytics_data_integrity():
    """Verify chart values, units, timestamps, and summary calculations match."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-alex"}
        res = await client.get("/api/analytics/trends?horizon=monthly", headers=headers)
        assert res.status_code == 200
        data = res.json()

        hr_points = [p for p in data["trends"] if p["metric_type"] == "heart_rate"]
        assert len(hr_points) == 30
        hr_summary = next(s for s in data["summaries"] if s["metric_type"] == "heart_rate")

        # Mathematical verification of summaries against trend points
        expected_min = min(p["value"] for p in hr_points)
        expected_max = max(p["value"] for p in hr_points)
        expected_avg = round(sum(p["value"] for p in hr_points) / len(hr_points), 1)

        assert hr_summary["minValue"] == expected_min
        assert hr_summary["maxValue"] == expected_max
        assert abs(hr_summary["averageValue"] - expected_avg) < 0.2
        assert hr_summary["unit"] == "bpm"


@pytest.mark.asyncio
async def test_export_health_analytics_csv_scoped_to_user():
    """Verify GET /api/analytics/export returns text/csv strictly scoped to authenticated user."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Authorization": "Bearer mock-token-user-alex"}
        res = await client.get("/api/analytics/export?horizon=monthly", headers=headers)
        assert res.status_code == 200
        assert res.headers["content-type"].startswith("text/csv")
        csv_text = res.text

        # Verify header includes PatientID, units, and date range
        lines = csv_text.strip().split("\n")
        header = lines[0]
        assert "PatientID" in header
        assert "DateRangeStart" in header
        assert "Unit" in header

        # Verify every data row is strictly scoped to user-alex
        for row in lines[1:]:
            parts = row.split(",")
            assert parts[0] == '"user-alex"', f"Row leaked non-authenticated user data: {parts[0]}"
