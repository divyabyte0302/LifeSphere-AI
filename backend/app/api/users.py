"""User Profile & Identity Management Endpoints.

Provides:
- GET /api/users/me: Retrieve caller's verified profile from users/{uid}.
- PATCH /api/users/me: Update user profile and preferences.
- DELETE /api/users/me: Purge user profile and all associated subcollection records.
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, status, HTTPException
from app.dependencies.auth import get_current_user
from app.schemas import UserProfile, UserProfileUpdate
from app.services.firestore_service import firestore_service

router = APIRouter(prefix="/api/users", tags=["User Profile & Privacy"])


@router.get(
    "/me",
    response_model=UserProfile,
    summary="Get Current User Profile",
)
async def get_my_profile(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve verified profile information from Cloud Firestore users/{uid}.

    Extracts identity strictly from the verified Firebase ID token.
    """
    uid = current_user["uid"]
    profile_dict = await firestore_service.get_user_profile(uid)

    if not profile_dict:
        # Auto-initialize baseline profile document on first verified sign-in
        profile_dict = {
            "uid": uid,
            "email": current_user.get("email", ""),
            "display_name": (current_user.get("email") or "Patient").split("@")[0].capitalize(),
            "role": current_user.get("role", "USER"),
            "primary_condition": "Asthma & Environmental Air Sensitivity",
            "hipaa_consent_given": True,
        }
        profile_dict = await firestore_service.save_user_profile(uid, profile_dict)

    return UserProfile(**profile_dict)


@router.patch(
    "/me",
    response_model=UserProfile,
    summary="Update Current User Profile",
)
async def update_my_profile(
    payload: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update profile attributes (display name, conditions, emergency contact)."""
    uid = current_user["uid"]
    existing = await firestore_service.get_user_profile(uid) or {"uid": uid}

    update_data = payload.model_dump(exclude_unset=True)
    merged = {**existing, **update_data}

    saved = await firestore_service.save_user_profile(uid, merged)
    return UserProfile(**saved)


@router.delete(
    "/me",
    status_code=status.HTTP_200_OK,
    summary="Delete User Account and Associated Records",
)
async def delete_my_account(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Purge user profile and all subcollection data (HIPAA § 164.502 and Right to Erasure)."""
    uid = current_user["uid"]
    success = await firestore_service.delete_user_data(uid)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete user data deletion in Firestore",
        )

    return {
        "status": "success",
        "message": f"User {uid} and all associated telemetry records have been purged.",
    }
