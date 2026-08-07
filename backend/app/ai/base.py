from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

class BaseLLMProvider(ABC):
    """Abstract interface contract for AI LLM provider adapters."""

    @abstractmethod
    async def generate_response(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        **kwargs: Any
    ) -> str:
        """Generate text completion from LLM."""
        pass

    @abstractmethod
    async def generate_structured_output(
        self,
        prompt: str,
        response_schema: Dict[str, Any],
        system_instruction: Optional[str] = None,
        **kwargs: Any
    ) -> Dict[str, Any]:
        """Generate structured JSON output validated against JSON schema."""
        pass
