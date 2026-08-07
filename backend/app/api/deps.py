from collections.abc import AsyncGenerator
from uuid import UUID

import redis.asyncio as aioredis
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.redis import redis_client
from app.core.security import decode_token
from app.exceptions.base import ForbiddenException, UnauthorizedException
from app.models import User, UserRole, UserStatus

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that yields a database session."""
    async for session in get_db_session():
        yield session

async def get_redis() -> aioredis.Redis | None:
    """Dependency that returns the Redis client instance."""
    return redis_client

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Dependency validating JWT access token and returning current User."""
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise UnauthorizedException("Invalid token type.")
        user_id_str: str = payload.get("sub")
        if not user_id_str:
            raise UnauthorizedException("Could not validate credentials.")
        user_id = UUID(user_id_str)
    except Exception:
        raise UnauthorizedException("Could not validate credentials or token expired.")

    user = await db.get(User, user_id)
    if not user:
        raise UnauthorizedException("User not found.")
    if user.status != UserStatus.ACTIVE:
        raise ForbiddenException("User account is inactive or suspended.")
    return user

def require_role(allowed_roles: list[UserRole]):
    """Role-Based Access Control (RBAC) dependency validator."""
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise ForbiddenException(
                f"Role '{current_user.role.value}' is not authorized. Allowed roles: {[r.value for r in allowed_roles]}"
            )
        return current_user
    return role_checker
