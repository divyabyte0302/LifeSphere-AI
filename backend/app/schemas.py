"""LifeSphere AI-X Typed Data Schemas.

All schemas enforce strict type validation, UTC datetime compliance,
and clear separation between verified telemetry, user inputs, and simulated signals.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


# ============================================================================
# Enums
# ============================================================================

class ActivityLevel(str, Enum):
    RESTING = "resting"
    SEDENTARY = "sedentary"
    LIGHT = "light"
    MODERATE = "moderate"
    VIGOROUS = "vigorous"


class RiskCategory(str, Enum):
    LOW = "low"
    MODERATE = "moderate"
    ELEVATED = "elevated"
    HIGH = "high"
    CRITICAL = "critical"


class EmergencyStatus(str, Enum):
    PENDING_CONFIRMATION = "pending_confirmation"
    CONFIRMED_BY_USER = "confirmed_by_user"
    CANCELLED = "cancelled"
    RESOLVED = "resolved"


class UserRole(str, Enum):
    USER = "USER"
    DOCTOR = "DOCTOR"
    ADMIN = "ADMIN"


# ============================================================================
# Base and Standard Responses
# ============================================================================

class HealthCheckResponse(BaseModel):
    status: str = "healthy"
    service: str = "LifeSphere AI-X Health-Environment Engine"
    version: str = "2.4.0-phase3"
    environment: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    firebase_auth_ready: bool
    firestore_ready: bool


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    code: str = "BAD_REQUEST"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================================================
# User Profile Schemas
# ============================================================================

class UserProfileBase(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=100)
    email: Optional[str] = Field(default=None)
    role: UserRole = Field(default=UserRole.USER)
    primary_condition: Optional[str] = Field(
        default=None,
        description="e.g. Asthma, Cardiovascular, Seasonal Allergy, Athletic Conditioning",
    )
    hipaa_consent_given: bool = Field(default=True)
    emergency_contact_phone: Optional[str] = Field(default=None)
    emergency_contact_name: Optional[str] = Field(default=None)


class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=100)
    primary_condition: Optional[str] = Field(default=None)
    emergency_contact_phone: Optional[str] = Field(default=None)
    emergency_contact_name: Optional[str] = Field(default=None)
    hipaa_consent_given: Optional[bool] = None


class UserProfile(UserProfileBase):
    uid: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================================================
# Health Measurements Schemas
# ============================================================================

class HealthMeasurementCreate(BaseModel):
    heart_rate: int = Field(..., ge=30, le=240, description="Heart rate in beats per minute (30-240 bpm)")
    spo2: float = Field(..., ge=70.0, le=100.0, description="Blood oxygen saturation percentage (70-100%)")
    body_temperature: Optional[float] = Field(
        default=None, ge=30.0, le=45.0, description="Body temperature in Celsius (30.0-45.0 °C)"
    )
    respiratory_rate: Optional[int] = Field(
        default=None, ge=6, le=60, description="Breaths per minute (6-60)"
    )
    systolic_bp: Optional[int] = Field(
        default=None, ge=60, le=260, description="Systolic blood pressure in mmHg"
    )
    diastolic_bp: Optional[int] = Field(
        default=None, ge=40, le=160, description="Diastolic blood pressure in mmHg"
    )
    activity_level: Optional[ActivityLevel] = Field(default=ActivityLevel.RESTING)
    recorded_at: Optional[datetime] = Field(
        default=None, description="Observation timestamp; defaults to server UTC if omitted"
    )
    sensor_source: Optional[str] = Field(
        default="manual_or_wearable", description="Source device identifier e.g. Polar H10, Apple Watch"
    )

    @field_validator("recorded_at", mode="before")
    @classmethod
    def set_recorded_at(cls, v: Any) -> Any:
        if v is None:
            return datetime.now(timezone.utc)
        return v


class HealthMeasurement(HealthMeasurementCreate):
    id: str
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class HealthSummaryResponse(BaseModel):
    user_id: str
    total_measurements: int
    latest_measurement: Optional[HealthMeasurement] = None
    average_heart_rate_24h: Optional[float] = None
    average_spo2_24h: Optional[float] = None
    min_spo2_24h: Optional[float] = None
    max_heart_rate_24h: Optional[int] = None
    recent_trend: str = "stable"
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================================================
# Hydration Entry Schemas (users/{uid}/hydration/{recordId})
# ============================================================================

class HydrationEntryCreate(BaseModel):
    volume_ml: float = Field(gt=0, le=5000, description="Intake volume in milliliters")
    effective_ml: Optional[float] = Field(default=None, ge=0, le=6000)
    beverage_type: str = Field(default="water", max_length=64)
    source: Optional[str] = Field(default="quick_preset", max_length=64)
    notes: Optional[str] = Field(default=None, max_length=512)
    timestamp: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    time_formatted: Optional[str] = Field(default=None, max_length=32)


class HydrationEntry(HydrationEntryCreate):
    id: str
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))



# ============================================================================
# Environmental Observations Schemas
# ============================================================================

class LocationContext(BaseModel):
    city: str = Field(default="Urban Metro", max_length=100)
    latitude: Optional[float] = Field(default=None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(default=None, ge=-180.0, le=180.0)
    zone_description: Optional[str] = Field(default="Commercial / Residential Basin")


class EnvironmentObservationCreate(BaseModel):
    temperature_celsius: float = Field(..., ge=-50.0, le=60.0, description="Ambient temperature in °C")
    humidity_percentage: float = Field(..., ge=0.0, le=100.0, description="Relative humidity %")
    pm25: float = Field(..., ge=0.0, le=1000.0, description="PM2.5 particulate concentration in µg/m³")
    air_quality_index: int = Field(..., ge=0, le=500, description="US EPA standard AQI scale (0-500)")
    ozone_ppb: Optional[float] = Field(default=None, ge=0.0, le=500.0)
    uv_index: Optional[float] = Field(default=None, ge=0.0, le=20.0)
    location: LocationContext = Field(default_factory=LocationContext)
    is_simulated: bool = Field(
        default=False,
        description="True if generated from UI simulation slider/demo, False if received from real environmental sensor/API",
    )
    observed_at: Optional[datetime] = Field(default=None)

    @field_validator("observed_at", mode="before")
    @classmethod
    def set_observed_at(cls, v: Any) -> Any:
        if v is None:
            return datetime.now(timezone.utc)
        return v


class EnvironmentObservation(EnvironmentObservationCreate):
    id: str
    user_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CurrentEnvironmentResponse(BaseModel):
    current: EnvironmentObservation
    is_simulated: bool
    data_source: str = "LifeSphere Environmental Fusion Engine (Demonstration)"
    status_summary: str
    caution_level: str


# ============================================================================
# Risk Prediction Schemas
# ============================================================================

class RiskFactor(BaseModel):
    factor_name: str
    contribution_weight: float = Field(description="Normalized relative contribution percentage (0-100%)")
    observed_value: str
    reference_threshold: str
    clinical_rationale: str


class ForecastHorizonRisk(BaseModel):
    horizon_hours: int = Field(description="Forecast horizon in hours (1, 6, 12, 24)")
    predicted_risk_score: float = Field(ge=0.0, le=100.0)
    predicted_risk_category: RiskCategory
    confidence_level: float = Field(ge=0.0, le=1.0)
    key_drivers: List[str]
    forecast_model: str = "Demonstration Heuristic Multi-Horizon Model (Phase 2/3 Prototype)"


class RiskAssessmentRequest(BaseModel):
    health_measurement: HealthMeasurementCreate
    environment_observation: EnvironmentObservationCreate
    pre_existing_conditions: Optional[List[str]] = Field(default_factory=list)


class RiskAssessmentResponse(BaseModel):
    id: str
    user_id: str
    life_risk_score: float = Field(ge=0.0, le=100.0, description="Overall transparent composite risk score (0-100)")
    risk_category: RiskCategory
    confidence_score: float = Field(ge=0.0, le=1.0, description="Model calibrated confidence (0.0 to 1.0)")
    heat_stress_risk: RiskCategory
    dehydration_risk: RiskCategory
    respiratory_environmental_risk: RiskCategory
    contributing_factors: List[RiskFactor]
    forecasts: List[ForecastHorizonRisk]
    is_experimental: bool = True
    clinical_disclaimer: str = (
        "Academic prototype demonstration only. This risk score is not a clinically validated probability "
        "and is not a substitute for professional medical assessment or diagnostic equipment."
    )
    assessed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RiskHistoryResponse(BaseModel):
    user_id: str
    total_assessments: int
    history: List[RiskAssessmentResponse]


# ============================================================================
# Preventive Recommendations Schemas
# ============================================================================

class PreventiveRecommendation(BaseModel):
    id: str
    category: str = Field(description="e.g. Environmental Protection, Hydration, Activity Adjustment")
    priority: str = Field(description="Urgent, Moderate, or General")
    recommendation_text: str
    rationale: str
    action_item: str


class RecommendationRequest(BaseModel):
    risk_assessment: RiskAssessmentResponse
    user_lifestyle_context: Optional[Dict[str, Any]] = None


class RecommendationResponse(BaseModel):
    user_id: str
    recommendations: List[PreventiveRecommendation]
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    disclaimer: str = (
        "General wellness and preventive guidance only. LifeSphere AI-X does not provide medical diagnoses "
        "or replace medical treatments. In case of acute discomfort, contact emergency medical services immediately."
    )


# ============================================================================
# Emergency Alert Schemas
# ============================================================================

class EmergencyAlertCreate(BaseModel):
    alert_reason: str = Field(..., max_length=255, description="Primary reason for triggering emergency workflow")
    user_confirmed: bool = Field(
        ...,
        description="Explicit user confirmation required. Real external emergency action cannot proceed without user agreement.",
    )
    current_heart_rate: Optional[int] = Field(default=None)
    current_spo2: Optional[float] = Field(default=None)
    current_aqi: Optional[int] = Field(default=None)
    location_summary: Optional[str] = Field(default="Last Known User Device Coordinates")
    notes: Optional[str] = Field(default=None)


class EmergencyAlert(EmergencyAlertCreate):
    id: str
    user_id: str
    status: EmergencyStatus
    triggered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    confirmed_at: Optional[datetime] = None
    notification_dispatched: bool = False
    disclaimer: str = (
        "DEMONSTRATION SOS RECORD. Emergency services (911/112) have NOT been contacted automatically. "
        "This platform is an academic prototype and is not connected to a live public safety answering point (PSAP)."
    )


class EmergencyAlertResponse(BaseModel):
    alert: EmergencyAlert
    message: str
