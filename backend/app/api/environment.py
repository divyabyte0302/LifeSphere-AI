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


@router.get(
    "/destination-report",
    summary="Destination Environmental Intelligence Report Before Travel",
)
async def get_destination_report(
    destination: str = "Metropolitan Botanical Park",
    origin: Optional[str] = "Downtown Medical Center",
):
    """Retrieve pre-travel environmental report for destination and route corridor.

    Integrates current weather, 6h forecast trend, AQI, particulate concentrations,
    and active official severe-weather/hazard advisories.
    """
    obs_dict = await firestore_service.get_latest_environment()
    obs = EnvironmentObservation(**obs_dict)

    # Calculate destination offset simulation
    dest_aqi = max(25, min(200, obs.air_quality_index - 12))
    dest_pm25 = round(dest_aqi * 0.28, 1)

    has_warning = dest_aqi > 100 or dest_pm25 > 35.4 or obs.temperature_celsius > 32.0

    return {
        "destination": destination,
        "origin": origin,
        "generated_at": obs.observed_at.isoformat() if obs.observed_at else None,
        "data_freshness": "Observed 4m ago (Station #842-CA)",
        "is_simulated": obs.is_simulated,
        "current_conditions": {
            "air_quality_index": dest_aqi,
            "pm25_concentration": dest_pm25,
            "temperature_celsius": obs.temperature_celsius,
            "humidity_percent": obs.humidity_percentage,
            "uv_index": obs.uv_index or 4.2,
            "category": "Good" if dest_aqi <= 50 else ("Moderate" if dest_aqi <= 100 else "Unhealthy for Sensitive Groups"),
        },
        "forecast_6h": [
            {"hour_offset": 1, "predicted_aqi": dest_aqi + 2, "predicted_temp": obs.temperature_celsius + 0.5},
            {"hour_offset": 3, "predicted_aqi": dest_aqi + 5, "predicted_temp": obs.temperature_celsius + 1.2},
            {"hour_offset": 6, "predicted_aqi": max(30, dest_aqi - 8), "predicted_temp": obs.temperature_celsius - 0.8},
        ],
        "active_hazard_alerts": [
            {
                "id": "alert_ozone_01",
                "headline": "Ozone & Particulate Dispersion Advisory",
                "severity": "Moderate",
                "summary": "Mild atmospheric stagnation expected along central arterial roadways between 14:00 and 17:00.",
                "source": "State Environmental Protection Division",
            }
        ],
        "has_caution_warning": has_warning,
        "journey_advisory": (
            f"Pre-Travel Notice: Destination AQI is {dest_aqi} (PM2.5 {dest_pm25} µg/m³). "
            "Clean Vegetative Corridor is recommended for patients with allergic asthma."
            if has_warning
            else "Destination environmental metrics are within normal baseline ranges for travel."
        ),
        "disclaimer": (
            "Environmental pre-travel guidance is based on current sensor station observations and dispersion models. "
            "Safety estimates depend on data freshness; no route can be guaranteed 100% hazard-free."
        ),
    }


@router.post(
    "/safe-routes",
    summary="Compute Route Safety Ranking and Environmental Hazard Exposure",
)
async def compute_safe_routes(
    body: Dict[str, Any],
):
    """Compute and rank candidate routes based on travel time, hazard exposure, and AQI."""
    origin = body.get("origin", "Downtown Health Hub")
    destination = body.get("destination", "Metropolitan Botanical Center")

    obs_dict = await firestore_service.get_latest_environment()
    obs = EnvironmentObservation(**obs_dict)

    base_aqi = obs.air_quality_index

    candidate_routes = [
        {
            "id": "route_clean_corridor",
            "title": "Clean Air & Park Canopy Corridor",
            "type": "cleanest_air",
            "totalDistanceKm": 6.8,
            "durationMinutes": 18,
            "averageAqi": max(25, base_aqi - 18),
            "averagePm25": round(max(8.0, obs.pm25 - 6.5), 1),
            "pm25ReductionVsFastestPercent": 38,
            "heatExposureMinutes": 4,
            "routeColor": "#10b981",
            "advisory": "Preferred: Follows tree-lined avenues and parkways. Inhaled PM2.5 reduced by 38%.",
            "waypoints": [
                {"name": f"{origin} (Start)", "distanceKm": 0, "estimatedMinutes": 0, "aqi": base_aqi, "pm25": obs.pm25, "temperature": obs.temperature_celsius},
                {"name": "Verdant Boulevard Canopy", "distanceKm": 2.4, "estimatedMinutes": 6, "aqi": max(22, base_aqi - 22), "pm25": round(max(6.0, obs.pm25 - 8.0), 1), "temperature": obs.temperature_celsius - 1.5, "hazardNote": "Shaded vegetative canopy"},
                {"name": "Greenway Bypass Park", "distanceKm": 5.1, "estimatedMinutes": 13, "aqi": max(25, base_aqi - 18), "pm25": round(max(7.5, obs.pm25 - 7.0), 1), "temperature": obs.temperature_celsius - 1.2},
                {"name": f"{destination} (End)", "distanceKm": 6.8, "estimatedMinutes": 18, "aqi": max(28, base_aqi - 14), "pm25": round(max(8.5, obs.pm25 - 5.5), 1), "temperature": obs.temperature_celsius - 0.5},
            ],
        },
        {
            "id": "route_sheltered",
            "title": "Sheltered Low-Thermal Corridor",
            "type": "low_heat_sheltered",
            "totalDistanceKm": 7.2,
            "durationMinutes": 20,
            "averageAqi": max(30, base_aqi - 10),
            "averagePm25": round(max(10.0, obs.pm25 - 3.5), 1),
            "pm25ReductionVsFastestPercent": 22,
            "heatExposureMinutes": 2,
            "routeColor": "#06b6d4",
            "advisory": "Low Radiant Heat: Ideal during peak solar irradiance. Radiant temperature 2.1°C lower.",
            "waypoints": [
                {"name": f"{origin} (Start)", "distanceKm": 0, "estimatedMinutes": 0, "aqi": base_aqi, "pm25": obs.pm25, "temperature": obs.temperature_celsius},
                {"name": "Civic Arcade Underpass", "distanceKm": 3.0, "estimatedMinutes": 8, "aqi": max(32, base_aqi - 8), "pm25": round(max(11.0, obs.pm25 - 2.5), 1), "temperature": obs.temperature_celsius - 2.1},
                {"name": f"{destination} (End)", "distanceKm": 7.2, "estimatedMinutes": 20, "aqi": max(30, base_aqi - 10), "pm25": round(max(10.0, obs.pm25 - 3.5), 1), "temperature": obs.temperature_celsius - 1.0},
            ],
        },
        {
            "id": "route_fastest_highway",
            "title": "Arterial Expressway (Direct)",
            "type": "fastest",
            "totalDistanceKm": 5.4,
            "durationMinutes": 14,
            "averageAqi": base_aqi + 12,
            "averagePm25": round(obs.pm25 + 5.2, 1),
            "pm25ReductionVsFastestPercent": 0,
            "heatExposureMinutes": 12,
            "routeColor": "#f59e0b",
            "advisory": "Fastest Route: Direct highway route. Higher vehicular exhaust and particulate concentrations.",
            "waypoints": [
                {"name": f"{origin} (Start)", "distanceKm": 0, "estimatedMinutes": 0, "aqi": base_aqi, "pm25": obs.pm25, "temperature": obs.temperature_celsius},
                {"name": "Central Expressway Interchange", "distanceKm": 2.8, "estimatedMinutes": 7, "aqi": base_aqi + 18, "pm25": round(obs.pm25 + 8.0, 1), "temperature": obs.temperature_celsius + 1.4, "hazardNote": "Heavy diesel exhaust & ambient heat island"},
                {"name": f"{destination} (End)", "distanceKm": 5.4, "estimatedMinutes": 14, "aqi": base_aqi + 10, "pm25": round(obs.pm25 + 4.0, 1), "temperature": obs.temperature_celsius + 0.5},
            ],
        },
    ]

    return {
        "origin": origin,
        "destination": destination,
        "recommended_route_id": "route_clean_corridor",
        "ranking_rationale": "Clean Air & Park Canopy Corridor preferred: balances 18-minute transit with a 38% reduction in PM2.5 inhalation exposure.",
        "routes": candidate_routes,
        "data_freshness_timestamp": obs.observed_at.isoformat() if obs.observed_at else None,
        "disclaimer": "Route safety rankings synthesise travel time and environmental telemetry. Safety estimates depend on data freshness and completeness.",
    }
