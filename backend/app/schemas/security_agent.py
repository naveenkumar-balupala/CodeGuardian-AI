import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel

class SecurityFindingItem(BaseModel):
    id: str
    category: str # 'SQL_INJECTION' | 'SECRETS' | 'XSS' | 'JWT' | 'CSRF' | 'DEPENDENCY' | 'OWASP'
    owasp_category: str # e.g. 'A03:2021-Injection'
    cwe_id: str # e.g. 'CWE-89'
    title: str
    severity: str # 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
    cvss_score: float # e.g. 9.8
    cvss_vector: str # e.g. 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    file_path: str
    line_number: int
    code_snippet: str
    recommendation: str
    patch_diff: Optional[str] = None

class SecurityAgentReportResponse(BaseModel):
    id: uuid.UUID
    repository_id: uuid.UUID
    risk_score: int
    risk_level: str
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    findings: List[SecurityFindingItem]
    owasp_distribution: Dict[str, int]
    chart_dataset: Dict[str, Any]
    scanned_at: datetime

    class Config:
        from_attributes = True
