"""Embedding generation for document indexing and retrieval."""

import hashlib
import struct
from typing import Optional

import numpy as np

from app.core.config import get_settings
from app.core.logger import logger


class EmbeddingGenerator:
    """Generate embeddings using OpenAI or a local fallback."""

    def __init__(self):
        settings = get_settings()
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_EMBEDDING_MODEL
        self._client = None

    @property
    def client(self):
        if self._client is None and self.api_key:
            from openai import AsyncOpenAI
            self._client = AsyncOpenAI(api_key=self.api_key)
        return self._client

    async def generate_embedding(self, text: str) -> list[float]:
        """Generate embedding for a single text."""
        if self.api_key and self.client:
            try:
                response = await self.client.embeddings.create(
                    model=self.model,
                    input=text,
                )
                return response.data[0].embedding
            except Exception as e:
                logger.error(f"OpenAI embedding failed, using fallback: {e}")

        return self._local_embedding(text)

    async def generate_embeddings(self, texts: list[str], batch_size: int = 100) -> list[list[float]]:
        """Generate embeddings for multiple texts with batching."""
        if self.api_key and self.client:
            try:
                all_embeddings = []
                for i in range(0, len(texts), batch_size):
                    batch = texts[i : i + batch_size]
                    response = await self.client.embeddings.create(
                        model=self.model,
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
        dimension = 1536
        vector = np.zeros(dimension, dtype=np.float32)

        # Use multiple hash functions for better distribution
        for i in range(dimension):
            seed = f"{text}_{i}".encode()
            hash_bytes = hashlib.sha256(seed).digest()
            # Convert 4 bytes to float
            val = struct.unpack("f", hash_bytes[:4])[0]
            vector[i] = val

        # Normalize
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
