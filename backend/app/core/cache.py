"""Simple TTL cache with optional Redis backend.

Provides a drop-in cache interface. If ``REDIS_URL`` is set, the Redis backend
is used; otherwise a thread-safe in-memory TTL cache is used. Both implement
``get`` / ``set`` / ``delete`` / ``clear``.
"""

import time
import threading
from typing import Any, Optional

from app.core.config import get_settings
from app.core.logger import logger


class InMemoryCache:
    """Thread-safe in-memory TTL cache."""

    def __init__(self, default_ttl: int = 300):
        self.default_ttl = default_ttl
        self._store: dict[str, tuple[float, Any]] = {}
        self._lock = threading.Lock()

    def get(self, key: str, default: Any = None) -> Any:
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return default
            expires_at, value = entry
            if expires_at < time.time():
                del self._store[key]
                return default
            return value

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        expires_at = time.time() + (ttl or self.default_ttl)
        with self._lock:
            self._store[key] = (expires_at, value)

    def delete(self, key: str) -> None:
        with self._lock:
            self._store.pop(key, None)

    def clear(self) -> None:
        with self._lock:
            self._store.clear()

    def prune(self) -> None:
        now = time.time()
        with self._lock:
            stale = [k for k, (exp, _) in self._store.items() if exp < now]
            for k in stale:
                del self._store[k]


class RedisCache:
    """Redis-backed cache (lazy connection)."""

    def __init__(self, url: str, default_ttl: int = 300):
        self.url = url
        self.default_ttl = default_ttl
        self._redis: Any = None
        self._lock = threading.Lock()

    def _get_redis(self) -> Any:
        if self._redis is None:
            with self._lock:
                if self._redis is None:
                    import redis as redis_lib  # type: ignore

                    self._redis = redis_lib.from_url(self.url, decode_responses=True)
        return self._redis

    def get(self, key: str, default: Any = None) -> Any:
        try:
            value = self._get_redis().get(key)
            return value if value is not None else default
        except Exception as e:
            logger.warning(f"Redis get failed, using default: {e}")
            return default

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        try:
            self._get_redis().set(key, value, ex=ttl or self.default_ttl)
        except Exception as e:
            logger.warning(f"Redis set failed: {e}")

    def delete(self, key: str) -> None:
        try:
            self._get_redis().delete(key)
        except Exception as e:
            logger.warning(f"Redis delete failed: {e}")

    def clear(self) -> None:
        try:
            self._get_redis().flushdb()
        except Exception as e:
            logger.warning(f"Redis clear failed: {e}")


_cache: Optional[Any] = None


def get_cache() -> Any:
    """Return the application cache instance (singleton)."""
    global _cache
    if _cache is None:
        settings = get_settings()
        if settings.REDIS_URL:
            try:
                _cache = RedisCache(settings.REDIS_URL, settings.CACHE_TTL_SECONDS)
            except Exception as e:
                logger.warning(f"Failed to init Redis cache, using in-memory: {e}")
                _cache = InMemoryCache(settings.CACHE_TTL_SECONDS)
        else:
            _cache = InMemoryCache(settings.CACHE_TTL_SECONDS)
    return _cache


def cache_get_or_set(
    key: str,
    builder: callable,
    ttl: Optional[int] = None,
    default: Any = None,
) -> Any:
    """Return cached value or compute, cache, and return it."""
    settings = get_settings()
    if not settings.CACHE_ENABLED:
        return builder()

    cache = get_cache()
    value = cache.get(key, default=None)
    if value is not None:
        return value
    value = builder()
    cache.set(key, value, ttl=ttl)
    return value
