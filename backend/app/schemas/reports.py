import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class BrandingConfig(BaseModel):
    company_name: str = "CodeGuardian AI Corp"
    logo_url: Optional[str] = "https://codeguardian.ai/logo.png"
    brand_color: str = "#4f46e5"
    author: str = "Automated Security & Audit Engine"

class ReportExportRequest(BaseModel):
    format: str = Field(default="PDF", description="Export Format: PDF, DOCX, or PPTX")
    title: str = Field(default="Repository Audit & Security Evaluation Report")
    include_executive_summary: bool = True
    include_charts: bool = True
    include_ai_explanations: bool = True
    branding: BrandingConfig = Field(default_factory=BrandingConfig)

class ReportExportResponse(BaseModel):
    id: uuid.UUID
    repository_id: uuid.UUID
    format: str
    title: str
    executive_summary: str
    branding_info: Dict[str, Any]
    file_name: str
    file_size_bytes: int
    download_url: str
    generated_at: datetime

    class Config:
        from_attributes = True
