import uuid
from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

class ReportExport(Base):
    """Stores generated report metadata, format (PDF, DOCX, PPTX), executive summary, branding config, file path, and download URLs."""
    __tablename__ = "report_exports"

    repository_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)

    format: Mapped[str] = mapped_column(String(16), nullable=False) # PDF, DOCX, PPTX
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    executive_summary: Mapped[str] = mapped_column(Text, nullable=False)

    branding_info: Mapped[dict] = mapped_column(JSON_TYPE, nullable=False, default=dict)
    sections: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)

    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    download_url: Mapped[str] = mapped_column(String(512), nullable=False)

    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationship
    repository: Mapped["Repository"] = relationship("Repository")

    __table_args__ = (
        Index("idx_report_export_repo_id", "repository_id"),
    )
