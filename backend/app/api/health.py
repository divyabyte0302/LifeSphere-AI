"""Health Data Endpoints for LifeSphere AI-X.

Provides:
- GET /api/health: Service readiness and health check.
- POST /api/health/measurements: Ingest and persist validated biometric measurements.
- GET /api/health/measurements: Retrieve bounded historical measurements for authenticated user.
- GET /api/health/summary: Compute 24-hour summary metrics and trends.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query, status
from app.config import settings
from app.dependencies.auth import get_current_user
from app.firebase_setup import get_firestore_client, is_mock_mode
from app.schemas import (
    HealthCheckResponse,
    HealthMeasurementCreate,
    HealthMeasurement,
    HealthSummaryResponse,
)
from app.services.firestore_service import firestore_service

router = APIRouter(prefix="/api/health", tags=["Health Telemetry"])


@router.get("", response_model=HealthCheckResponse, summary="System Health and Readiness Check")
async def get_service_health():
    """Unauthenticated system health probe for monitors, containers, and frontend readiness checks."""
    client = get_firestore_client()
    return HealthCheckResponse(
        status="healthy",
        service="LifeSphere AI-X Health-Environment Engine",
        version="2.4.0-phase3",
        environment=settings.environment,
        firebase_auth_ready=not is_mock_mode() or settings.firebase_mock_auth_for_dev,
        firestore_ready=client is not None or is_mock_mode(),
    )


@router.post(
    "/measurements",
    response_model=HealthMeasurement,
    status_code=status.HTTP_201_CREATED,
    summary="Record New Health Measurement",
)
async def create_measurement(
    payload: HealthMeasurementCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Store a validated physiological measurement in users/{uid}/measurements.

    Validates physiological bounds (HR: 30-240 bpm, SpO2: 70-100%, Temp: 30-45°C).
    Missing values are never silently fabricated.
    """
    uid = current_user["uid"]
    saved = await firestore_service.save_measurement(uid, payload.model_dump())
    return HealthMeasurement(**saved)


@router.get(
    "/measurements",
    response_model=List[HealthMeasurement],
    summary="List Authenticated User Measurements",
)
async def list_measurements(
    limit: int = Query(default=20, ge=1, le=100, description="Maximum records to return"),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve historical telemetry records strictly isolated to the caller's verified UID."""
    uid = current_user["uid"]
    records = await firestore_service.get_measurements(uid, limit=limit)
    return [HealthMeasurement(**r) for r in records]


@router.get(
    "/summary",
    response_model=HealthSummaryResponse,
    summary="Get 24-Hour Physiological Summary",
)
async def get_health_summary(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Calculate summary statistics (average, min, max, trend) for the authenticated user."""
    uid = current_user["uid"]
    measurements = await firestore_service.get_measurements(uid, limit=50)

    if not measurements:
        return HealthSummaryResponse(
            user_id=uid,
            total_measurements=0,
            latest_measurement=None,
            average_heart_rate_24h=None,
            average_spo2_24h=None,
            min_spo2_24h=None,
            max_heart_rate_24h=None,
            recent_trend="insufficient_data",
        )

    hr_values = [m["heart_rate"] for m in measurements if "heart_rate" in m]
    spo2_values = [m["spo2"] for m in measurements if "spo2" in m]

    avg_hr = round(sum(hr_values) / len(hr_values), 1) if hr_values else None
    avg_spo2 = round(sum(spo2_values) / len(spo2_values), 1) if spo2_values else None
    min_spo2 = min(spo2_values) if spo2_values else None
    max_hr = max(hr_values) if hr_values else None

    # Simple trend calculation comparing latest vs prior
    trend = "stable"
    if len(hr_values) >= 2:
        if hr_values[0] > hr_values[1] + 8:
            trend = "elevated_pulse"
        elif hr_values[0] < hr_values[1] - 8:
            trend = "recovering_pulse"

    latest = HealthMeasurement(**measurements[0])

    return HealthSummaryResponse(
        user_id=uid,
        total_measurements=len(measurements),
        latest_measurement=latest,
        average_heart_rate_24h=avg_hr,
        average_spo2_24h=avg_spo2,
        min_spo2_24h=min_spo2,
        max_heart_rate_24h=max_hr,
        recent_trend=trend,
    )
