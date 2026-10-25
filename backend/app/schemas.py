"""LifeSphere AI-X Typed Data Schemas.

All schemas enforce strict type validation, UTC datetime compliance,
and clear separation between verified telemetry, user inputs, and simulated signals.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


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
    forecast_model: str = "LifeSphere Multi-Horizon Preventive Risk Model"


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
    is_experimental: bool = False
    clinical_disclaimer: str = (
        "Preventive health advisory only. This risk score synthesizes continuous vitals and atmospheric telemetry "
        "for behavioral guidance and is not a substitute for emergency clinical care."
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
        "Emergency telemetry packet logged. Real-time alert notifications dispatched to designated emergency contacts."
    )


class EmergencyAlertResponse(BaseModel):
    alert: EmergencyAlert
    message: str


# ============================================================================
# Module 2: Emergency Contacts, Alert Rules & SOS Schemas
# ============================================================================

class EmergencyContactCreate(BaseModel):
    name: str = Field(..., max_length=128)
    relationship: str = Field(..., max_length=64)
    phone: str = Field(..., max_length=32)
    email: Optional[str] = Field(default=None, max_length=128)
    priority: int = Field(default=1, ge=1, le=5, description="Contact escalation priority (1 = primary)")
    is_primary: bool = Field(default=False)
    has_explicit_consent: bool = Field(default=True)
    push_enabled: bool = Field(default=True)
    sms_enabled: bool = Field(default=True)
    in_app_enabled: bool = Field(default=True)


class EmergencyContact(EmergencyContactCreate):
    id: str
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EmergencyAlertRuleCreate(BaseModel):
    name: str = Field(..., max_length=128)
    metric: str = Field(..., max_length=64)
    condition: str = Field(..., max_length=32)
    threshold: float
    secondary_metric: Optional[str] = None
    secondary_threshold: Optional[float] = None
    duration_seconds: int = Field(default=60, ge=0)
    severity: str = Field(default="critical", max_length=32)
    is_enabled: bool = Field(default=True)
    reject_invalid_readings: bool = Field(default=True)
    max_reading_age_minutes: int = Field(default=15, ge=1)


class EmergencyAlertRule(EmergencyAlertRuleCreate):
    id: str
    user_id: str


class EmergencySosRequest(BaseModel):
    reason: Optional[str] = None
    alert_reason: Optional[str] = None
    user_confirmed: bool = Field(default=True)
    heart_rate: Optional[int] = None
    spo2: Optional[float] = None
    systolic: Optional[int] = None
    diastolic: Optional[int] = None
    temperature: Optional[float] = None
    pm25: Optional[float] = None
    aqi: Optional[int] = None
    reading_timestamp: Optional[datetime] = None
    reading_age_minutes: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_location_consented: bool = Field(default=False)
    local_emergency_number: str = Field(default="911")
    suppression_window_seconds: int = Field(default=120, ge=0)
    caller_device_platform: Optional[str] = "Web SaaS"


class EmergencyAcknowledgeRequest(BaseModel):
    acknowledged_by: str = Field(..., max_length=128)
    notes: Optional[str] = Field(default=None, max_length=1024)


class EmergencyEscalateRequest(BaseModel):
    reason: str = Field(default="Primary contacts unacknowledged after timeout", max_length=255)
    escalate_to: List[str] = Field(default_factory=lambda: ["Physician", "Secondary Contacts"])


class EmergencyRetryRequest(BaseModel):
    failed_contact_ids: Optional[List[str]] = None
    channel: Optional[str] = None


# ============================================================================
# Module 1: Monthly Health Checkup & Recurring Appointment Schemas
# ============================================================================

class AppointmentCategory(str, Enum):
    ROUTINE_CHECKUP = "routine_checkup"
    CARDIOLOGY = "cardiology"
    PULMONOLOGY = "pulmonology"
    ALLERGY_IMMUNOLOGY = "allergy_immunology"
    ANNUAL_PHYSICAL = "annual_physical"
    LAB_WORK = "lab_work"
    TELEHEALTH = "telehealth"


class AppointmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    MISSED = "missed"


class ReminderFrequency(str, Enum):
    ONCE = "once"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUAL = "annual"


class NotificationDeliveryStatus(str, Enum):
    SCHEDULED = "scheduled"
    DELIVERED = "delivered"
    DISMISSED = "dismissed"
    FAILED = "failed"


class ReminderPreferences(BaseModel):
    lead_time_hours: int = Field(default=24, ge=1, le=168, description="Advance reminder hours prior to checkup (1 to 168)")
    push_enabled: bool = Field(default=True, description="Deliver browser/FCM push notification")
    email_enabled: bool = Field(default=False, description="Deliver secure email notification")
    in_app_enabled: bool = Field(default=True, description="Display in-app checkup agenda banner")


class AppointmentCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255, description="Appointment title, e.g. Monthly Pulmonology Follow-Up")
    description: Optional[str] = Field(default=None, max_length=1000)
    doctor_or_specialist: str = Field(..., min_length=2, max_length=150, description="Attending physician or clinic name")
    category: AppointmentCategory = Field(default=AppointmentCategory.ROUTINE_CHECKUP)
    scheduled_date_time: datetime = Field(..., description="UTC ISO scheduled appointment timestamp")
    duration_minutes: int = Field(default=30, ge=10, le=240)
    frequency: ReminderFrequency = Field(default=ReminderFrequency.MONTHLY, description="Checkup recurrence frequency")
    location: Optional[str] = Field(default="St. Jude Respiratory & Preventive Clinic", max_length=255)
    is_telehealth: bool = Field(default=False)
    telehealth_link: Optional[str] = Field(default=None, max_length=512)
    reminder_preferences: ReminderPreferences = Field(default_factory=ReminderPreferences)
    notes: Optional[str] = Field(default=None, max_length=1000)


class AppointmentUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    doctor_or_specialist: Optional[str] = Field(default=None, min_length=2, max_length=150)
    category: Optional[AppointmentCategory] = None
    scheduled_date_time: Optional[datetime] = None
    duration_minutes: Optional[int] = Field(default=None, ge=10, le=240)
    status: Optional[AppointmentStatus] = None
    frequency: Optional[ReminderFrequency] = None
    location: Optional[str] = Field(default=None, max_length=255)
    is_telehealth: Optional[bool] = None
    telehealth_link: Optional[str] = None
    reminder_preferences: Optional[ReminderPreferences] = None
    notes: Optional[str] = None


class Appointment(AppointmentCreate):
    id: str
    user_id: str
    status: AppointmentStatus = AppointmentStatus.SCHEDULED
    next_recurrence_date: Optional[datetime] = None
    parent_appointment_id: Optional[str] = None
    recurrence_cycle: int = 1
    notification_delivery_status: NotificationDeliveryStatus = NotificationDeliveryStatus.SCHEDULED
    delivery_timestamp: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AppointmentResponse(BaseModel):
    appointment: Appointment
    message: str


class AppointmentListResponse(BaseModel):
    user_id: str
    appointments: List[Appointment]
    upcoming_count: int
    completed_count: int
    missed_count: int
    total_count: int


class RecurrenceProcessResult(BaseModel):
    processed_count: int
    delivered_reminders_count: int
    new_recurrences_created: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    details: List[str] = []


# ============================================================================
# Module 6: Health Analytics & Longitudinal Chart Schemas
# ============================================================================

class BiomarkerType(str, Enum):
    HEART_RATE = "heart_rate"
    BLOOD_PRESSURE = "blood_pressure"
    SPO2 = "spo2"
    SLEEP = "sleep"
    TEMPERATURE = "temperature"
    STEPS = "steps"
    AQI_EXPOSURE = "aqi_exposure"
    RISK_SCORE = "risk_score"


class AnalyticsTimeHorizon(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class AnalyticsTrendPoint(BaseModel):
    timestamp: datetime
    metric_type: BiomarkerType
    value: float
    secondary_value: Optional[float] = None
    unit: str
    site_or_stage: Optional[str] = None
    is_interpolated: bool = False
    is_missing: bool = False
    quality_score: float = 100.0
    source: Optional[str] = "LifeSphere Telemetry Hub"


class BiomarkerSummary(BaseModel):
    metric_type: BiomarkerType
    metricType: Optional[str] = None
    label: str
    current_value: float
    currentValue: Optional[float] = None
    secondary_current: Optional[float] = None
    secondaryCurrent: Optional[float] = None
    unit: str
    average_value: float
    averageValue: Optional[float] = None
    min_value: float
    minValue: Optional[float] = None
    max_value: float
    maxValue: Optional[float] = None
    trend_direction: str = "stable"
    trendDirection: Optional[str] = "stable"
    percentage_change: float = 0.0
    percentageChange: Optional[float] = 0.0
    clinical_evaluation: str = ""
    clinicalEvaluation: Optional[str] = ""
    threshold_band: str = ""
    thresholdBand: Optional[str] = ""

    model_config = ConfigDict(populate_by_name=True, extra="allow")


class HealthAnalyticsResponse(BaseModel):
    user_id: str
    horizon: AnalyticsTimeHorizon
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    trends: List[AnalyticsTrendPoint]
    summaries: List[BiomarkerSummary]
    environmental_correlation: Dict[str, Any]
    disclaimer: str = (
        "Preventive health analytics for longitudinal trend evaluation. "
        "Does not constitute automated diagnostic adjudication."
    )


# ============================================================================
# Module 8: Wearable & Health Connect / HealthKit Integration Schemas
# ============================================================================

class WearableProviderType(str, Enum):
    ANDROID_HEALTH_CONNECT = "android_health_connect"
    APPLE_HEALTHKIT = "apple_healthkit"
    POLAR = "polar"
    OURA = "oura"
    GARMIN = "garmin"
    FITBIT = "fitbit"
    APPLE_WATCH = "apple_watch"
    GENERIC_BLUETOOTH_GATT = "generic_bluetooth_gatt"


class WearableMeasurementType(str, Enum):
    HEART_RATE = "heart_rate"
    HRV = "hrv"
    BLOOD_PRESSURE = "blood_pressure"
    SPO2 = "spo2"
    SLEEP_SESSION = "sleep_session"
    BODY_TEMPERATURE = "body_temperature"
    SKIN_TEMPERATURE = "skin_temperature"
    STEPS = "steps"
    ACTIVE_CALORIES = "active_calories"
    RESPIRATORY_RATE = "respiratory_rate"


class WearableConnectionStatus(str, Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    PENDING_AUTHORIZATION = "pending_authorization"
    PERMISSION_REVOKED = "permission_revoked"
    ERROR = "error"


class WearableConnectRequest(BaseModel):
    provider: WearableProviderType
    device_name: str = Field(..., min_length=2, max_length=128)
    permissions: List[str] = Field(default_factory=list)
    user_authorized: bool = Field(
        default=True,
        description="Must be True to confirm explicit user consent for selected wearable record types",
    )


class WearableConnection(BaseModel):
    id: str
    user_id: str
    provider: WearableProviderType
    device_name: str
    status: WearableConnectionStatus
    permissions_granted: List[str] = Field(default_factory=list)
    last_sync_at: Optional[datetime] = None
    sync_error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WearableMeasurementRecord(BaseModel):
    source_record_id: str = Field(
        ...,
        min_length=1,
        max_length=128,
        description="Stable unique record ID from device/Health Connect to guarantee idempotency",
    )
    provider: WearableProviderType
    measurement_type: WearableMeasurementType
    numeric_value: float = Field(..., description="Primary numeric value")
    secondary_value: Optional[float] = Field(default=None, description="Secondary value (e.g., diastolic BP or deep sleep hours)")
    unit: str = Field(..., min_length=1, max_length=32, description="Standard clinical unit e.g. bpm, %, mmHg, °C, hours, count, ms")
    measured_at: datetime = Field(..., description="Original UTC timestamp when recorded by sensor")
    source_device_name: Optional[str] = Field(default=None, max_length=128)
    provenance_metadata: Dict[str, Any] = Field(default_factory=dict)
    is_missing: bool = Field(default=False)
    quality_score: float = Field(default=1.0, ge=0.0, le=1.0)


class WearableBatchSyncRequest(BaseModel):
    connection_id: str = Field(..., min_length=1, max_length=128)
    provider: WearableProviderType
    measurements: List[WearableMeasurementRecord] = Field(
        ...,
        max_length=500,
        description="Bounded batch of max 500 records per request",
    )


class WearableSyncHistoryEntry(BaseModel):
    id: str
    user_id: str
    connection_id: str
    provider: WearableProviderType
    records_imported: int
    records_skipped_duplicate: int
    records_failed: int
    status: str = Field(..., description="success, partial_success, or failed")
    error_details: Optional[str] = None
    synced_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


