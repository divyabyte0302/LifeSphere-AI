"""Environmental Observations Endpoints.

Provides:
- POST /api/environment/observations: Ingest environmental observations.
- GET /api/environment/current: Retrieve current ambient conditions and caution level.
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, Header, status
from app.dependencies.auth import get_current_user
from app.schemas import (
    EnvironmentObservationCreate,
    EnvironmentObservation,
    CurrentEnvironmentResponse,
)
from app.services.firestore_service import firestore_service

router = APIRouter(prefix="/api/environment", tags=["Environmental Intelligence"])


@router.post(
    "/observations",
    response_model=EnvironmentObservation,
    status_code=status.HTTP_201_CREATED,
    summary="Record Environmental Telemetry Observation",
)
async def record_observation(
    payload: EnvironmentObservationCreate,
    authorization: Optional[str] = Header(None),
):
    """Ingest environmental reading (temperature, humidity, PM2.5, AQI).

    Accepts both authenticated patient device reports and unauthenticated city station broadcasts.
    Clearly marks whether data is simulated or received from physical/API sources.
    """
    uid = None
    if authorization:
        try:
            user = await get_current_user(authorization)
            uid = user.get("uid")
        except Exception:
            pass

    saved = await firestore_service.save_environment_observation(payload.model_dump(), uid=uid)
    return EnvironmentObservation(**saved)


@router.get(
    "/current",
    response_model=CurrentEnvironmentResponse,
    summary="Get Current Ambient Environmental Exposure",
)
async def get_current_environment():
    """Retrieve current ambient conditions with automated caution advisory."""
    obs_dict = await firestore_service.get_latest_environment()
    obs = EnvironmentObservation(**obs_dict)

    caution = "Normal Baseline"
    summary = "Ambient conditions are within healthy parameters."

    if obs.air_quality_index > 150 or obs.pm25 > 55.4:
        caution = "High Advisory (Unhealthy Air)"
        summary = f"Elevated PM2.5 concentration ({obs.pm25:.1f} µg/m³) exceeds safety thresholds."
    elif obs.air_quality_index > 100 or obs.pm25 > 35.4:
        caution = "Moderate Caution (Sensitive Groups)"
        summary = f"Air quality index ({obs.air_quality_index}) may affect sensitive respiratory profiles."
    elif obs.temperature_celsius > 35.0:
        caution = "Elevated Thermal Advisory"
        summary = f"Ambient temperature ({obs.temperature_celsius:.1f} °C) indicates heightened heat-stress potential."

    return CurrentEnvironmentResponse(
        current=obs,
        is_simulated=obs.is_simulated,
        data_source=(
            "Simulated Demonstration Feed"
            if obs.is_simulated
            else "Calibrated Environmental Sensor Stream"
        ),
        status_summary=summary,
        caution_level=caution,
    )
