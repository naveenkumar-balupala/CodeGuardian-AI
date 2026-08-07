import uuid
from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel

class DependencyItem(BaseModel):
    name: str
    version: str
    category: str # 'frontend' | 'backend' | 'dev'

class RepositoryAnalysisResponse(BaseModel):
    id: uuid.UUID
    repository_id: uuid.UUID
    languages: Dict[str, int]
    frameworks: List[str]
    architecture_style: str
    databases: List[str]
    ci_cd_tools: List[str]
    docker_configs: List[str]
    package_managers: List[str]
    has_swagger: bool
    dependencies: List[DependencyItem]
    summary_report: str
    scanned_at: datetime

    class Config:
        from_attributes = True
