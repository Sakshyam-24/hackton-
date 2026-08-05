"""Search API endpoint."""

from fastapi import APIRouter, HTTPException, status

from app.core.cache import get_cache
from app.core.config import get_settings
from app.core.logger import logger
from app.models.request import SearchRequest
from app.models.response import SearchResponse, ErrorResponse
from app.services.retrieval_service import get_retrieval_service
from app.api.metrics import record_request, record_error

router = APIRouter(prefix="/search", tags=["Search"])


@router.post(
    "",
    response_model=SearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Search documents",
    description="Search indexed legal documents using semantic search.",
    responses={
        400: {"model": ErrorResponse, "description": "Invalid query"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def search_documents(request: SearchRequest):
    """Search for relevant legal documents."""
    record_request("/api/v1/search")
    try:
        retrieval_service = get_retrieval_service()

        filters = {}
        if request.legal_category:
            filters["legal_category"] = request.legal_category

        settings = get_settings()
        cache = get_cache()
        cache_key = (
            f"search:{request.query.lower().strip()}:"
            f"{request.legal_category or 'all'}:{request.top_k}"
        )

        cached = cache.get(cache_key)
        if cached is not None and settings.CACHE_ENABLED:
            results = cached
        else:
            results = await retrieval_service.search_documents(
                query=request.query,
                top_k=request.top_k,
                filters=filters if filters else None,
            )
            if settings.CACHE_ENABLED:
                cache.set(cache_key, results)

        formatted_results = []
        for result in results:
            metadata = result.get("metadata", {})
            formatted_results.append({
                "content": metadata.get("content", ""),
                "document_title": metadata.get("document_title", ""),
                "document_type": metadata.get("document_type", ""),
                "score": result.get("score", 0.0),
                "chunk_id": result.get("chunk_id", ""),
                "legal_category": metadata.get("legal_category", ""),
            })

        return SearchResponse(
            results=formatted_results,
            total=len(formatted_results),
            query=request.query,
        )

    except Exception as e:
        record_error()
        logger.error(f"Search error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while searching documents",
        )
