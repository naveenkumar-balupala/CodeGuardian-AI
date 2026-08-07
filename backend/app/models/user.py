import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import String, Boolean, Integer, Enum as SQLEnum, ForeignKey, UniqueConstraint, Index, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, SoftDeleteMixin
from app.models.enums import UserRole, UserStatus, OrgTier, MemberRole

class User(Base, SoftDeleteMixin):
    """User account entity with enterprise security and auth fields."""

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), default=UserRole.DEVELOPER, nullable=False)
    status: Mapped[UserStatus] = mapped_column(SQLEnum(UserStatus), default=UserStatus.ACTIVE, nullable=False)

    # Security & Verification
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    verification_token: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    reset_token: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    reset_token_expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Account Protection
    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    locked_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Two-Factor Authentication (2FA) Ready
    totp_secret: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_totp_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # OAuth Integration
    oauth_provider: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    oauth_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)

    # Relationships
    org_memberships: Mapped[List["OrganizationMember"]] = relationship("OrganizationMember", back_populates="user", cascade="all, delete-orphan")
    api_keys: Mapped[List["APIKey"]] = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")
    refresh_tokens: Mapped[List["RefreshToken"]] = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    triggered_scans: Mapped[List["Scan"]] = relationship("Scan", back_populates="triggered_by_user")
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="user")

class RefreshToken(Base):
    """Hashed refresh tokens for JWT auth lifecycle."""
    __tablename__ = "refresh_tokens"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="refresh_tokens")

class Organization(Base, SoftDeleteMixin):
    """Organization / Tenant entity."""

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    tier: Mapped[OrgTier] = mapped_column(SQLEnum(OrgTier), default=OrgTier.FREE, nullable=False)

    # Relationships
    members: Mapped[List["OrganizationMember"]] = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")
    repositories: Mapped[List["Repository"]] = relationship("Repository", back_populates="organization", cascade="all, delete-orphan")
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="organization")

class OrganizationMember(Base):
    """Link table between Organizations and Users with role scoping."""
    __tablename__ = "organization_members"

    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role: Mapped[MemberRole] = mapped_column(SQLEnum(MemberRole), default=MemberRole.MEMBER, nullable=False)

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="members")
    user: Mapped["User"] = relationship("User", back_populates="org_memberships")

    __table_args__ = (
        UniqueConstraint("organization_id", "user_id", name="uq_org_user_membership"),
        Index("idx_org_user", "organization_id", "user_id"),
    )
