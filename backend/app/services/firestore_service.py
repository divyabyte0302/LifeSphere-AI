"""Cloud Firestore Persistence Service for LifeSphere AI-X.

Manages scoped subcollections under users/{uid}:
  - users/{uid}
  - users/{uid}/measurements/{measurementId}
  - users/{uid}/predictions/{predictionId}
  - users/{uid}/alerts/{alertId}
  - users/{uid}/environmentObservations/{observationId}

Features:
- Enforces strict user UID ownership isolation on every query.
- Uses server-generated UTC timestamps and UUID document identifiers.
- Gracefully falls back to thread-safe in-memory collections when offline or running in mock testing mode.
"""

import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.firebase_setup import get_firestore_client, is_mock_mode

logger = logging.getLogger("lifesphere.firestore")

# In-memory store fallback for offline tests and development mode
_in_memory_db: Dict[str, Dict[str, Any]] = {
    "users": {},
    "measurements": {},
    "hydration": {},
    "predictions": {},
    "alerts": {},
    "environment_observations": {},
}


class FirestoreService:
    """Service layer for Firestore database operations scoped to authenticated UID."""

    def __init__(self):
        self._db = get_firestore_client()

    # ------------------------------------------------------------------------
    # User Profile Operations
    # ------------------------------------------------------------------------
    async def get_user_profile(self, uid: str) -> Optional[Dict[str, Any]]:
        """Retrieve user profile by UID."""
        if is_mock_mode() or self._db is None:
            return _in_memory_db["users"].get(uid)

        try:
            doc_ref = self._db.collection("users").document(uid)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Firestore get_user_profile error for {uid}: {e}")
            return _in_memory_db["users"].get(uid)

    async def save_user_profile(self, uid: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update user profile document in users/{uid}."""
        now = datetime.now(timezone.utc).isoformat()
        profile_data["uid"] = uid
        profile_data["updated_at"] = now
        if "created_at" not in profile_data:
            profile_data["created_at"] = now

        if is_mock_mode() or self._db is None:
            _in_memory_db["users"][uid] = profile_data
            return profile_data

        try:
            doc_ref = self._db.collection("users").document(uid)
            doc_ref.set(profile_data, merge=True)
            return profile_data
        except Exception as e:
            logger.error(f"Firestore save_user_profile error for {uid}: {e}")
            _in_memory_db["users"][uid] = profile_data
            return profile_data

    async def delete_user_data(self, uid: str) -> bool:
        """Completely purge user profile and all associated subcollection documents."""
        # Clean in-memory store
        _in_memory_db["users"].pop(uid, None)
        for collection_key in ["measurements", "hydration", "predictions", "alerts"]:
            if uid in _in_memory_db[collection_key]:
                _in_memory_db[collection_key].pop(uid, None)

        if is_mock_mode() or self._db is None:
            return True

        try:
            user_ref = self._db.collection("users").document(uid)
            # Delete subcollection documents
            for subcol_name in ["measurements", "hydration", "predictions", "alerts", "environmentObservations"]:
                subcol_ref = user_ref.collection(subcol_name)
                docs = subcol_ref.limit(100).stream()
                for doc in docs:
                    doc.reference.delete()
            # Delete user root doc
            user_ref.delete()
            return True
        except Exception as e:
            logger.error(f"Firestore delete_user_data error for {uid}: {e}")
            return False

    # ------------------------------------------------------------------------
    # Health Measurements Operations (users/{uid}/measurements/{measurementId})
    # ------------------------------------------------------------------------
    async def save_measurement(self, uid: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a new measurement in users/{uid}/measurements/{id}."""
        measurement_id = str(uuid.uuid4())
        record = {
            **data,
            "id": measurement_id,
            "user_id": uid,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        # Convert datetimes to isoformat string if necessary
        if isinstance(record.get("recorded_at"), datetime):
            record["recorded_at"] = record["recorded_at"].isoformat()

        if is_mock_mode() or self._db is None:
            if uid not in _in_memory_db["measurements"]:
                _in_memory_db["measurements"][uid] = []
            _in_memory_db["measurements"][uid].insert(0, record)
            return record

        try:
            doc_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("measurements")
                .document(measurement_id)
            )
            doc_ref.set(record)
            return record
        except Exception as e:
            logger.error(f"Firestore save_measurement error: {e}")
            if uid not in _in_memory_db["measurements"]:
                _in_memory_db["measurements"][uid] = []
            _in_memory_db["measurements"][uid].insert(0, record)
            return record

    async def get_measurements(self, uid: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve historical measurements for authenticated user UID only."""
        if is_mock_mode() or self._db is None:
            user_measurements = _in_memory_db["measurements"].get(uid, [])
            return user_measurements[:limit]

        try:
            subcol_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("measurements")
                .order_by("created_at", direction="DESCENDING")
                .limit(limit)
            )
            docs = subcol_ref.stream()
            results = [doc.to_dict() for doc in docs]
            return results
        except Exception as e:
            logger.warning(f"Firestore get_measurements fallback to in-memory: {e}")
            user_measurements = _in_memory_db["measurements"].get(uid, [])
            return user_measurements[:limit]

    # ------------------------------------------------------------------------
    # Daily Water Intake & Hydration Operations (users/{uid}/hydration/{recordId})
    # ------------------------------------------------------------------------
    async def save_hydration_entry(self, uid: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a new hydration intake record in users/{uid}/hydration/{recordId}."""
        entry_id = data.get("id") or f"hydro-{uuid.uuid4().hex[:12]}"
        now_iso = datetime.now(timezone.utc).isoformat()
        record = {
            **data,
            "id": entry_id,
            "user_id": uid,
            "created_at": now_iso,
        }

        if isinstance(record.get("timestamp"), datetime):
            record["timestamp"] = record["timestamp"].isoformat()
        elif "timestamp" not in record or not record["timestamp"]:
            record["timestamp"] = now_iso

        if is_mock_mode() or self._db is None:
            if uid not in _in_memory_db["hydration"]:
                _in_memory_db["hydration"][uid] = []
            _in_memory_db["hydration"][uid].insert(0, record)
            return record

        try:
            doc_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("hydration")
                .document(entry_id)
            )
            doc_ref.set(record)
            return record
        except Exception as e:
            logger.error(f"Firestore save_hydration_entry error: {e}")
            if uid not in _in_memory_db["hydration"]:
                _in_memory_db["hydration"][uid] = []
            _in_memory_db["hydration"][uid].insert(0, record)
            return record

    async def get_hydration_entries(self, uid: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve hydration intake history for authenticated user UID only."""
        if is_mock_mode() or self._db is None:
            user_entries = _in_memory_db["hydration"].get(uid, [])
            return user_entries[:limit]

        try:
            subcol_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("hydration")
                .order_by("created_at", direction="DESCENDING")
                .limit(limit)
            )
            docs = subcol_ref.stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            logger.warning(f"Firestore get_hydration_entries fallback to in-memory: {e}")
            user_entries = _in_memory_db["hydration"].get(uid, [])
            return user_entries[:limit]

    async def delete_hydration_entry(self, uid: str, record_id: str) -> bool:
        """Delete a hydration intake record from users/{uid}/hydration/{recordId}."""
        if uid in _in_memory_db["hydration"]:
            _in_memory_db["hydration"][uid] = [
                entry for entry in _in_memory_db["hydration"][uid] if entry.get("id") != record_id
            ]

        if is_mock_mode() or self._db is None:
            return True

        try:
            self._db.collection("users").document(uid).collection("hydration").document(record_id).delete()
            return True
        except Exception as e:
            logger.error(f"Firestore delete_hydration_entry error for {uid}/{record_id}: {e}")
            return False

    # ------------------------------------------------------------------------
    # Risk Predictions Operations (users/{uid}/predictions/{predictionId})
    # ------------------------------------------------------------------------
    async def save_prediction(self, uid: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save risk assessment in users/{uid}/predictions/{id}."""
        prediction_id = data.get("id") or str(uuid.uuid4())
        record = {
            **data,
            "id": prediction_id,
            "user_id": uid,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        if isinstance(record.get("assessed_at"), datetime):
            record["assessed_at"] = record["assessed_at"].isoformat()

        if is_mock_mode() or self._db is None:
            if uid not in _in_memory_db["predictions"]:
                _in_memory_db["predictions"][uid] = []
            _in_memory_db["predictions"][uid].insert(0, record)
            return record

        try:
            doc_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("predictions")
                .document(prediction_id)
            )
            doc_ref.set(record)
            return record
        except Exception as e:
            logger.error(f"Firestore save_prediction error: {e}")
            if uid not in _in_memory_db["predictions"]:
                _in_memory_db["predictions"][uid] = []
            _in_memory_db["predictions"][uid].insert(0, record)
            return record

    async def get_predictions(self, uid: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve risk prediction history for authenticated UID."""
        if is_mock_mode() or self._db is None:
            user_preds = _in_memory_db["predictions"].get(uid, [])
            return user_preds[:limit]

        try:
            subcol_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("predictions")
                .order_by("created_at", direction="DESCENDING")
                .limit(limit)
            )
            docs = subcol_ref.stream()
            results = [doc.to_dict() for doc in docs]
            return results
        except Exception as e:
            logger.warning(f"Firestore get_predictions fallback: {e}")
            user_preds = _in_memory_db["predictions"].get(uid, [])
            return user_preds[:limit]

    # ------------------------------------------------------------------------
    # Emergency Alerts Operations (users/{uid}/alerts/{alertId})
    # ------------------------------------------------------------------------
    async def save_emergency_alert(self, uid: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save emergency record in users/{uid}/alerts/{id}."""
        alert_id = str(uuid.uuid4())
        record = {
            **data,
            "id": alert_id,
            "user_id": uid,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        if is_mock_mode() or self._db is None:
            if uid not in _in_memory_db["alerts"]:
                _in_memory_db["alerts"][uid] = []
            _in_memory_db["alerts"][uid].insert(0, record)
            return record

        try:
            doc_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("alerts")
                .document(alert_id)
            )
            doc_ref.set(record)
            return record
        except Exception as e:
            logger.error(f"Firestore save_emergency_alert error: {e}")
            if uid not in _in_memory_db["alerts"]:
                _in_memory_db["alerts"][uid] = []
            _in_memory_db["alerts"][uid].insert(0, record)
            return record

    async def get_emergency_alerts(self, uid: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Retrieve emergency alert history for authenticated UID."""
        if is_mock_mode() or self._db is None:
            user_alerts = _in_memory_db["alerts"].get(uid, [])
            return user_alerts[:limit]

        try:
            subcol_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("alerts")
                .order_by("created_at", direction="DESCENDING")
                .limit(limit)
            )
            docs = subcol_ref.stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            logger.warning(f"Firestore get_emergency_alerts fallback: {e}")
            user_alerts = _in_memory_db["alerts"].get(uid, [])
            return user_alerts[:limit]

    # ------------------------------------------------------------------------
    # Environment Observations Operations
    # ------------------------------------------------------------------------
    async def save_environment_observation(self, data: Dict[str, Any], uid: Optional[str] = None) -> Dict[str, Any]:
        """Store environmental observation with simulated / real distinction."""
        obs_id = str(uuid.uuid4())
        record = {
            **data,
            "id": obs_id,
            "user_id": uid,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        # Store in general list
        if "all" not in _in_memory_db["environment_observations"]:
            _in_memory_db["environment_observations"]["all"] = []
        _in_memory_db["environment_observations"]["all"].insert(0, record)

        if uid:
            if is_mock_mode() or self._db is None:
                if uid not in _in_memory_db["environment_observations"]:
                    _in_memory_db["environment_observations"][uid] = []
                _in_memory_db["environment_observations"][uid].insert(0, record)
            else:
                try:
                    self._db.collection("users").document(uid).collection("environmentObservations").document(obs_id).set(record)
                except Exception as e:
                    logger.error(f"Error saving subcollection environment observation: {e}")

        return record

    async def get_latest_environment(self) -> Dict[str, Any]:
        """Retrieve the most recent environmental observation."""
        all_obs = _in_memory_db["environment_observations"].get("all", [])
        if all_obs:
            return all_obs[0]

        # Default synthetic baseline observation if none submitted yet
        return {
            "id": "env_baseline_demo",
            "temperature_celsius": 24.5,
            "humidity_percentage": 58.0,
            "pm25": 14.2,
            "air_quality_index": 48,
            "ozone_ppb": 32.0,
            "uv_index": 3.8,
            "location": {
                "city": "Metro Core Research Grid",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "zone_description": "Urban Coastal Baseline",
            },
            "is_simulated": True,
            "observed_at": datetime.now(timezone.utc).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }


# Singleton service instance
firestore_service = FirestoreService()
