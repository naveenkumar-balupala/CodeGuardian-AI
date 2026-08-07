import uuid
from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

class CodeReview(Base):
    """Stores AI Code Review findings, static analyzer results (Semgrep, SonarQube, Bandit, ESLint, Pylint), metrics, explanations, and patch diffs."""
    __tablename__ = "code_reviews"

    repository_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)

    overall_score: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    grade: Mapped[str] = mapped_column(String(10), nullable=False, default="A+")

    # Quality Metrics
    cyclomatic_complexity: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    maintainability_index: Mapped[float] = mapped_column(Float, nullable=False, default=100.0)
    dead_code_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    naming_violations_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    code_smells_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Detailed Analyzed Issues List
    issues: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)

    reviewed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationship
    repository: Mapped["Repository"] = relationship("Repository")

    __table_args__ = (
        Index("idx_code_review_repo_id", "repository_id"),
    )
