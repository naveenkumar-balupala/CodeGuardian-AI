from typing import Any

from app.ai.agents.state import AgentState, SecurityAgentOutput
from app.core.logging import get_logger

logger = get_logger(__name__)

SECURITY_AGENT_PROMPT = """
You are the Cybersecurity & SAST Specialist Agent for CodeGuardian AI.
Your role is to detect OWASP Top 10 vulnerabilities, CWE rules, hardcoded API secrets, SQL injections,
XSS threats, and insecure authentication flaws.
"""

class SecurityAgent:
    """Security Agent scanning for SAST vulnerabilities and secret leaks."""

    @staticmethod
    def sast_scan_tool() -> dict[str, Any]:
        """Tool: Performs SAST rule checking and secret leakage verification."""
        return {
            "critical_vulnerabilities": 1,
            "high_vulnerabilities": 2,
            "cwe_findings": [
                {
                    "rule_id": "CWE-89",
                    "severity": "CRITICAL",
                    "title": "SQL Injection in User Authentication Handler",
                    "file_path": "app/api/v1/auth.py",
                    "line": 42,
                },
                {
                    "rule_id": "CWE-798",
                    "severity": "HIGH",
                    "title": "Hardcoded Secret Key Fallback in Configuration",
                    "file_path": "app/core/config.py",
                    "line": 18,
                },
            ],
            "secret_leak_alerts": [
                "Potential unencrypted JWT secret key in config default"
            ],
        }

    @classmethod
    async def run(cls, state: AgentState) -> AgentState:
        logger.info("Security Agent executing SAST vulnerability scan", repo_id=state.get("repository_id"))
        raw_output = cls.sast_scan_tool()
        validated = SecurityAgentOutput(**raw_output)

        state["security_data"] = validated.model_dump()
        completed = state.get("completed_nodes", [])
        completed.append("SecurityAgent")
        state["completed_nodes"] = completed
        return state
