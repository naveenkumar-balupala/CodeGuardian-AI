import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain text password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generates a bcrypt hash from a plain text password."""
    return pwd_context.hash(password)

def create_access_token(subject: str | Any, roles: list | None = None, expires_delta: timedelta | None = None) -> str:
    """Creates a short-lived JWT Access Token."""
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "sub": str(subject),
        "exp": expire,
        "type": "access",
        "roles": roles or [],
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(subject: str | Any, expires_delta: timedelta | None = None) -> tuple[str, datetime]:
    """Creates a long-lived Refresh Token."""
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    token_secret = secrets.token_urlsafe(48)
    to_encode = {
        "sub": str(subject),
        "jti": token_secret,
        "exp": expire,
        "type": "refresh",
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt, expire

def decode_token(token: str) -> dict[str, Any]:
    """Decodes and validates a JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc

def hash_token(token: str) -> str:
    """Generates SHA-256 hash string of a token for secure database storage."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def generate_random_token(length: int = 32) -> str:
    """Generates a cryptographically secure random token string."""
    return secrets.token_hex(length)
