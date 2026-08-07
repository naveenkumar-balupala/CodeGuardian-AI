import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models import User
from app.schemas.code_review import CodeReviewResponse
from app.schemas.common import ResponseEnvelope
from app.services.code_review_service import CodeReviewService

router = APIRouter()

@router.post("/repositories/{repo_id}/review", summary="Trigger AI Code Review", response_model=ResponseEnvelope[CodeReviewResponse])
async def trigger_code_review(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Triggers automated static analyzers (Semgrep, SonarQube, Bandit, ESLint, Pylint), calculates quality metrics, and generates AI explanations."""
    review = await CodeReviewService.perform_code_review(db, repo_id)
    return ResponseEnvelope(data=CodeReviewResponse.model_validate(review))

@router.get("/repositories/{repo_id}/review/latest", summary="Get Latest AI Code Review Results", response_model=ResponseEnvelope[CodeReviewResponse])
async def get_latest_code_review(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves latest AI Code Review results, composite score, quality metrics, and issue explanations."""
    review = await CodeReviewService.get_latest_review(db, repo_id)
    return ResponseEnvelope(data=CodeReviewResponse.model_validate(review))
