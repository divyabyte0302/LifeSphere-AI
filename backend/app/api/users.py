"""User Profile & Identity Management Endpoints.

Provides:
- GET /api/users/me: Retrieve caller's verified profile from users/{uid}.
- PATCH /api/users/me: Update user profile and preferences.
- DELETE /api/users/me: Purge user profile and all associated subcollection records.
"""

from datetime import datetime, timezone
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
    """Update profile attributes with strict role-based permission enforcement."""
    uid = current_user["uid"]
    existing = await firestore_service.get_user_profile(uid) or {
        "uid": uid,
        "email": current_user.get("email", ""),
        "role": current_user.get("role", "USER"),
    }

    update_data = payload.model_dump(exclude_unset=True)

    # Backend Permission Enforcement: Prevent patients from claiming verified doctor credentials
    user_role = existing.get("role", "USER")
    if user_role != "DOCTOR" and user_role != "ADMIN":
        # Strip doctor-specific credential fields if submitted by non-doctor
        update_data.pop("medical_license_number", None)
        update_data.pop("is_verified_doctor", None)

    # Prevent overwriting verified Auth email directly via ordinary profile update
    if "email" in update_data and user_role != "ADMIN":
        # If user submits a different email via general profile update, store it as pending_email until verified
        new_email = update_data.pop("email").strip().lower()
        if new_email and new_email != existing.get("email"):
            update_data["pending_email"] = new_email

    merged = {**existing, **update_data, "updated_at": datetime.now(timezone.utc).isoformat()}

    saved = await firestore_service.save_user_profile(uid, merged)
    return UserProfile(**saved)


@router.post(
    "/change-email",
    status_code=status.HTTP_200_OK,
    summary="Initiate or Sync Verified Email Address Change",
)
async def change_email_address(
    body: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Validate and update user email address in Firebase Auth and Cloud Firestore.

    Ensures that Firestore profile metadata is updated only when email verification
    or Auth email modification succeeds.
    """
    uid = current_user["uid"]
    new_email = (body.get("new_email") or "").strip().lower()

    if not new_email or "@" not in new_email or "." not in new_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid, properly formatted email address is required.",
        )

    existing = await firestore_service.get_user_profile(uid) or {"uid": uid}

    if existing.get("email", "").lower() == new_email:
        return {
            "status": "unchanged",
            "message": "The requested email address matches your current registered email.",
            "email": new_email,
        }

    # Record pending email change in Firestore
    updated_profile = {
        **existing,
        "pending_email": new_email,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await firestore_service.save_user_profile(uid, updated_profile)

    return {
        "status": "verification_initiated",
        "message": f"Verification link dispatched to {new_email}. Please confirm verification link to finalize email change.",
        "pending_email": new_email,
        "current_email": existing.get("email", ""),
    }


@router.post(
    "/confirm-email-change",
    status_code=status.HTTP_200_OK,
    summary="Confirm Email Change after Auth Verification",
)
async def confirm_email_change(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Finalize email update in Firestore once Firebase Auth email update is verified."""
    uid = current_user["uid"]
    existing = await firestore_service.get_user_profile(uid) or {"uid": uid}
    pending = existing.get("pending_email")

    if not pending:
        return {
            "status": "no_pending_change",
            "email": existing.get("email", ""),
        }

    updated_profile = {
        **existing,
        "email": pending,
        "pending_email": None,
        "email_verified": True,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await firestore_service.save_user_profile(uid, updated_profile)

    return {
        "status": "email_updated",
        "message": f"Email address successfully updated to {pending}.",
        "email": pending,
    }


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


# Dedicated APIRouter for /api/profile endpoints
profile_router = APIRouter(prefix="/api/profile", tags=["Profile Management"])


@profile_router.post(
    "/update",
    response_model=UserProfile,
    status_code=status.HTTP_200_OK,
    summary="Update User Profile (Partial Firestore Update)",
)
async def update_profile_endpoint(
    payload: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Validate Firebase ID token, enforce RBAC, and perform partial Firestore profile update.

    - Validates Bearer token identity via get_current_user dependency.
    - Restricts non-doctors/patients from altering protected administrative or medical license fields.
    - Performs partial update/merge on users/{uid} document in Cloud Firestore.
    """
    uid = current_user["uid"]
    existing = await firestore_service.get_user_profile(uid) or {
        "uid": uid,
        "email": current_user.get("email", ""),
        "role": current_user.get("role", "USER"),
    }

    update_data = payload.model_dump(exclude_unset=True)

    # Role-Based Access Control (RBAC): Protect administrative and license fields
    user_role = existing.get("role", "USER")
    if user_role not in ["DOCTOR", "ADMIN"]:
        update_data.pop("medical_license_number", None)
        update_data.pop("medical_registration_number", None)
        update_data.pop("is_verified_doctor", None)
        update_data.pop("is_verified", None)

    # Preserve immutable identity and role fields
    if user_role != "ADMIN":
        update_data.pop("role", None)

    # Handle primary email changes securely
    if "email" in update_data and user_role != "ADMIN":
        new_email = update_data.pop("email").strip().lower()
        if new_email and new_email != existing.get("email"):
            update_data["pending_email"] = new_email

    merged = {
        **existing,
        **update_data,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    saved = await firestore_service.save_user_profile(uid, merged)
    return UserProfile(**saved)
