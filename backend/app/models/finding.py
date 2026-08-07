import uuid
from typing import Optional

from sqlalchemy import JSON, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, SoftDeleteMixin
from app.models.enums import FindingStatus, SeverityLevel

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

class Finding(Base, SoftDeleteMixin):
    """Vulnerability / Security finding record."""

    scan_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("scans.id", ondelete="CASCADE"), nullable=False, index=True)
    repository_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)

    rule_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    severity: Mapped[SeverityLevel] = mapped_column(SQLEnum(SeverityLevel), default=SeverityLevel.MEDIUM, nullable=False, index=True)
    status: Mapped[FindingStatus] = mapped_column(SQLEnum(FindingStatus), default=FindingStatus.OPEN, nullable=False, index=True)

    file_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    line_number: Mapped[int] = mapped_column(Integer, nullable=False)
    cwe_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    cvss_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    extra_metadata: Mapped[dict | None] = mapped_column(JSON_TYPE, nullable=True)

    # Relationships
    scan: Mapped["Scan"] = relationship("Scan", back_populates="findings")
    repository: Mapped["Repository"] = relationship("Repository", back_populates="findings")
    history: Mapped[list["FindingHistory"]] = relationship("FindingHistory", back_populates="finding", cascade="all, delete-orphan")
    ai_remediation: Mapped[Optional["AIRemediation"]] = relationship("AIRemediation", back_populates="finding", uselist=False, cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_repo_severity_status", "repository_id", "severity", "status"),
    )

class FindingHistory(Base):
    """Immutable audit trail for finding status changes."""
    __tablename__ = "finding_history"

    finding_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("findings.id", ondelete="CASCADE"), nullable=False, index=True)
    changed_by_user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    previous_status: Mapped[FindingStatus] = mapped_column(SQLEnum(FindingStatus), nullable=False)
    new_status: Mapped[FindingStatus] = mapped_column(SQLEnum(FindingStatus), nullable=False)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    finding: Mapped["Finding"] = relationship("Finding", back_populates="history")
    changed_by_user: Mapped[Optional["User"]] = relationship("User")

class AIRemediation(Base):
    """AI Generated code fix and remediation plan."""
    __tablename__ = "ai_remediations"

    finding_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("findings.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)

    suggested_fix_diff: Mapped[str] = mapped_column(Text, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.95, nullable=False)

    prompt_tokens: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    completion_tokens: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    finding: Mapped["Finding"] = relationship("Finding", back_populates="ai_remediation")
