from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import get_logger
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    generate_random_token,
    get_password_hash,
    hash_token,
    verify_password,
)
from app.exceptions.base import (
    ForbiddenException,
    UnauthorizedException,
    ValidationException,
)
from app.models import AuditLog, RefreshToken, User, UserRole, UserStatus
from app.schemas.auth import TokenResponse, UserLogin, UserRegister, UserResponse

logger = get_logger(__name__)

class AuthService:
    """Enterprise Authentication & Security Logic Service."""

    @staticmethod
    async def register_user(db: AsyncSession, data: UserRegister) -> User:
        """Registers a new user account."""
        query = select(User).where(User.email == data.email)
        result = await db.execute(query)
        if result.scalar_one_or_none():
            raise ValidationException("An account with this email address already exists.")

        verification_token = generate_random_token()
        user = User(
            email=data.email,
            hashed_password=get_password_hash(data.password),
            full_name=data.full_name,
            role=UserRole.DEVELOPER,
            status=UserStatus.ACTIVE,
            is_verified=False,
            verification_token=verification_token,
        )
        db.add(user)
        await db.flush()

        # Audit Log
        audit = AuditLog(
            user_id=user.id,
            action="USER_REGISTERED",
            resource_type="USER",
            resource_id=str(user.id),
            payload={"email": user.email},
        )
        db.add(audit)
        await db.commit()
        await db.refresh(user)

        logger.info("User registered successfully", user_id=str(user.id), email=user.email)
        return user

    @staticmethod
    async def authenticate_user(db: AsyncSession, data: UserLogin, ip_address: str | None = None) -> TokenResponse:
        """Authenticates a user and issues access/refresh tokens."""
        query = select(User).where(User.email == data.email)
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise UnauthorizedException("Invalid email or password.")

        # 1. Check Account Lock Status
        now = datetime.now(UTC)
        if user.locked_until and user.locked_until > now:
            minutes_left = int((user.locked_until - now).total_seconds() // 60) + 1
            raise ForbiddenException(f"Account locked due to multiple failed login attempts. Try again in {minutes_left} minutes.")

        # 2. Verify Password
        if not verify_password(data.password, user.hashed_password):
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.MAX_FAILED_LOGIN_ATTEMPTS:
                user.locked_until = now + timedelta(minutes=settings.ACCOUNT_LOCKOUT_MINUTES)
                logger.warning("Account locked due to failed attempts", user_id=str(user.id))

            # Audit Failed Attempt
            db.add(AuditLog(
                user_id=user.id,
                action="LOGIN_FAILED",
                resource_type="USER",
                resource_id=str(user.id),
                ip_address=ip_address,
                payload={"failed_attempts": user.failed_login_attempts},
            ))
            await db.commit()
            raise UnauthorizedException("Invalid email or password.")

        # 3. Check 2FA if Enabled
        if user.is_totp_enabled:
            if not data.totp_code or data.totp_code != "123456": # Placeholder 2FA check
                raise UnauthorizedException("Invalid 2FA authentication code.")

        # Reset failed attempts on successful login
        user.failed_login_attempts = 0
        user.locked_until = None

        # 4. Generate Tokens
        access_token = create_access_token(subject=user.id, roles=[user.role.value])
        refresh_token_str, expires_at = create_refresh_token(subject=user.id)
        refresh_token_hash = hash_token(refresh_token_str)

        # Store hashed refresh token in database
        db_refresh = RefreshToken(
            user_id=user.id,
            token_hash=refresh_token_hash,
            expires_at=expires_at,
        )
        db.add(db_refresh)

        # Audit Success Log
        db.add(AuditLog(
            user_id=user.id,
            action="LOGIN_SUCCESS",
            resource_type="USER",
            resource_id=str(user.id),
            ip_address=ip_address,
        ))
        await db.commit()
        await db.refresh(user)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token_str,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserResponse.model_validate(user),
        )

    @staticmethod
    async def refresh_access_token(db: AsyncSession, refresh_token_str: str) -> TokenResponse:
        """Refreshes an access token using a valid refresh token."""
        try:
            payload = decode_token(refresh_token_str)
            if payload.get("type") != "refresh":
                raise UnauthorizedException("Invalid refresh token type.")
            if not payload.get("sub"):
                raise UnauthorizedException("Invalid refresh token payload.")
        except Exception as err:
            raise UnauthorizedException("Invalid or expired refresh token.") from err

        token_hash = hash_token(refresh_token_str)
        query = select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.is_revoked == False,
        )
        result = await db.execute(query)
        db_token = result.scalar_one_or_none()

        if not db_token or db_token.expires_at < datetime.now(UTC):
            raise UnauthorizedException("Refresh token revoked or expired.")

        # Fetch user
        user = await db.get(User, db_token.user_id)
        if not user or user.status != UserStatus.ACTIVE:
            raise UnauthorizedException("User account inactive or suspended.")

        # Revoke old refresh token & issue new pair
        db_token.is_revoked = True
        new_access_token = create_access_token(subject=user.id, roles=[user.role.value])
        new_refresh_str, expires_at = create_refresh_token(subject=user.id)
        new_token_hash = hash_token(new_refresh_str)

        db.add(RefreshToken(
            user_id=user.id,
            token_hash=new_token_hash,
            expires_at=expires_at,
        ))
        await db.commit()

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_str,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserResponse.model_validate(user),
        )

    @staticmethod
    async def logout_user(db: AsyncSession, refresh_token_str: str) -> None:
        """Revokes a refresh token during user logout."""
        token_hash = hash_token(refresh_token_str)
        query = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        result = await db.execute(query)
        token_record = result.scalar_one_or_none()
        if token_record:
            token_record.is_revoked = True
            await db.commit()

    @staticmethod
    async def request_password_reset(db: AsyncSession, email: str) -> str:
        """Generates a password reset token for the given email."""
        query = select(User).where(User.email == email)
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            # Return dummy token to prevent user enumeration
            return "reset_token_sent"

        reset_token = generate_random_token()
        user.reset_token = reset_token
        user.reset_token_expires_at = datetime.now(UTC) + timedelta(hours=1)

        db.add(AuditLog(
            user_id=user.id,
            action="PASSWORD_RESET_REQUESTED",
            resource_type="USER",
            resource_id=str(user.id),
        ))
        await db.commit()
        return reset_token

    @staticmethod
    async def reset_password(db: AsyncSession, token: str, new_password: str) -> None:
        """Resets user password using valid token."""
        query = select(User).where(
            User.reset_token == token,
            User.reset_token_expires_at > datetime.now(UTC),
        )
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise ValidationException("Invalid or expired password reset token.")

        user.hashed_password = get_password_hash(new_password)
        user.reset_token = None
        user.reset_token_expires_at = None

        db.add(AuditLog(
            user_id=user.id,
            action="PASSWORD_RESET_COMPLETED",
            resource_type="USER",
            resource_id=str(user.id),
        ))
        await db.commit()

    @staticmethod
    async def verify_email(db: AsyncSession, token: str) -> None:
        """Verifies email address using token."""
        query = select(User).where(User.verification_token == token)
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise ValidationException("Invalid verification token.")

        user.is_verified = True
        user.verification_token = None
        await db.commit()

    @staticmethod
    async def authenticate_oauth_user(db: AsyncSession, profile: dict[str, Any]) -> TokenResponse:
        """Authenticates or registers a user via OAuth provider payload."""
        email = profile.get("email")
        oauth_id = profile.get("oauth_id")
        provider = profile.get("oauth_provider")

        query = select(User).where(User.email == email)
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            user = User(
                email=email,
                hashed_password=get_password_hash(generate_random_token(16)),
                full_name=profile.get("full_name") or "OAuth User",
                role=UserRole.DEVELOPER,
                status=UserStatus.ACTIVE,
                is_verified=True,
                oauth_provider=provider,
                oauth_id=oauth_id,
            )
            db.add(user)
            await db.flush()
        else:
            user.oauth_provider = provider
            user.oauth_id = oauth_id

        access_token = create_access_token(subject=user.id, roles=[user.role.value])
        refresh_token_str, expires_at = create_refresh_token(subject=user.id)

        db.add(RefreshToken(
            user_id=user.id,
            token_hash=hash_token(refresh_token_str),
            expires_at=expires_at,
        ))
        db.add(AuditLog(
            user_id=user.id,
            action="OAUTH_LOGIN_SUCCESS",
            resource_type="USER",
            resource_id=str(user.id),
            payload={"provider": provider},
        ))
        await db.commit()
        await db.refresh(user)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token_str,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserResponse.model_validate(user),
        )
