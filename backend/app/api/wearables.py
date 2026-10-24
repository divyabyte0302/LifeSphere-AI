"""Wearable Integration FastAPI Router — Phase 8.

Endpoints:
- GET /api/wearables/providers: List supported wearable providers and SDK adapters
- GET /api/wearables/connections: List user's connected wearable devices & permission status
- POST /api/wearables/connections: Connect/authorize a wearable device provider
- POST /api/wearables/measurements/batch: Import validated batch of measurements idempotently
- GET /api/wearables/sync-history: Retrieve synchronization audit history
- DELETE /api/wearables/connections/{connection_id}: Disconnect wearable device & revoke access
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.dependencies.auth import get_current_user
from app.schemas.wearables import (
    WearableProviderType,
    WearableConnection,
    WearableBatchSyncRequest,
    WearableSyncHistoryEntry,
)
from app.services.wearable_service import wearable_service

router = APIRouter(prefix="/api/wearables", tags=["Wearable & Health Connect Integrations"])


@router.get("/providers", summary="List Supported Wearable Providers")
async def list_wearable_providers(current_user: Dict[str, Any] = Depends(get_current_user)):
    """List all supported native and Bluetooth wearable provider adapters."""
    providers = [
        {
            "id": WearableProviderType.ANDROID_HEALTH_CONNECT.value,
            "name": "Android Health Connect",
            "platform": "Android (Native SDK)",
            "supported_metrics": ["heart_rate", "spo2", "blood_pressure", "sleep", "steps", "body_temperature"],
            "requires_companion_app": True,
            "description": "Unified Android health data repository with granular user permissions.",
        },
        {
            "id": WearableProviderType.APPLE_HEALTHKIT.value,
            "name": "Apple HealthKit",
            "platform": "iOS (Native Framework)",
            "supported_metrics": ["heart_rate", "spo2", "blood_pressure", "sleep", "body_temperature"],
            "requires_companion_app": True,
            "description": "Encrypted on-device health record repository for iOS devices.",
        },
        {
            "id": WearableProviderType.APPLE_WATCH.value,
            "name": "Apple Watch",
            "platform": "watchOS / iOS",
            "supported_metrics": ["heart_rate", "hrv", "spo2", "steps", "sleep"],
            "requires_companion_app": True,
            "description": "Continuous wrist telemetry via Apple HealthKit bridge.",
        },
        {
            "id": WearableProviderType.POLAR.value,
            "name": "Polar Fitness Sensors",
            "platform": "Cross-Platform BLE",
            "supported_metrics": ["heart_rate", "hrv", "respiratory_rate"],
            "requires_companion_app": False,
            "description": "Polar H10 / Verity Sense ECG and pulse telemetry via Bluetooth GATT.",
        },
        {
            "id": WearableProviderType.OURA.value,
            "name": "Oura Ring",
            "platform": "Cloud API / OAuth",
            "supported_metrics": ["sleep_session", "skin_temperature", "hrv", "resting_heart_rate"],
            "requires_companion_app": False,
            "description": "Advanced sleep staging and nocturnal temperature trend monitoring.",
        },
        {
            "id": WearableProviderType.GARMIN.value,
            "name": "Garmin Health",
            "platform": "Cloud API",
            "supported_metrics": ["steps", "active_calories", "heart_rate", "stress_level"],
            "requires_companion_app": False,
            "description": "Endurance training telemetry and daily activity tracking.",
        },
    ]
    return {"providers": providers, "count": len(providers)}


@router.get("/connections", summary="List Connected Wearable Devices")
async def list_wearable_connections(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieve connected wearable devices and permission statuses scoped strictly to authenticated user."""
    uid = current_user["uid"]
    connections = await wearable_service.get_user_connections(uid)
    return {"connections": connections, "count": len(connections)}


@router.post("/connections", status_code=status.HTTP_201_CREATED, summary="Connect Wearable Device")
async def connect_wearable_provider(
    payload: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Establish a connection to a wearable provider with authorized permissions."""
    uid = current_user["uid"]
    provider_str = payload.get("provider", "android_health_connect")
    device_name = payload.get("device_name", "Connected Sensor Device")
    permissions = payload.get("permissions", ["heart_rate", "spo2", "sleep"])

    try:
        provider = WearableProviderType(provider_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported wearable provider type: {provider_str}",
        )

    connection = await wearable_service.connect_provider(uid, provider, device_name, permissions)
    return {"connection": connection, "message": f"Successfully connected to {device_name}."}


@router.delete("/connections/{connection_id}", summary="Disconnect Wearable Device")
async def disconnect_wearable_provider(
    connection_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Disconnect a wearable device and revoke access tokens."""
    uid = current_user["uid"]
    success = await wearable_service.disconnect_provider(uid, connection_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wearable connection not found or unauthorized.",
        )
    return {"message": "Wearable device disconnected and access revoked successfully.", "connection_id": connection_id}


@router.post("/measurements/batch", status_code=status.HTTP_201_CREATED, summary="Batch Import Wearable Measurements")
async def batch_import_wearable_measurements(
    payload: WearableBatchSyncRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Import a validated batch of wearable measurements idempotently with duplicate prevention."""
    uid = current_user["uid"]
    
    if len(payload.measurements) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Measurement batch cannot be empty.",
        )

    result = await wearable_service.process_batch_sync(
        uid=uid,
        connection_id=payload.connection_id,
        provider=payload.provider,
        measurements=payload.measurements,
    )

    return {
        "sync_result": result,
        "message": f"Successfully synchronized {result['records_imported']} measurements ({result['records_skipped_duplicate']} duplicates skipped).",
    }


@router.get("/sync-history", summary="Retrieve Wearable Synchronization History")
async def get_wearable_sync_history(
    limit: int = Query(default=20, ge=1, le=100),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve audit history of wearable data synchronizations."""
    uid = current_user["uid"]
    history = await wearable_service.get_sync_history(uid, limit=limit)
    return {"sync_history": history, "count": len(history)}
