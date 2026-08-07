import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ReviewIssueItem(BaseModel):
    id: str
    tool: str # 'Semgrep' | 'SonarQube' | 'Bandit' | 'ESLint' | 'Pylint'
    type: str # 'VULNERABILITY' | 'CODE_SMELL' | 'DEAD_CODE' | 'NAMING' | 'COMPLEXITY'
    severity: str # 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
    file_path: str
    line_number: int
    code_snippet: str
    ai_explanation: str
    ai_suggestion: str
    patch_diff: Optional[str] = None

class CodeReviewResponse(BaseModel):
    id: uuid.UUID
    repository_id: uuid.UUID
    overall_score: int
    grade: str
    cyclomatic_complexity: float
    maintainability_index: float
    dead_code_count: int
    naming_violations_count: int
    code_smells_count: int
    issues: List[ReviewIssueItem]
    reviewed_at: datetime

    class Config:
        from_attributes = True
