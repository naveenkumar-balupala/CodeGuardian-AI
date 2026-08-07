from pydantic import BaseModel


class ProjectScoreMetric(BaseModel):
    score: int
    grade: str
    previous_score: int
    status_label: str

class SeverityBreakdown(BaseModel):
    critical: int
    high: int
    medium: int
    low: int
    info: int
    total: int

class RepositorySummary(BaseModel):
    id: str
    name: str
    full_name: str
    provider: str
    branch: str
    status: str
    vulnerability_count: int
    last_scan_at: str | None

class ReviewHistoryItem(BaseModel):
    id: str
    finding_title: str
    rule_id: str
    file_path: str
    auditor_name: str
    previous_status: str
    new_status: str
    comment: str | None
    timestamp: str

class SecurityTrendPoint(BaseModel):
    date: str
    critical: int
    high: int
    medium: int
    low: int

class ActivityItem(BaseModel):
    id: str
    action: str
    user_name: str
    resource_type: str
    details: str
    timestamp: str

class NotificationAlert(BaseModel):
    id: str
    title: str
    message: str
    severity: str
    timestamp: str
    read: bool

class DashboardSummaryResponse(BaseModel):
    project_score: ProjectScoreMetric
    severity_breakdown: SeverityBreakdown
    total_repositories: int
    total_scans_run: int
    pass_rate_percentage: float
    repositories: list[RepositorySummary]
    review_history: list[ReviewHistoryItem]
    security_trends: list[SecurityTrendPoint]
    recent_activity: list[ActivityItem]
    notifications: list[NotificationAlert]
