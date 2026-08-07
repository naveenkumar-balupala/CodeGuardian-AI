import uuid
from datetime import datetime

from pydantic import BaseModel


class ModuleCouplingItem(BaseModel):
    module_name: str
    fan_in: int # incoming imports
    fan_out: int # outgoing imports
    instability: float # fan_out / (fan_in + fan_out)
    coupling_status: str # 'LOW' | 'BALANCED' | 'HIGH_COUPLING'

class PrincipleViolation(BaseModel):
    principle: str # 'SRP' | 'OCP' | 'LSP' | 'ISP' | 'DIP' | 'DRY' | 'KISS'
    title: str
    file_path: str
    line_number: int
    description: str
    severity: str # 'HIGH' | 'MEDIUM' | 'LOW'

class ArchitectureRecommendation(BaseModel):
    priority: int
    title: str
    description: str
    patch_diff: str | None = None

class ArchitectureReportResponse(BaseModel):
    id: uuid.UUID
    repository_id: uuid.UUID
    pattern: str
    coupling_score: float
    solid_score: int
    dry_score: int
    kiss_score: int
    detected_patterns: list[str]
    solid_violations: list[PrincipleViolation]
    dry_violations: list[PrincipleViolation]
    kiss_violations: list[PrincipleViolation]
    module_coupling: list[ModuleCouplingItem]
    mermaid_diagram: str
    ai_recommendations: list[ArchitectureRecommendation]
    scanned_at: datetime

    class Config:
        from_attributes = True
