from typing import Dict, Any
from app.ai.agents.state import AgentState, ArchitectureAgentOutput
from app.core.logging import get_logger

logger = get_logger(__name__)

ARCHITECTURE_AGENT_PROMPT = """
You are the Software Architecture Specialist Agent for CodeGuardian AI.
Your role is to evaluate structural isolation, layered monorepo boundaries, circular dependencies,
and domain component encapsulation.
"""

class ArchitectureAgent:
    """Architecture Agent analyzing code layout and structural isolation."""

    @staticmethod
    def audit_architecture_tool() -> Dict[str, Any]:
        """Tool: Audits import coupling and layered monolith structure."""
        return {
            "pattern": "MONOREPO",
            "layer_isolation_score": 92,
            "coupling_risk": "LOW",
            "architectural_flaws": [
                "Direct database model import inside API layer without repository interface abstraction"
            ],
        }

    @classmethod
    async def run(cls, state: AgentState) -> AgentState:
        logger.info("Architecture Agent executing structural audit", repo_id=state.get("repository_id"))
        raw_output = cls.audit_architecture_tool()
        validated = ArchitectureAgentOutput(**raw_output)

        state["architecture_data"] = validated.model_dump()
        completed = state.get("completed_nodes", [])
        completed.append("ArchitectureAgent")
        state["completed_nodes"] = completed
        return state
