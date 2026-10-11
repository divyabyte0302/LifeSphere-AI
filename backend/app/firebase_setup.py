"""Firebase Admin and Cloud Firestore Setup Module.

Initializes Firebase Admin SDK using application credentials or environment
variables, and provides thread-safe access to Firestore and Auth.
Includes seamless in-memory fallback for offline testing and local sandbox runs.
"""

import json
import logging
import os
from typing import Optional, Any
from app.config import settings

logger = logging.getLogger("lifesphere.firebase")

# Global instances
_firebase_app = None
_firestore_db = None
_is_mock_mode = False


def initialize_firebase():
    """Initialize Firebase Admin SDK using available credentials or configure mock fallback."""
    global _firebase_app, _firestore_db, _is_mock_mode

    if _firebase_app is not None:
        return _firebase_app

    # Explicit mock mode configured for unit testing / offline development
    if settings.firebase_mock_auth_for_dev:
        logger.info("Initializing in Mock Mode (FIREBASE_MOCK_AUTH_FOR_DEV=true)")
        _is_mock_mode = True
        return None

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        # Check if already initialized in current process
        try:
            _firebase_app = firebase_admin.get_app()
            _firestore_db = firestore.client()
            logger.info("Retrieved existing Firebase Admin App instance")
            return _firebase_app
        except ValueError:
            pass  # Not yet initialized

        # Option A: Service account file path
        if settings.firebase_service_account_key_path and os.path.exists(settings.firebase_service_account_key_path):
            cred = credentials.Certificate(settings.firebase_service_account_key_path)
            _firebase_app = firebase_admin.initialize_app(cred, {"projectId": settings.firebase_project_id})
            _firestore_db = firestore.client()
            logger.info("Initialized Firebase Admin using service account key file")
            return _firebase_app

        # Option B: Inline JSON credentials
        if settings.firebase_service_account_json:
            try:
                cred_dict = json.loads(settings.firebase_service_account_json)
                cred = credentials.Certificate(cred_dict)
                _firebase_app = firebase_admin.initialize_app(cred, {"projectId": settings.firebase_project_id})
                _firestore_db = firestore.client()
                logger.info("Initialized Firebase Admin using inline JSON credentials")
                return _firebase_app
            except Exception as e:
                logger.warning(f"Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: {e}")

        # Option C: Default application credentials or project ID
        try:
            _firebase_app = firebase_admin.initialize_app(options={"projectId": settings.firebase_project_id})
            _firestore_db = firestore.client()
            logger.info("Initialized Firebase Admin using Application Default Credentials")
            return _firebase_app
        except Exception as e:
            logger.warning(f"Could not initialize with Application Default Credentials: {e}. Falling back to developer mock mode.")
            _is_mock_mode = True
            return None

    except ImportError:
        logger.warning("firebase_admin package not found. Using local in-memory fallback.")
        _is_mock_mode = True
        return None


def get_firestore_client() -> Optional[Any]:
    """Retrieve active Firestore database client or None if running in mock mode."""
    global _firestore_db, _is_mock_mode
    if _firestore_db is not None:
        return _firestore_db
    initialize_firebase()
    return _firestore_db


def is_mock_mode() -> bool:
    """Return whether Firebase is running in mock/offline mode."""
    global _is_mock_mode
    return _is_mock_mode or settings.firebase_mock_auth_for_dev
