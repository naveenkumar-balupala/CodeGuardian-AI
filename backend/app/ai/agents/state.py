from typing import Any, TypedDict

from pydantic import BaseModel


class RepositoryAgentOutput(BaseModel):
    file_tree_summary: str
    total_files: int
    total_size_mb: float
    detected_languages: dict[str, int]
    package_manifests: list[str]

class ArchitectureAgentOutput(BaseModel):
    pattern: str # MONOREPO, MICROSERVICES, LAYERED_MONOLITH
    layer_isolation_score: int # 0 to 100
    coupling_risk: str # LOW, MEDIUM, HIGH
    architectural_flaws: list[str]

class SecurityAgentOutput(BaseModel):
    critical_vulnerabilities: int
    high_vulnerabilities: int
    cwe_findings: list[dict[str, Any]]
    secret_leak_alerts: list[str]

class DatabaseAgentOutput(BaseModel):
    orm_framework: str
    migration_tool: str
    n_plus_one_risks: list[str]
    missing_indexes: list[str]
    sql_injection_risks: list[str]

class PerformanceAgentOutput(BaseModel):
    memory_leak_risks: list[str]
    async_blocking_calls: list[str]
    caching_opportunities: list[str]
    latency_score: int

class TestingAgentOutput(BaseModel):
    test_framework: str
    unit_test_count: int
    estimated_coverage_pct: float
    untested_modules: list[str]

class DocumentationAgentOutput(BaseModel):
    readme_quality_score: int
    has_openapi_spec: bool
    missing_docstring_modules: list[str]

class RecommendationAgentOutput(BaseModel):
    prioritized_remediations: list[dict[str, Any]]
    suggested_patch_diffs: list[dict[str, str]]

class ReportAgentOutput(BaseModel):
    overall_health_score: int
    security_grade: str
    executive_summary_md: str
    pdf_report_ready: bool

class ChatAgentOutput(BaseModel):
    answer: str
    referenced_files: list[str]
    suggested_followups: list[str]

class AgentState(TypedDict):
    """LangGraph State Container passed between agent nodes."""
    repository_id: str
    repository_full_name: str
    current_node: str
    completed_nodes: list[str]

    # Subagent outputs
    repository_data: dict[str, Any] | None
    architecture_data: dict[str, Any] | None
    security_data: dict[str, Any] | None
    database_data: dict[str, Any] | None
    performance_data: dict[str, Any] | None
    testing_data: dict[str, Any] | None
    documentation_data: dict[str, Any] | None
    recommendations_data: dict[str, Any] | None
    report_data: dict[str, Any] | None

    # Conversation history memory
    user_query: str | None
    messages: list[dict[str, str]]
