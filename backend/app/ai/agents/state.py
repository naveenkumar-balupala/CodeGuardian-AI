from typing import Any, Dict, List, Optional, TypedDict
from pydantic import BaseModel, Field

class RepositoryAgentOutput(BaseModel):
    file_tree_summary: str
    total_files: int
    total_size_mb: float
    detected_languages: Dict[str, int]
    package_manifests: List[str]

class ArchitectureAgentOutput(BaseModel):
    pattern: str # MONOREPO, MICROSERVICES, LAYERED_MONOLITH
    layer_isolation_score: int # 0 to 100
    coupling_risk: str # LOW, MEDIUM, HIGH
    architectural_flaws: List[str]

class SecurityAgentOutput(BaseModel):
    critical_vulnerabilities: int
    high_vulnerabilities: int
    cwe_findings: List[Dict[str, Any]]
    secret_leak_alerts: List[str]

class DatabaseAgentOutput(BaseModel):
    orm_framework: str
    migration_tool: str
    n_plus_one_risks: List[str]
    missing_indexes: List[str]
    sql_injection_risks: List[str]

class PerformanceAgentOutput(BaseModel):
    memory_leak_risks: List[str]
    async_blocking_calls: List[str]
    caching_opportunities: List[str]
    latency_score: int

class TestingAgentOutput(BaseModel):
    test_framework: str
    unit_test_count: int
    estimated_coverage_pct: float
    untested_modules: List[str]

class DocumentationAgentOutput(BaseModel):
    readme_quality_score: int
    has_openapi_spec: bool
    missing_docstring_modules: List[str]

class RecommendationAgentOutput(BaseModel):
    prioritized_remediations: List[Dict[str, Any]]
    suggested_patch_diffs: List[Dict[str, str]]

class ReportAgentOutput(BaseModel):
    overall_health_score: int
    security_grade: str
    executive_summary_md: str
    pdf_report_ready: bool

class ChatAgentOutput(BaseModel):
    answer: str
    referenced_files: List[str]
    suggested_followups: List[str]

class AgentState(TypedDict):
    """LangGraph State Container passed between agent nodes."""
    repository_id: str
    repository_full_name: str
    current_node: str
    completed_nodes: List[str]
    
    # Subagent outputs
    repository_data: Optional[Dict[str, Any]]
    architecture_data: Optional[Dict[str, Any]]
    security_data: Optional[Dict[str, Any]]
    database_data: Optional[Dict[str, Any]]
    performance_data: Optional[Dict[str, Any]]
    testing_data: Optional[Dict[str, Any]]
    documentation_data: Optional[Dict[str, Any]]
    recommendations_data: Optional[Dict[str, Any]]
    report_data: Optional[Dict[str, Any]]

    # Conversation history memory
    user_query: Optional[str]
    messages: List[Dict[str, str]]
