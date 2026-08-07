import uuid
from datetime import datetime

from pydantic import BaseModel


class DependencyItem(BaseModel):
    name: str
    version: str
    category: str # 'frontend' | 'backend' | 'dev'

class RepositoryAnalysisResponse(BaseModel):
    id: uuid.UUID
    repository_id: uuid.UUID
    languages: dict[str, int]
    frameworks: list[str]
    architecture_style: str
    databases: list[str]
    ci_cd_tools: list[str]
    docker_configs: list[str]
    package_managers: list[str]
    has_swagger: bool
    dependencies: list[DependencyItem]
    summary_report: str
    scanned_at: datetime

    class Config:
        from_attributes = True
