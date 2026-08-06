"""Configuration settings for the Legal Advisor AI."""

from functools import lru_cache
from pathlib import Path
from typing import Annotated, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    APP_NAME: str = "Legal Advisor AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    CORS_ORIGINS: Annotated[list[str], NoDecode] = ["http://localhost:3000", "http://localhost:5173"]

    DATABASE_URL: Optional[str] = None
    REDIS_URL: Optional[str] = None

    OPENAI_API_KEY: Optional[str] = None
    OPENAI_BASE_URL: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"

    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: str = "claude-sonnet-4-20250514"

    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GEMINI_EMBEDDING_MODEL: str = "models/gemini-embedding-001"
    EMBEDDING_DIMENSION: int = 3072

    LLM_PROVIDER: str = "gemini"
    EMBEDDING_PROVIDER: str = "local"  # "gemini", "openai", or "local"

    FAISS_INDEX_PATH: str = str(Path(__file__).resolve().parent.parent.parent.parent / "data" / "faiss_index")
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K_RETRIEVAL: int = 10
    TOP_K_RERANK: int = 5

    MAX_UPLOAD_SIZE_MB: int = 20
    ALLOWED_EXTENSIONS: Annotated[list[str], NoDecode] = [".pdf", ".docx", ".txt", ".md"]

    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/app.log"

    SECRET_KEY: str = "change-this-to-a-random-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    JWT_ALGORITHM: str = "HS256"

    # Rate limiting
    RATE_LIMIT_DEFAULT: int = 60
    RATE_LIMIT_CHAT: int = 20
    RATE_LIMIT_SEARCH: int = 30
    RATE_LIMIT_UPLOAD: int = 10
    RATE_LIMIT_WINDOW_SECONDS: float = 60.0

    # Caching
    CACHE_ENABLED: bool = True
    CACHE_TTL_SECONDS: int = 300

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }

    @field_validator("CORS_ORIGINS", "ALLOWED_EXTENSIONS", mode="before")
    @classmethod
    def parse_list(cls, v):
        """Accept comma-separated strings or lists."""
        if isinstance(v, str):
            return [item.strip() for item in v.split(",") if item.strip()]
        return v


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
