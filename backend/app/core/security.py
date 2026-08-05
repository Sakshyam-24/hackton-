"""Security utilities for the application."""

import hashlib
import secrets
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt

from app.core.config import get_settings


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")


def verify_access_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT access token."""
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        return None


def hash_password(password: str) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256."""
    salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return f"{salt}${dk.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    try:
        salt, stored_hash = hashed_password.split("$", 1)
        dk = hashlib.pbkdf2_hmac("sha256", plain_password.encode(), salt.encode(), 100000)
        return hmac.compare_digest(dk.hex(), stored_hash)
    except Exception:
        return False


def generate_api_key() -> str:
    """Generate a secure random API key."""
    return secrets.token_urlsafe(32)


def hash_content(content: bytes) -> str:
    """Generate SHA-256 hash of content."""
    return hashlib.sha256(content).hexdigest()
