from app.ai.agents.architecture import ArchitectureAgent
from app.ai.agents.coordinator import CoordinatorAgent
from app.ai.agents.database import DatabaseAgent
from app.ai.agents.documentation import DocumentationAgent
from app.ai.agents.performance import PerformanceAgent
from app.ai.agents.recommendation import RecommendationAgent
from app.ai.agents.report import ReportAgent
from app.ai.agents.repository import RepositoryAgent
from app.ai.agents.security import SecurityAgent
from app.ai.agents.state import AgentState
from app.ai.agents.testing import TestingAgent
from app.core.logging import get_logger

logger = get_logger(__name__)

class MultiAgentGraphEngine:
    """LangGraph Multi-Agent Orchestration Engine for CodeGuardian AI."""

    @staticmethod
    async def run_audit_workflow(repo_id: str, repo_full_name: str) -> AgentState:
        """Executes full multi-agent state graph pipeline."""
        logger.info("Initializing LangGraph Multi-Agent Audit Workflow", repo_id=repo_id)

        initial_state: AgentState = {
            "repository_id": repo_id,
            "repository_full_name": repo_full_name,
            "current_node": "START",
            "completed_nodes": [],
            "repository_data": None,
            "architecture_data": None,
            "security_data": None,
            "database_data": None,
            "performance_data": None,
            "testing_data": None,
            "documentation_data": None,
            "recommendations_data": None,
            "report_data": None,
            "user_query": None,
            "messages": [],
        }

        # Step 1: Coordinator Agent Node
        state = await CoordinatorAgent.run(initial_state)

        # Step 2: Parallel Subagent Execution Nodes
        state = await RepositoryAgent.run(state)
        state = await ArchitectureAgent.run(state)
        state = await SecurityAgent.run(state)
        state = await DatabaseAgent.run(state)
        state = await PerformanceAgent.run(state)
        state = await TestingAgent.run(state)
        state = await DocumentationAgent.run(state)

        # Step 3: Recommendation Agent Node
        state = await RecommendationAgent.run(state)

        # Step 4: Report Agent Node
        state = await ReportAgent.run(state)

        state["current_node"] = "COMPLETED"
        logger.info("LangGraph Multi-Agent Audit Workflow Completed Successfully", repo_id=repo_id)
        return state
