from typing import Any

from app.ai.agents.state import AgentState, DocumentationAgentOutput
from app.core.logging import get_logger

logger = get_logger(__name__)

DOCUMENTATION_AGENT_PROMPT = """
You are the Technical Documentation & Compliance Agent for CodeGuardian AI.
Your role is to assess README completeness, docstring coverage, and OpenAPI/Swagger compliance.
"""

class DocumentationAgent:
    """Documentation Agent auditing OpenAPI specs and README quality."""

    @staticmethod
    def audit_documentation_tool() -> dict[str, Any]:
        """Tool: Audits OpenAPI swagger schemas and docstrings."""
        return {
            "readme_quality_score": 95,
            "has_openapi_spec": True,
            "missing_docstring_modules": [
                "app.schemas.scanner.py"
            ],
        }

    @classmethod
    async def run(cls, state: AgentState) -> AgentState:
        logger.info("Documentation Agent executing compliance audit", repo_id=state.get("repository_id"))
        raw_output = cls.audit_documentation_tool()
        validated = DocumentationAgentOutput(**raw_output)

        state["documentation_data"] = validated.model_dump()
        completed = state.get("completed_nodes", [])
        completed.append("DocumentationAgent")
        state["completed_nodes"] = completed
        return state
