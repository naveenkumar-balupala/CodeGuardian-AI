import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import RepoProvider


class RepositoryCreateURL(BaseModel):
    clone_url: str = Field(..., description="Git HTTPS or SSH URL (GitHub, GitLab, Bitbucket)")
    default_branch: str = Field("main", description="Git branch to monitor and scan")
    access_token: str | None = Field(None, description="Optional access token for private repositories")

class RepositoryProgressResponse(BaseModel):
    id: uuid.UUID
    processing_status: str
    processing_progress: int
    processing_error: str | None = None

class RepositoryResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    name: str
    full_name: str
    provider: RepoProvider
    clone_url: str
    default_branch: str
    is_private: bool
    size_bytes: int
    file_count: int
    last_commit_hash: str | None = None
    last_commit_author: str | None = None
    last_commit_message: str | None = None
    processing_status: str
    processing_progress: int
    created_at: datetime

    class Config:
        from_attributes = True
