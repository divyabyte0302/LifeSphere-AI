"""Emergency contact Pydantic models for LifeSphere AI-X."""

from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class EmergencyContactCreate(BaseModel):
    """Payload for registering or updating an emergency contact."""
    name: str = Field(..., max_length=128, description="Full name of emergency contact")
    relationship: str = Field(..., max_length=64, description="Relationship to user (e.g., Spouse, Physician, Parent)")
    phone: str = Field(..., max_length=32, description="Primary telephone number for SMS & voice alerts")
    email: Optional[str] = Field(default=None, max_length=128, description="Email address for secure notifications")
    priority: int = Field(default=1, ge=1, le=5, description="Contact priority order for notification escalation (1 = highest)")
    is_primary: bool = Field(default=False, description="Designates whether contact is the primary emergency respondent")
    has_explicit_consent: bool = Field(default=True, description="Explicit user and contact consent status for health data sharing")
    push_enabled: bool = Field(default=True, description="Enable push notifications")
    sms_enabled: bool = Field(default=True, description="Enable SMS alerts")
    in_app_enabled: bool = Field(default=True, description="Enable in-app alerts")


class EmergencyContact(EmergencyContactCreate):
    """Persisted emergency contact record including database identifiers."""
    id: str = Field(..., description="Unique document ID")
    user_id: str = Field(..., description="Owner Firebase UID")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp of creation")
