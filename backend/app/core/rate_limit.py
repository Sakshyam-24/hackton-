"""In-memory rate limiting middleware.

Provides a simple sliding-window / fixed-window rate limiter per client IP
with optional per-route limits. Uses an in-memory store; swap for Redis in
production by implementing the same interface.
"""

import time
import threading
from collections import defaultdict, deque
from typing import Callable, Deque, Dict, Optional, Tuple

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import get_settings
from app.core.logger import logger


class RateLimiter:
    """Sliding-window rate limiter keyed by (route, client_ip)."""

    def __init__(self, default_limit: int, default_window: float):
        self.default_limit = default_limit
        self.default_window = default_window
        self._hits: Dict[Tuple[str, str], Deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def is_allowed(
        self, key: str, limit: Optional[int] = None, window: Optional[float] = None
    ) -> Tuple[bool, int, int, float]:
        """Return (allowed, current_count, limit, retry_after_seconds)."""
        limit = limit or self.default_limit
        window = window or self.default_window
        now = time.monotonic()
        cutoff = now - window

        with self._lock:
            hits = self._hits[key]
            # Drop expired entries
            while hits and hits[0] < cutoff:
                hits.popleft()

            count = len(hits)
            if count >= limit:
                retry_after = max(0.0, window - (now - (hits[0] if hits else now)))
                return False, count, limit, retry_after

            hits.append(now)
            return True, count + 1, limit, 0.0

    def prune(self, max_age: float = 3600.0) -> None:
        """Remove stale buckets."""
        cutoff = time.monotonic() - max_age
        with self._lock:
            stale = [k for k, hits in self._hits.items() if not hits or hits[-1] < cutoff]
            for k in stale:
                del self._hits[k]

    def clear(self) -> None:
        with self._lock:
            self._hits.clear()


_limiter: Optional[RateLimiter] = None


def get_limiter() -> RateLimiter:
    global _limiter
    if _limiter is None:
        settings = get_settings()
        _limiter = RateLimiter(
            default_limit=settings.RATE_LIMIT_DEFAULT,
            default_window=settings.RATE_LIMIT_WINDOW_SECONDS,
        )
    return _limiter


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Apply rate limiting to all requests."""

    def __init__(
        self,
        app,
        default_limit: Optional[int] = None,
        default_window: Optional[float] = None,
        exempt_paths: Optional[list] = None,
    ):
        super().__init__(app)
        self.limiter = get_limiter()
        if default_limit is not None:
            self.limiter.default_limit = default_limit
        if default_window is not None:
            self.limiter.default_window = default_window
        self.exempt_paths = set(exempt_paths or ["/", "/docs", "/redoc", "/openapi.json", "/api/v1/health"])

    def _client_key(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "unknown"
        return ip

    async def dispatch(self, request: Request, call_next: Callable):
        path = request.url.path
        if path in self.exempt_paths:
            return await call_next(request)

        # Stricter limits for LLM-heavy endpoints
        if path.startswith("/api/v1/chat") and request.method == "POST":
            limit = get_settings().RATE_LIMIT_CHAT
        elif path.startswith("/api/v1/search"):
            limit = get_settings().RATE_LIMIT_SEARCH
        elif path.startswith("/api/v1/upload"):
            limit = get_settings().RATE_LIMIT_UPLOAD
        else:
            limit = self.limiter.default_limit

        key = (path.split("/")[-1] or "root", self._client_key(request))
        allowed, count, lim, retry_after = self.limiter.is_allowed(
            key, limit=limit, window=get_settings().RATE_LIMIT_WINDOW_SECONDS
        )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(lim)
        response.headers["X-RateLimit-Remaining"] = str(max(0, lim - count))
        response.headers["X-RateLimit-Reset"] = str(int(time.time() + retry_after))

        if not allowed:
            response = JSONResponse(
                status_code=429,
                content={
                    "error": "Rate limit exceeded",
                    "detail": "Too many requests. Please slow down and try again.",
                    "code": "RATE_LIMIT_EXCEEDED",
                    "retry_after_seconds": retry_after,
                },
            )
            response.headers["Retry-After"] = str(max(1, int(retry_after)))
            response.headers["X-RateLimit-Limit"] = str(lim)
            response.headers["X-RateLimit-Remaining"] = "0"

        return response
