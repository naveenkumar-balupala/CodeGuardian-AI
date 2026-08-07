from pydantic import BaseModel
from app.core.config import settings

class AISettings(BaseModel):
    default_provider: str = settings.DEFAULT_LLM_PROVIDER
    default_model: str = settings.DEFAULT_LLM_MODEL
    temperature: float = 0.2
    max_tokens: int = 4096
    timeout_seconds: int = 60

ai_settings = AISettings()
