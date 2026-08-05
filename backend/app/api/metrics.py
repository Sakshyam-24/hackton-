"""Metrics and analytics endpoint."""

from datetime import datetime, timezone

from fastapi import APIRouter, Request

from app.core.logger import logger

router = APIRouter(prefix="/metrics", tags=["Metrics"])

# In-memory analytics counters
_metrics = {
    "requests": 0,
    "chat_queries": 0,
    "search_queries": 0,
    "documents_uploaded": 0,
    "errors": 0,
    "categories": {},
    "languages": {},
    "started_at": None,
}


def record_request(path: str) -> None:
    _metrics["requests"] += 1
    if _metrics["started_at"] is None:
        _metrics["started_at"] = datetime.now(timezone.utc).isoformat()
    if path.startswith("/api/v1/chat"):
        _metrics["chat_queries"] += 1
    elif path.startswith("/api/v1/search"):
        _metrics["search_queries"] += 1
    elif path.startswith("/api/v1/upload"):
        _metrics["documents_uploaded"] += 1


def record_category(category: str) -> None:
    if category:
        _metrics["categories"][category] = _metrics["categories"].get(category, 0) + 1


def record_language(language: str) -> None:
    key = (language or "en").lower()
    _metrics["languages"][key] = _metrics["languages"].get(key, 0) + 1


def record_error() -> None:
    _metrics["errors"] += 1


def reset_metrics() -> None:
    _metrics["requests"] = 0
    _metrics["chat_queries"] = 0
    _metrics["search_queries"] = 0
    _metrics["documents_uploaded"] = 0
    _metrics["errors"] = 0
    _metrics["categories"] = {}
    _metrics["languages"] = {}
    _metrics["started_at"] = None


@router.get(
    "",
    summary="Get platform metrics",
    description="Return usage metrics and analytics counters for the platform.",
)
async def get_metrics(request: Request):
    total = _metrics["requests"]
    return {
        "service": "legal-advisor-ai",
        "host": request.url.hostname,
        "metrics": _metrics,
        "summary": {
            "total_requests": total,
            "error_rate": round(_metrics["errors"] / total, 4) if total else 0.0,
            "chat_share": round(_metrics["chat_queries"] / total, 4) if total else 0.0,
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
