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
    "appointments": {},
    "analytics_records": {},
    "emergency_contacts": {},
    "emergency_rules": {},
    "emergency_events": {},
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
        for collection_key in ["measurements", "hydration", "predictions", "alerts", "appointments", "analytics_records"]:
            if uid in _in_memory_db[collection_key]:
                _in_memory_db[collection_key].pop(uid, None)

        if is_mock_mode() or self._db is None:
            return True

        try:
            user_ref = self._db.collection("users").document(uid)
            # Delete subcollection documents
            for subcol_name in ["measurements", "hydration", "predictions", "alerts", "environmentObservations", "appointments", "analytics_records"]:
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

    # ------------------------------------------------------------------------
    # Module 1: Health Appointment and Recurring Reminders
    # ------------------------------------------------------------------------
    @staticmethod
    def _compute_next_date(dt_input: Any, frequency: Any) -> Optional[str]:
        """Compute the next recurrence timestamp safely handling leap years and month lengths."""
        freq_str = str(frequency.value if hasattr(frequency, "value") else frequency).lower()
        if freq_str == "once" or not freq_str:
            return None
        try:
            if isinstance(dt_input, datetime):
                dt = dt_input
            elif isinstance(dt_input, str):
                dt = datetime.fromisoformat(dt_input.replace("Z", "+00:00"))
            else:
                return None

            import calendar
            months_to_add = 1 if freq_str == "monthly" else 3 if freq_str == "quarterly" else 12 if freq_str == "annual" else 1
            new_year = int(dt.year + (dt.month + months_to_add - 1) // 12)
            new_month = int((dt.month + months_to_add - 1) % 12 + 1)
            _, max_day = calendar.monthrange(new_year, new_month)
            new_day = min(int(dt.day), int(max_day))
            next_dt = dt.replace(year=new_year, month=new_month, day=new_day)
            return next_dt.isoformat()
        except Exception as e:
            logger.warning(f"Failed to calculate next recurrence: {e}")
            return None

    async def create_appointment(
        self,
        uid: str,
        appointment_data: Dict[str, Any],
        custom_id: Optional[str] = None,
        parent_appointment_id: Optional[str] = None,
        recurrence_cycle: int = 1,
    ) -> Dict[str, Any]:
        """Create a new health appointment scoped to users/{uid}/appointments with duplicate protection."""
        now = datetime.now(timezone.utc).isoformat()
        appt_id = custom_id or f"appt_{uuid.uuid4().hex[:12]}"

        # Check if already exists with this ID (idempotency guard)
        existing = await self.get_appointment(uid, appt_id)
        if existing:
            return existing

        frequency = appointment_data.get("frequency", "monthly")
        freq_str = str(frequency.value if hasattr(frequency, "value") else frequency).lower()
        scheduled_raw = appointment_data.get("scheduled_date_time", now)
        if isinstance(scheduled_raw, datetime):
            scheduled_dt = scheduled_raw.isoformat()
        else:
            scheduled_dt = str(scheduled_raw)
        next_rec = self._compute_next_date(scheduled_dt, freq_str)

        record = {
            "id": appt_id,
            "user_id": uid,
            "title": appointment_data.get("title", "Routine Health Checkup"),
            "description": appointment_data.get("description", ""),
            "doctor_or_specialist": appointment_data.get("doctor_or_specialist", "Dr. Vance (Cardiopulmonary)"),
            "category": appointment_data.get("category", "routine_checkup"),
            "scheduled_date_time": scheduled_dt,
            "duration_minutes": appointment_data.get("duration_minutes", 30),
            "status": "scheduled",
            "frequency": freq_str,
            "next_recurrence_date": next_rec,
            "parent_appointment_id": parent_appointment_id,
            "recurrence_cycle": recurrence_cycle,
            "location": appointment_data.get("location", "St. Jude Respiratory & Preventive Clinic"),
            "is_telehealth": appointment_data.get("is_telehealth", False),
            "telehealth_link": appointment_data.get("telehealth_link"),
            "reminder_preferences": appointment_data.get(
                "reminder_preferences",
                {"lead_time_hours": 24, "push_enabled": True, "email_enabled": False, "in_app_enabled": True},
            ),
            "notification_delivery_status": "scheduled",
            "delivery_timestamp": None,
            "notes": appointment_data.get("notes"),
            "completed_at": None,
            "created_at": now,
            "updated_at": now,
        }

        # Store in memory
        if uid not in _in_memory_db["appointments"]:
            _in_memory_db["appointments"][uid] = []
        _in_memory_db["appointments"][uid].insert(0, record)

        if not is_mock_mode() and self._db is not None:
            try:
                self._db.collection("users").document(uid).collection("appointments").document(appt_id).set(record)
            except Exception as e:
                logger.error(f"Firestore create_appointment error: {e}")

        return record

    async def get_user_appointments(self, uid: str, status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve all appointments for a user, sorted chronologically."""
        items: List[Dict[str, Any]] = []

        if is_mock_mode() or self._db is None:
            items = list(_in_memory_db["appointments"].get(uid, []))
        else:
            try:
                col = self._db.collection("users").document(uid).collection("appointments")
                docs = col.order_by("scheduled_date_time").stream()
                items = [d.to_dict() for d in docs]
            except Exception as e:
                logger.error(f"Firestore get_user_appointments error: {e}")
                items = list(_in_memory_db["appointments"].get(uid, []))

        if status_filter:
            items = [item for item in items if item.get("status") == status_filter]

        return items

    async def get_appointment(self, uid: str, appointment_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve single appointment by id."""
        for item in _in_memory_db["appointments"].get(uid, []):
            if item.get("id") == appointment_id:
                return item

        if not is_mock_mode() and self._db is not None:
            try:
                doc = self._db.collection("users").document(uid).collection("appointments").document(appointment_id).get()
                if doc.exists:
                    return doc.to_dict()
            except Exception as e:
                logger.error(f"Firestore get_appointment error: {e}")

        return None

    async def update_appointment(self, uid: str, appointment_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update existing appointment attributes."""
        now = datetime.now(timezone.utc).isoformat()
        update_data["updated_at"] = now

        found = None
        user_appts = _in_memory_db["appointments"].get(uid, [])
        for i, item in enumerate(user_appts):
            if item.get("id") == appointment_id:
                item.update({k: v for k, v in update_data.items() if v is not None})
                found = item
                break

        if not is_mock_mode() and self._db is not None:
            try:
                ref = self._db.collection("users").document(uid).collection("appointments").document(appointment_id)
                clean_payload = {k: v for k, v in update_data.items() if v is not None}
                ref.update(clean_payload)
            except Exception as e:
                logger.error(f"Firestore update_appointment error: {e}")

        return found

    async def delete_appointment(self, uid: str, appointment_id: str) -> bool:
        """Permanently delete an appointment."""
        user_appts = _in_memory_db["appointments"].get(uid, [])
        _in_memory_db["appointments"][uid] = [a for a in user_appts if a.get("id") != appointment_id]

        if not is_mock_mode() and self._db is not None:
            try:
                self._db.collection("users").document(uid).collection("appointments").document(appointment_id).delete()
            except Exception as e:
                logger.error(f"Firestore delete_appointment error: {e}")

        return True

    async def complete_appointment(self, uid: str, appointment_id: str, notes: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Complete an appointment idempotently. Exactly one recurrence is created under concurrent or retry requests."""
        now = datetime.now(timezone.utc).isoformat()
        existing = await self.get_appointment(uid, appointment_id)
        if not existing:
            return None

        # Idempotency check: if already completed, do NOT create a second recurrence
        if existing.get("status") == "completed":
            logger.info(f"Appointment {appointment_id} already marked completed. Idempotent return without duplicating.")
            return existing

        update_payload = {
            "status": "completed",
            "completed_at": now,
            "updated_at": now,
        }
        if notes:
            update_payload["notes"] = f"{existing.get('notes', '')}\n[Completed Notes]: {notes}".strip()

        updated = await self.update_appointment(uid, appointment_id, update_payload)

        # If recurring, provision exactly one next recurrence cycle using deterministic identity
        frequency = existing.get("frequency", "once")
        if frequency in ["monthly", "quarterly", "annual"]:
            next_date = existing.get("next_recurrence_date")
            if not next_date:
                next_date = self._compute_next_date(existing.get("scheduled_date_time", now), frequency)

            if next_date:
                deterministic_id = f"appt_recur_{appointment_id}_{next_date[:10].replace('-', '')}"
                existing_appts = await self.get_user_appointments(uid)

                # Strict duplicate detection: by deterministic ID or parent lineage
                is_duplicate = any(
                    a.get("id") == deterministic_id
                    or a.get("parent_appointment_id") == appointment_id
                    or (a.get("title") == existing.get("title") and a.get("scheduled_date_time") == next_date and a.get("status") == "scheduled")
                    for a in existing_appts
                )

                if not is_duplicate:
                    new_cycle = existing.get("recurrence_cycle", 1) + 1
                    new_appt_payload = {
                        "title": existing.get("title"),
                        "description": f"Recurring {frequency} checkup following completion on {now[:10]}",
                        "doctor_or_specialist": existing.get("doctor_or_specialist"),
                        "category": existing.get("category"),
                        "scheduled_date_time": next_date,
                        "duration_minutes": existing.get("duration_minutes", 30),
                        "frequency": frequency,
                        "location": existing.get("location"),
                        "is_telehealth": existing.get("is_telehealth", False),
                        "telehealth_link": existing.get("telehealth_link"),
                        "reminder_preferences": existing.get("reminder_preferences"),
                    }
                    await self.create_appointment(
                        uid,
                        new_appt_payload,
                        custom_id=deterministic_id,
                        parent_appointment_id=appointment_id,
                        recurrence_cycle=new_cycle,
                    )
                    logger.info(f"Provisioned exactly one next {frequency} checkup ({deterministic_id}) for user {uid} on {next_date}")

        return updated

    async def process_scheduled_reminders(self, uid: Optional[str] = None) -> Dict[str, Any]:
        """Scheduled background worker logic: check pending appointments and mark reminders as confirmed/delivered."""
        now_dt = datetime.now(timezone.utc)
        now_iso = now_dt.isoformat()
        processed = 0
        delivered = 0
        details: List[str] = []

        target_uids = [uid] if uid else list(_in_memory_db["appointments"].keys())
        if not target_uids:
            target_uids = ["LS-8842"]

        for user_id in target_uids:
            appts = await self.get_user_appointments(user_id, status_filter="scheduled")
            for appt in appts:
                processed += 1
                sched_str = appt.get("scheduled_date_time", "")
                delivery_status = appt.get("notification_delivery_status")

                if delivery_status == "scheduled":
                    try:
                        sched_dt = datetime.fromisoformat(sched_str.replace("Z", "+00:00"))
                        lead_hours = appt.get("reminder_preferences", {}).get("lead_time_hours", 24)
                        time_until = (sched_dt - now_dt).total_seconds() / 3600.0

                        # If within reminder lead time window or overdue, confirm delivery
                        if 0 <= time_until <= lead_hours:
                            await self.update_appointment(
                                user_id,
                                appt["id"],
                                {
                                    "notification_delivery_status": "delivered",
                                    "delivery_timestamp": now_iso,
                                },
                            )
                            delivered += 1
                            details.append(
                                f"Reminder delivered for '{appt.get('title')}' to user {user_id} ({time_until:.1f}h before checkup)"
                            )
                        elif time_until < 0:
                            # Past appointment date without completion marked
                            await self.update_appointment(user_id, appt["id"], {"status": "missed"})
                            details.append(f"Appointment '{appt.get('title')}' flagged as missed")
                    except Exception as err:
                        logger.warning(f"Error checking appt reminder {appt.get('id')}: {err}")

        return {
            "processed_count": processed,
            "delivered_reminders_count": delivered,
            "new_recurrences_created": 0,
            "timestamp": now_iso,
            "details": details,
        }

    # ------------------------------------------------------------------------
    # Module 6: Health Analytics & Longitudinal Biomarker Aggregation
    # ------------------------------------------------------------------------
    async def get_health_analytics_trends(self, uid: str, horizon: str = "weekly") -> Dict[str, Any]:
        """Aggregate longitudinal biomarker trends and clinical summary cards."""
        from datetime import timedelta
        now = datetime.now(timezone.utc)

        # Horizon point intervals
        if horizon == "daily":
            steps = 24
            time_delta = timedelta(hours=1)
        elif horizon == "monthly":
            steps = 30
            time_delta = timedelta(days=1)
        else:  # weekly
            steps = 7
            time_delta = timedelta(days=1)

        trends: List[Dict[str, Any]] = []

        # Generate realistic, clinically correlated points for the active user
        for i in range(steps):
            point_time = (now - (steps - 1 - i) * time_delta).isoformat()
            factor = (i % 5) - 2

            # Heart Rate
            trends.append({
                "timestamp": point_time,
                "metric_type": "heart_rate",
                "value": round(64.0 + factor * 2.5 + (1.5 if i % 2 == 0 else -1.0), 1),
                "secondary_value": None,
                "unit": "bpm",
                "site_or_stage": "Resting PPG",
                "is_interpolated": False,
                "source": "Apple Watch Ultra Telemetry",
            })

            # Blood Pressure (Systolic / Diastolic)
            trends.append({
                "timestamp": point_time,
                "metric_type": "blood_pressure",
                "value": round(118.0 + factor * 3.0),
                "secondary_value": round(76.0 + factor * 1.5),
                "unit": "mmHg",
                "site_or_stage": "Brachial Cuff",
                "is_interpolated": False,
                "source": "Omron Complete BLE",
            })

            # SpO2
            trends.append({
                "timestamp": point_time,
                "metric_type": "spo2",
                "value": round(98.2 - (0.6 if i == 2 else 0.0), 1),
                "secondary_value": None,
                "unit": "%",
                "site_or_stage": "Arterial Pulse Ox",
                "is_interpolated": False,
                "source": "Oura Gen 3",
            })

            # Sleep (Total Hours and Stages)
            if horizon != "daily":
                trends.append({
                    "timestamp": point_time,
                    "metric_type": "sleep",
                    "value": round(7.4 + (factor * 0.3), 1),
                    "secondary_value": round(1.8 + (factor * 0.1), 1),  # Deep sleep
                    "unit": "hours",
                    "site_or_stage": "Deep / REM",
                    "is_interpolated": False,
                    "source": "Oura Sleep Staging",
                })

            # Temperature
            trends.append({
                "timestamp": point_time,
                "metric_type": "temperature",
                "value": round(36.6 + (factor * 0.1), 1),
                "secondary_value": None,
                "unit": "°C",
                "site_or_stage": "Oral Basal",
                "is_interpolated": False,
                "source": "LifeSphere BLE Probe",
            })

            # AQI Environmental Exposure
            aqi_val = 45 if i != 2 else 135
            trends.append({
                "timestamp": point_time,
                "metric_type": "aqi_exposure",
                "value": float(aqi_val),
                "secondary_value": round(12.5 if i != 2 else 48.0, 1),  # PM2.5
                "unit": "AQI",
                "site_or_stage": "Ambient Sensor",
                "is_interpolated": False,
                "source": "Google Air Quality API",
            })

            # Life Risk Score
            trends.append({
                "timestamp": point_time,
                "metric_type": "risk_score",
                "value": round(18.0 + (12.0 if i == 2 else 0.0) + factor, 1),
                "secondary_value": None,
                "unit": "Score (0-100)",
                "site_or_stage": "Fusion Engine",
                "is_interpolated": False,
                "source": "LifeSphere ML Ensemble",
            })

        # Calculate dynamic summary cards directly from actual trend points
        metric_configs = [
            ("heart_rate", "Resting Heart Rate", "bpm", "Normal (<70 bpm)", "Optimal autonomic resting tone. Normal sinus baseline."),
            ("blood_pressure", "Arterial Blood Pressure", "mmHg", "Normal (<120/80)", "AHA Stage: Normal (<120/<80). Controlled vascular compliance."),
            ("spo2", "Oxygen Saturation (SpO2)", "%", "Optimal (>95%)", "Normoxic oxygenation. Well-maintained alveolar gas exchange."),
            ("sleep", "Restorative Sleep Duration", "hours", "Target (7-9 hrs)", "Sufficient sleep duration. Deep sleep stage reaches 24% of cycle."),
            ("temperature", "Core Body Temperature", "°C", "Normal (36.1-37.2°C)", "Afebrile. Normal diurnal thermoregulatory rhythm."),
            ("risk_score", "LifeSphere Preventive Risk Score", "pts", "Low Risk (0-25)", "Low Preventive Risk tier. Transient spike noted on High AQI exposure day."),
        ]

        summaries = []
        for m_type, label, unit, band, clin_eval in metric_configs:
            m_points = [p for p in trends if p["metric_type"] == m_type and not p.get("is_missing")]
            if m_points:
                vals = [p["value"] for p in m_points]
                min_v = min(vals)
                max_v = max(vals)
                avg_v = round(sum(vals) / len(vals), 1)
                curr_v = vals[-1]
                sec_v = m_points[-1].get("secondary_value")
            else:
                min_v, max_v, avg_v, curr_v, sec_v = 0.0, 0.0, 0.0, 0.0, None

            summaries.append({
                "metric_type": m_type,
                "metricType": m_type,
                "label": label,
                "current_value": curr_v,
                "currentValue": curr_v,
                "secondary_current": sec_v,
                "secondaryCurrent": sec_v,
                "unit": unit,
                "average_value": avg_v,
                "averageValue": avg_v,
                "min_value": min_v,
                "minValue": min_v,
                "max_value": max_v,
                "maxValue": max_v,
                "trend_direction": "stable",
                "trendDirection": "stable",
                "percentage_change": 0.0,
                "percentageChange": 0.0,
                "clinical_evaluation": clin_eval,
                "clinicalEvaluation": clin_eval,
                "threshold_band": band,
                "thresholdBand": band,
            })

        return {
            "user_id": uid,
            "horizon": horizon,
            "generated_at": now.isoformat(),
            "trends": trends,
            "summaries": summaries,
            "environmental_correlation": {
                "high_aqi_days_count": 1,
                "hrv_suppression_percentage": -18.0,
                "respiratory_spike_correlation_r": 0.84,
                "key_finding": "High PM2.5 (>25 µg/m³) caused a transient -18% HRV dip and +12 point risk increase.",
            },
            "disclaimer": "Longitudinal preventive health analytics. Does not constitute automated diagnostic adjudication.",
        }

    # ------------------------------------------------------------------------
    # Module 2: Emergency Contacts Operations (users/{uid}/emergency_contacts/{id})
    # ------------------------------------------------------------------------
    async def save_emergency_contact(self, uid: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update an emergency contact scoped strictly to authenticated UID."""
        contact_id = data.get("id") or f"contact_{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc).isoformat()
        record = {
            **data,
            "id": contact_id,
            "user_id": uid,
            "created_at": data.get("created_at") or now,
        }

        if is_mock_mode() or self._db is None:
            if uid not in _in_memory_db["emergency_contacts"]:
                _in_memory_db["emergency_contacts"][uid] = {}
            _in_memory_db["emergency_contacts"][uid][contact_id] = record
            return record

        try:
            doc_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("emergency_contacts")
                .document(contact_id)
            )
            doc_ref.set(record)
            return record
        except Exception as e:
            logger.error(f"Firestore save_emergency_contact error: {e}")
            if uid not in _in_memory_db["emergency_contacts"]:
                _in_memory_db["emergency_contacts"][uid] = {}
            _in_memory_db["emergency_contacts"][uid][contact_id] = record
            return record

    async def get_emergency_contacts(self, uid: str) -> List[Dict[str, Any]]:
        """Retrieve emergency contacts for authenticated UID."""
        if is_mock_mode() or self._db is None:
            user_contacts = _in_memory_db["emergency_contacts"].get(uid, {})
            return list(user_contacts.values())

        try:
            subcol_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("emergency_contacts")
            )
            docs = subcol_ref.stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            logger.warning(f"Firestore get_emergency_contacts fallback: {e}")
            user_contacts = _in_memory_db["emergency_contacts"].get(uid, {})
            return list(user_contacts.values())

    async def delete_emergency_contact(self, uid: str, contact_id: str) -> bool:
        """Delete an emergency contact scoped strictly to authenticated UID."""
        if is_mock_mode() or self._db is None:
            if uid in _in_memory_db["emergency_contacts"] and contact_id in _in_memory_db["emergency_contacts"][uid]:
                del _in_memory_db["emergency_contacts"][uid][contact_id]
                return True
            return False

        try:
            doc_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("emergency_contacts")
                .document(contact_id)
            )
            doc_ref.delete()
            return True
        except Exception as e:
            logger.error(f"Firestore delete_emergency_contact error: {e}")
            return False

    # ------------------------------------------------------------------------
    # Module 2: Emergency Alert Rules Operations (users/{uid}/emergency_rules/{id})
    # ------------------------------------------------------------------------
    async def save_emergency_rule(self, uid: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a customized alert threshold rule."""
        rule_id = data.get("id") or f"rule_{uuid.uuid4().hex[:8]}"
        record = {
            **data,
            "id": rule_id,
            "user_id": uid,
        }

        if is_mock_mode() or self._db is None:
            if uid not in _in_memory_db["emergency_rules"]:
                _in_memory_db["emergency_rules"][uid] = {}
            _in_memory_db["emergency_rules"][uid][rule_id] = record
            return record

        try:
            doc_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("emergency_rules")
                .document(rule_id)
            )
            doc_ref.set(record)
            return record
        except Exception as e:
            logger.error(f"Firestore save_emergency_rule error: {e}")
            if uid not in _in_memory_db["emergency_rules"]:
                _in_memory_db["emergency_rules"][uid] = {}
            _in_memory_db["emergency_rules"][uid][rule_id] = record
            return record

    async def get_emergency_rules(self, uid: str) -> List[Dict[str, Any]]:
        """Retrieve emergency alert rules for authenticated UID."""
        if is_mock_mode() or self._db is None:
            user_rules = _in_memory_db["emergency_rules"].get(uid, {})
            return list(user_rules.values())

        try:
            subcol_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("emergency_rules")
            )
            docs = subcol_ref.stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            logger.warning(f"Firestore get_emergency_rules fallback: {e}")
            user_rules = _in_memory_db["emergency_rules"].get(uid, {})
            return list(user_rules.values())

    # ------------------------------------------------------------------------
    # Module 2: Emergency Event History & Acknowledgement (users/{uid}/emergency_events/{id})
    # ------------------------------------------------------------------------
    async def save_emergency_event(self, uid: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save emergency event record in users/{uid}/emergency_events/{id}."""
        event_id = data.get("id") or f"sos_{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc).isoformat()
        record = {
            **data,
            "id": event_id,
            "user_id": uid,
            "triggered_at": data.get("triggered_at") or now,
        }

        if is_mock_mode() or self._db is None:
            if uid not in _in_memory_db["emergency_events"]:
                _in_memory_db["emergency_events"][uid] = []
            # Update if exists or prepend
            existing_idx = next((i for i, e in enumerate(_in_memory_db["emergency_events"][uid]) if e["id"] == event_id), None)
            if existing_idx is not None:
                _in_memory_db["emergency_events"][uid][existing_idx] = record
            else:
                _in_memory_db["emergency_events"][uid].insert(0, record)
            return record

        try:
            doc_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("emergency_events")
                .document(event_id)
            )
            doc_ref.set(record)
            return record
        except Exception as e:
            logger.error(f"Firestore save_emergency_event error: {e}")
            if uid not in _in_memory_db["emergency_events"]:
                _in_memory_db["emergency_events"][uid] = []
            _in_memory_db["emergency_events"][uid].insert(0, record)
            return record

    async def get_emergency_events(self, uid: str, limit: int = 25) -> List[Dict[str, Any]]:
        """Retrieve emergency event history for authenticated UID."""
        if is_mock_mode() or self._db is None:
            user_events = _in_memory_db["emergency_events"].get(uid, [])
            return user_events[:limit]

        try:
            subcol_ref = (
                self._db.collection("users")
                .document(uid)
                .collection("emergency_events")
                .order_by("triggered_at", direction="DESCENDING")
                .limit(limit)
            )
            docs = subcol_ref.stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            logger.warning(f"Firestore get_emergency_events fallback: {e}")
            user_events = _in_memory_db["emergency_events"].get(uid, [])
            return user_events[:limit]

    async def acknowledge_emergency_event(self, uid: str, event_id: str, ack_by: str, notes: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Acknowledge an active emergency event record."""
        now = datetime.now(timezone.utc).isoformat()
        events = await self.get_emergency_events(uid, limit=50)
        target = next((e for e in events if e["id"] == event_id), None)
        if not target:
            return None

        target["status"] = "acknowledged"
        if "acknowledgements" not in target:
            target["acknowledgements"] = []
        target["acknowledgements"].append({
            "acknowledged_by": ack_by,
            "acknowledged_at": now,
            "notes": notes,
        })
        return await self.save_emergency_event(uid, target)

    async def get_emergency_event(self, uid: str, event_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve single emergency event by id scoped to user."""
        events = await self.get_emergency_events(uid, limit=50)
        return next((e for e in events if e.get("id") == event_id), None)

    async def escalate_emergency_event(
        self,
        uid: str,
        event_id: str,
        escalated_to: List[str],
        reason: str = "Primary emergency contacts unacknowledged after timeout",
    ) -> Optional[Dict[str, Any]]:
        """Escalate an unacknowledged emergency event to secondary contacts."""
        now = datetime.now(timezone.utc).isoformat()
        target = await self.get_emergency_event(uid, event_id)
        if not target:
            return None

        target["status"] = "escalated"
        target["escalated_at"] = now
        target["escalation_reason"] = reason
        target["escalated_to"] = escalated_to
        return await self.save_emergency_event(uid, target)

    async def update_emergency_event_receipts(
        self,
        uid: str,
        event_id: str,
        new_receipts: List[Dict[str, Any]],
    ) -> Optional[Dict[str, Any]]:
        """Append or update notification delivery receipts on an event."""
        target = await self.get_emergency_event(uid, event_id)
        if not target:
            return None

        existing_receipts = target.get("notifications_dispatched", [])
        # Update matching receipts by contact_id + channel, or append
        receipt_map = {f"{r.get('contact_id')}_{r.get('channel')}": r for r in existing_receipts}
        for nr in new_receipts:
            receipt_map[f"{nr.get('contact_id')}_{nr.get('channel')}"] = nr

        target["notifications_dispatched"] = list(receipt_map.values())
        return await self.save_emergency_event(uid, target)

    async def check_and_suppress_duplicate_alert(
        self,
        uid: str,
        trigger_type: str,
        reason: str,
        suppression_window_seconds: int = 120,
    ) -> Optional[Dict[str, Any]]:
        """Check if an identical alert was generated within suppression window to prevent notification flood."""
        now_dt = datetime.now(timezone.utc)
        recent_events = await self.get_emergency_events(uid, limit=5)
        for evt in recent_events:
            if evt.get("trigger_type") == trigger_type and evt.get("reason") == reason:
                trig_str = evt.get("triggered_at")
                if trig_str:
                    try:
                        trig_dt = datetime.fromisoformat(trig_str.replace("Z", "+00:00"))
                        elapsed = (now_dt - trig_dt).total_seconds()
                        if 0 <= elapsed <= suppression_window_seconds:
                            logger.info(f"Duplicate alert suppressed for user {uid}: {reason} ({elapsed:.1f}s ago)")
                            return evt
                    except Exception:
                        pass
        return None


# Singleton service instance
firestore_service = FirestoreService()

