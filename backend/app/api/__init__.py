"""API module for route definitions."""

from app.api.chat import router as chat_router
from app.api.upload import router as upload_router
from app.api.search import router as search_router
from app.api.health import router as health_router

__all__ = [
    "chat_router",
    "upload_router",
    "search_router",
    "health_router",
]
