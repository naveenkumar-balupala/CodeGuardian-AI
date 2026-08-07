import uuid
from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, SoftDeleteMixin
from app.models.enums import RepoProvider


class Repository(Base, SoftDeleteMixin):
    """Git Repository entity owned by an Organization with rich metadata and processing status."""
    __tablename__ = "repositories"

    organization_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(512), nullable=False, index=True)
    provider: Mapped[RepoProvider] = mapped_column(SQLEnum(RepoProvider), default=RepoProvider.GITHUB, nullable=False)
    clone_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    default_branch: Mapped[str] = mapped_column(String(128), default="main", nullable=False)
    is_private: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Extended Metadata
    size_bytes: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    file_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_commit_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    last_commit_author: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_commit_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Background Processing Queue Status
    processing_status: Mapped[str] = mapped_column(String(32), default="QUEUED", nullable=False, index=True) # QUEUED, CLONING, VIRUS_CHECK, INDEXING, COMPLETED, FAILED
    processing_progress: Mapped[int] = mapped_column(Integer, default=0, nullable=False) # 0 to 100%
    processing_error: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="repositories")
    scans: Mapped[list["Scan"]] = relationship("Scan", back_populates="repository", cascade="all, delete-orphan")
    findings: Mapped[list["Finding"]] = relationship("Finding", back_populates="repository", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_org_repo_name", "organization_id", "name"),
    )

class APIKey(Base):
    """API Key for CI/CD pipeline integration and programmatic access."""
    __tablename__ = "api_keys"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    key_name: Mapped[str] = mapped_column(String(255), nullable=False)
    key_prefix: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    hashed_key: Mapped[str] = mapped_column(String(255), nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="api_keys")
