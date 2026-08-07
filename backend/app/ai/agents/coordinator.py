from app.ai.agents.state import AgentState
from app.core.logging import get_logger

logger = get_logger(__name__)

COORDINATOR_SYSTEM_PROMPT = """
You are the Master Coordinator Agent for CodeGuardian AI.
Your role is to orchestrate parallel specialized subagents:
- Repository Agent (inspects file layout & manifests)
- Architecture Agent (evaluates structural isolation & design patterns)
- Security Agent (performs SAST & secret leakage scanning)
- Database Agent (audits ORM models & migration integrity)
- Performance Agent (audits async event loops & memory leaks)
- Testing Agent (evaluates unit test coverage)
- Documentation Agent (verifies OpenAPI/Swagger & README compliance)

Ensure all agent state transitions are validated and synchronized.
"""

class CoordinatorAgent:
    """Master Coordinator Agent orchestrating parallel subagent execution."""

    @staticmethod
    async def run(state: AgentState) -> AgentState:
        logger.info("Master Coordinator Agent executing graph dispatch", repo_id=state.get("repository_id"))
        state["current_node"] = "Coordinator"
        completed = state.get("completed_nodes", [])
        if "Coordinator" not in completed:
            completed.append("Coordinator")
        state["completed_nodes"] = completed
        return state
