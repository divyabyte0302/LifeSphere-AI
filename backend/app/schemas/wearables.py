"""Wearables and Health Connect / HealthKit Integration Schemas — Phase 8."""

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


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
    source_record_id: str = Field(..., description="Stable unique record ID from device/Health Connect to guarantee idempotency")
    provider: WearableProviderType
    measurement_type: WearableMeasurementType
    numeric_value: float = Field(..., description="Primary numeric value")
    secondary_value: Optional[float] = Field(default=None, description="Secondary value (e.g., diastolic BP)")
    unit: str = Field(..., description="Standard clinical unit e.g. bpm, %, mmHg, °C, count, ms")
    measured_at: datetime = Field(..., description="Original timestamp when recorded by sensor")
    source_device_name: Optional[str] = Field(default=None)
    provenance_metadata: Dict[str, Any] = Field(default_factory=dict)
    is_missing: bool = Field(default=False)
    quality_score: float = Field(default=1.0, ge=0.0, le=1.0)


class WearableBatchSyncRequest(BaseModel):
    connection_id: str
    provider: WearableProviderType
    measurements: List[WearableMeasurementRecord] = Field(..., max_length=500, description="Bounded batch of max 500 records")


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
