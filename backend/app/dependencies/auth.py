"""Firebase Authentication FastAPI Dependency.

Accepts Firebase ID tokens via the 'Authorization: Bearer <token>' header,
verifies cryptographic signature and expiry with Firebase Admin SDK,
and extracts the authenticated user's verified UID and claims.
"""

import logging
from typing import Dict, Any, Optional
from fastapi import Header, HTTPException, status
from app.firebase_setup import is_mock_mode

logger = logging.getLogger("lifesphere.auth")


async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Validate Bearer Firebase ID token and return user identity dictionary.

    Raises:
        HTTPException(401): If token is missing, expired, revoked, or invalid.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header. Expected 'Authorization: Bearer <Firebase_ID_Token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format. Must be 'Bearer <Token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1].strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Empty bearer token provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 1. Dev / Mock mode handling for offline development and local pytest runs
    if is_mock_mode():
        # Reject deliberately invalid test tokens
        if token in ("invalid-token", "expired-token", "malformed"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Allow test tokens e.g. "mock-token-user-123" or "mock-token-patient-alex"
        if token.startswith("mock-token-") or token.startswith("test-token-"):
            uid = token.replace("mock-token-", "").replace("test-token-", "")
            return {
                "uid": uid,
                "email": f"{uid}@example.com",
                "role": "USER",
                "auth_time": 1700000000,
                "mock": True,
            }

        # Generic mock fallback
        return {
            "uid": f"user_{token[:8]}",
            "email": "user@lifesphere.ai",
            "role": "USER",
            "mock": True,
        }

    # 2. Production Firebase Admin token verification
    try:
        from firebase_admin import auth as fb_auth

        decoded_token = fb_auth.verify_id_token(token, check_revoked=True)
        uid = decoded_token.get("uid")

        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Verified token does not contain a valid user UID",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return {
            "uid": uid,
            "email": decoded_token.get("email"),
            "role": decoded_token.get("role", "USER"),
            "decoded_token": decoded_token,
        }

    except Exception as e:
        logger.warning(f"Firebase token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed: Firebase ID token is invalid, expired, or revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
