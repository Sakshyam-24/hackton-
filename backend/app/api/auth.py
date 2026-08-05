"""Auth API endpoints."""

import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.core.logger import logger
from app.core.security import (
    create_access_token,
    verify_access_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Auth"])

# In-memory user store
_users: dict[str, dict] = {}


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    createdAt: str
    updatedAt: str


class AuthResponse(BaseModel):
    user: UserResponse
    token: str


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(request: RegisterRequest):
    # Check if user already exists
    for u in _users.values():
        if u["email"] == request.email.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    user = {
        "id": user_id,
        "name": request.name,
        "email": request.email.lower(),
        "password_hash": hash_password(request.password),
        "role": "user",
        "createdAt": now,
        "updatedAt": now,
    }
    _users[user_id] = user

    token = create_access_token({"sub": user_id, "email": user["email"]})

    logger.info(f"User registered: {user['email']}")

    return AuthResponse(
        user=UserResponse(
            id=user_id,
            name=user["name"],
            email=user["email"],
            role=user["role"],
            createdAt=user["createdAt"],
            updatedAt=user["updatedAt"],
        ),
        token=token,
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Login with email and password",
)
async def login(request: LoginRequest):
    user = None
    for u in _users.values():
        if u["email"] == request.email.lower():
            user = u
            break

    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": user["id"], "email": user["email"]})

    logger.info(f"User logged in: {user['email']}")

    return AuthResponse(
        user=UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            role=user["role"],
            createdAt=user["createdAt"],
            updatedAt=user["updatedAt"],
        ),
        token=token,
    )


@router.get(
    "/profile",
    response_model=UserResponse,
    summary="Get current user profile",
)
async def get_profile(authorization: Optional[str] = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    token = authorization.replace("Bearer ", "")
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = _users.get(payload.get("sub"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        createdAt=user["createdAt"],
        updatedAt=user["updatedAt"],
    )


@router.patch(
    "/profile",
    response_model=UserResponse,
    summary="Update user profile",
)
async def update_profile(
    request: ProfileUpdateRequest,
    authorization: Optional[str] = None,
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    token = authorization.replace("Bearer ", "")
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = _users.get(payload.get("sub"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if request.name:
        user["name"] = request.name
    if request.email:
        user["email"] = request.email.lower()
    user["updatedAt"] = datetime.now(timezone.utc).isoformat()

    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        createdAt=user["createdAt"],
        updatedAt=user["updatedAt"],
    )
