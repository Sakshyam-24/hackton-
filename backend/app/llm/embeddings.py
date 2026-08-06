"""Embedding generation for document indexing and retrieval."""

import hashlib
import struct
import time
from typing import Optional

import numpy as np

from app.core.config import get_settings
from app.core.logger import logger


class EmbeddingGenerator:
    """Generate embeddings using Gemini, OpenAI, or a local fallback."""

    def __init__(self):
        settings = get_settings()
        self.gemini_api_key = settings.GEMINI_API_KEY
        self.gemini_model = settings.GEMINI_EMBEDDING_MODEL
        self.openai_api_key = settings.OPENAI_API_KEY
        self.openai_model = settings.OPENAI_EMBEDDING_MODEL
        self.embedding_provider = settings.EMBEDDING_PROVIDER
        self._openai_client = None
        self._gemini_client = None

    @property
    def openai_client(self):
        if self._openai_client is None and self.openai_api_key:
            from openai import AsyncOpenAI
            self._openai_client = AsyncOpenAI(api_key=self.openai_api_key)
        return self._openai_client

    def _get_gemini_client(self):
        if self._gemini_client is None and self.gemini_api_key:
            try:
                from google import genai
                self._gemini_client = genai.Client(api_key=self.gemini_api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}")
        return self._gemini_client

    def _gemini_embed_with_retry(self, texts: list[str], max_retries: int = 3) -> Optional[list[list[float]]]:
        """Call Gemini embedding API with retry logic for rate limits."""
        client = self._get_gemini_client()
        if not client:
            return None

        for attempt in range(max_retries):
            try:
                result = client.models.embed_content(
                    model=self.gemini_model,
                    contents=texts,
                )
                return [e.values for e in result.embeddings]
            except Exception as e:
                error_str = str(e)
                if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                    wait_time = min(2 ** attempt * 5, 30)
                    logger.warning(f"Gemini rate limit, waiting {wait_time}s (attempt {attempt + 1}/{max_retries})")
                    time.sleep(wait_time)
                else:
                    logger.error(f"Gemini embedding failed: {e}")
                    return None
        return None

    async def generate_embedding(self, text: str) -> list[float]:
        """Generate embedding for a single text."""
        # Try Gemini first
        if self.embedding_provider == "gemini":
            client = self._get_gemini_client()
            if client:
                try:
                    result = client.models.embed_content(
                        model=self.gemini_model,
                        contents=text,
                    )
                    return result.embeddings[0].values
                except Exception as e:
                    logger.error(f"Gemini embedding failed, trying fallback: {e}")

        # Try OpenAI
        if self.embedding_provider == "openai" and self.openai_api_key and self.openai_client:
            try:
                response = await self.openai_client.embeddings.create(
                    model=self.openai_model,
                    input=text,
                )
                return response.data[0].embedding
            except Exception as e:
                logger.error(f"OpenAI embedding failed, using fallback: {e}")

        return self._local_embedding(text)

    async def generate_embeddings(self, texts: list[str], batch_size: int = 20) -> list[list[float]]:
        """Generate embeddings for multiple texts with batching."""
        # Local mode - skip API calls entirely
        if self.embedding_provider == "local":
            return [self._local_embedding(text) for text in texts]

        # Try Gemini batch with retry
        if self.embedding_provider == "gemini" and self.gemini_api_key:
            all_embeddings = []
            for i in range(0, len(texts), batch_size):
                batch = texts[i : i + batch_size]
                batch_embeddings = self._gemini_embed_with_retry(batch)
                if batch_embeddings:
                    all_embeddings.extend(batch_embeddings)
                else:
                    logger.warning(f"Gemini failed for batch at {i}, using local fallback")
                    all_embeddings.extend([self._local_embedding(t) for t in batch])
                if i + batch_size < len(texts):
                    time.sleep(2)
            return all_embeddings

        # Try OpenAI batch
        if self.embedding_provider == "openai" and self.openai_api_key and self.openai_client:
            try:
                all_embeddings = []
                for i in range(0, len(texts), batch_size):
                    batch = texts[i : i + batch_size]
                    response = await self.openai_client.embeddings.create(
                        model=self.openai_model,
                        input=batch,
                    )
                    batch_embeddings = [item.embedding for item in response.data]
                    all_embeddings.extend(batch_embeddings)
                return all_embeddings
            except Exception as e:
                logger.error(f"OpenAI batch embedding failed, using fallback: {e}")

        return [self._local_embedding(text) for text in texts]

    def _local_embedding(self, text: str) -> list[float]:
        """Generate a deterministic local embedding using hashing.
        This is a fallback when no API key is available.
        It produces consistent vectors for the same text, enabling basic search."""
        dimension = 3072
        vector = np.zeros(dimension, dtype=np.float32)

        for i in range(dimension):
            seed = f"{text}_{i}".encode()
            hash_bytes = hashlib.sha256(seed).digest()
            raw = int.from_bytes(hash_bytes[:4], byteorder="big", signed=True)
            vector[i] = raw / 2147483647.0

        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = vector / norm

        return vector.tolist()

    def compute_similarity(self, embedding1: list[float], embedding2: list[float]) -> float:
        """Compute cosine similarity between two embeddings."""
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)
        similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2) or 1)
        return float(similarity)


_embedding_generator: Optional[EmbeddingGenerator] = None


def get_embedding_generator() -> EmbeddingGenerator:
    """Get or create the embedding generator singleton."""
    global _embedding_generator
    if _embedding_generator is None:
        _embedding_generator = EmbeddingGenerator()
    return _embedding_generator
