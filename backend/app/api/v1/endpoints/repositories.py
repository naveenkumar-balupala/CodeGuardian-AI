import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, File, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.core.database import AsyncSessionLocal
from app.exceptions.base import NotFoundException, ValidationException
from app.models import Organization, Repository, User
from app.schemas.common import ResponseEnvelope
from app.schemas.repository import (
    RepositoryCreateURL,
    RepositoryProgressResponse,
    RepositoryResponse,
)
from app.services.repo_service import RepositoryService

router = APIRouter()

async def get_user_org_id(db: AsyncSession, user_id: uuid.UUID) -> uuid.UUID:
    """Helper to get user's organization ID."""
    query = select(Organization).where(Organization.is_deleted == False)
    result = await db.execute(query)
    org = result.scalars().first()
    if not org:
        raise NotFoundException("Organization not found.")
    return org.id

@router.post("/url", summary="Connect & Clone Git Repository URL", status_code=status.HTTP_202_ACCEPTED, response_model=ResponseEnvelope[RepositoryResponse])
async def create_repo_from_url(
    data: RepositoryCreateURL,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = await get_user_org_id(db, current_user.id)
    repo = await RepositoryService.create_repository_url(db, data, org_id)

    # Dispatch background worker
    background_tasks.add_task(RepositoryService.process_repository_background, AsyncSessionLocal, repo.id)

    return ResponseEnvelope(data=RepositoryResponse.model_validate(repo))

@router.post("/upload", summary="Upload ZIP Archive Repository", status_code=status.HTTP_202_ACCEPTED, response_model=ResponseEnvelope[RepositoryResponse])
async def upload_repo_zip(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.endswith(".zip"):
        raise ValidationException("Only .zip archive files are supported.")

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise ValidationException("Uploaded ZIP archive is empty.")

    org_id = await get_user_org_id(db, current_user.id)
    repo = await RepositoryService.create_repository_zip(db, file.filename, file_bytes, org_id)

    # Dispatch background worker
    background_tasks.add_task(RepositoryService.process_repository_background, AsyncSessionLocal, repo.id)

    return ResponseEnvelope(data=RepositoryResponse.model_validate(repo))

@router.get("", summary="List Monitored Repositories", response_model=ResponseEnvelope[list[RepositoryResponse]])
async def list_repositories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Repository).where(Repository.is_deleted == False).order_by(Repository.created_at.desc())
    result = await db.execute(query)
    repos = result.scalars().all()
    return ResponseEnvelope(data=[RepositoryResponse.model_validate(r) for r in repos])

@router.get("/{repo_id}", summary="Get Repository Details", response_model=ResponseEnvelope[RepositoryResponse])
async def get_repository(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = await db.get(Repository, repo_id)
    if not repo or repo.is_deleted:
        raise NotFoundException("Repository not found.")
    return ResponseEnvelope(data=RepositoryResponse.model_validate(repo))

@router.get("/{repo_id}/progress", summary="Poll Repository Processing Progress", response_model=ResponseEnvelope[RepositoryProgressResponse])
async def get_repository_progress(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    progress = await RepositoryService.get_progress(db, repo_id)
    return ResponseEnvelope(data=progress)

@router.delete("/{repo_id}", summary="Delete Monitored Repository")
async def delete_repository(
    repo_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = await db.get(Repository, repo_id)
    if not repo or repo.is_deleted:
        raise NotFoundException("Repository not found.")
    repo.soft_delete()
    await db.commit()
    return {"status": "success", "message": "Repository removed successfully."}
