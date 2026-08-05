"""Health check API endpoint."""

from fastapi import APIRouter, status

from app.core.config import get_settings
from app.models.response import HealthResponse
from app.rag.vector_store import get_vector_store

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Check the health status of the API and its dependencies.",
)
async def health_check():
    """Check API health status."""
    settings = get_settings()
    services = {}

    services["api"] = "healthy"

    try:
        vector_store = get_vector_store()
        services["vector_store"] = "healthy" if vector_store.size >= 0 else "degraded"
        services["indexed_documents"] = str(vector_store.size)
    except Exception:
        services["vector_store"] = "unavailable"

    services["llm_provider"] = settings.LLM_PROVIDER
    services["openai_configured"] = "yes" if settings.OPENAI_API_KEY else "no"
    services["anthropic_configured"] = "yes" if settings.ANTHROPIC_API_KEY else "no"

    overall_status = "healthy"
    if services.get("vector_store") == "unavailable":
        overall_status = "degraded"

    return HealthResponse(
        status=overall_status,
        version=settings.APP_VERSION,
        services=services,
    )


@router.get(
    "/ready",
    status_code=status.HTTP_200_OK,
    summary="Readiness check",
)
async def readiness_check():
    """Check if the API is ready to serve requests."""
    return {"status": "ready"}
