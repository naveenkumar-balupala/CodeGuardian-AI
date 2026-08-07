import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Index, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import ScanStatus, ScanType


class Scan(Base):
    """Security Scan Execution record."""

    repository_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)
    triggered_by_user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    scan_type: Mapped[ScanType] = mapped_column(SQLEnum(ScanType), default=ScanType.FULL_AUDIT, nullable=False)
    status: Mapped[ScanStatus] = mapped_column(SQLEnum(ScanStatus), default=ScanStatus.PENDING, nullable=False, index=True)
    commit_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    branch: Mapped[str] = mapped_column(String(128), default="main", nullable=False)

    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="scans")
    triggered_by_user: Mapped[Optional["User"]] = relationship("User", back_populates="triggered_scans")
    findings: Mapped[list["Finding"]] = relationship("Finding", back_populates="scan", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_repo_scan_status", "repository_id", "status"),
    )
