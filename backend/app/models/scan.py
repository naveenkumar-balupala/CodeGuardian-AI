import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Enum as SQLEnum, ForeignKey, DateTime, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import ScanType, ScanStatus

class Scan(Base):
    """Security Scan Execution record."""

    repository_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)
    triggered_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    scan_type: Mapped[ScanType] = mapped_column(SQLEnum(ScanType), default=ScanType.FULL_AUDIT, nullable=False)
    status: Mapped[ScanStatus] = mapped_column(SQLEnum(ScanStatus), default=ScanStatus.PENDING, nullable=False, index=True)
    commit_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    branch: Mapped[str] = mapped_column(String(128), default="main", nullable=False)
    
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="scans")
    triggered_by_user: Mapped[Optional["User"]] = relationship("User", back_populates="triggered_scans")
    findings: Mapped[List["Finding"]] = relationship("Finding", back_populates="scan", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_repo_scan_status", "repository_id", "status"),
    )
