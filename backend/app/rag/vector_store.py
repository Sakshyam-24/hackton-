"""Pure NumPy vector store for document retrieval (no FAISS DLL dependency)."""

import json
from pathlib import Path
from typing import Optional

import numpy as np

from app.core.config import get_settings
from app.core.logger import logger


class VectorStore:
    """NumPy-based vector store using cosine similarity."""

    def __init__(self, dimension: int = 1536):
        self.dimension = dimension
        self.vectors: Optional[np.ndarray] = None
        self.chunk_ids: list[str] = []
        self.chunk_metadata: list[dict] = []
        settings = get_settings()
        self.index_path = Path(settings.FAISS_INDEX_PATH)
        self.index_path.mkdir(parents=True, exist_ok=True)

    def add_vectors(
        self,
        embeddings: list[list[float]],
        chunk_ids: list[str],
        metadata: Optional[list[dict]] = None,
    ) -> int:
        if not embeddings:
            return 0

        vectors = np.array(embeddings, dtype=np.float32)
        norms = np.linalg.norm(vectors, axis=1, keepdims=True)
        norms[norms == 0] = 1
        vectors = vectors / norms

        if self.vectors is None:
            self.vectors = vectors
        else:
            self.vectors = np.vstack([self.vectors, vectors])

        self.chunk_ids.extend(chunk_ids)
        if metadata:
            self.chunk_metadata.extend(metadata)
        else:
            self.chunk_metadata.extend([{} for _ in chunk_ids])

        logger.info(f"Added {len(embeddings)} vectors. Total: {self.size}")
        return len(embeddings)

    def search(self, query_embedding: list[float], top_k: int = 5) -> list[dict]:
        if self.vectors is None or self.size == 0:
            return []

        query = np.array([query_embedding], dtype=np.float32)
        query = query / (np.linalg.norm(query) or 1)

        similarities = np.dot(self.vectors, query.T).flatten()
        top_indices = np.argsort(similarities)[::-1][:min(top_k, self.size)]

        results = []
        for idx in top_indices:
            results.append({
                "chunk_id": self.chunk_ids[idx],
                "distance": float(1.0 - similarities[idx]),
                "score": float(similarities[idx]),
                "metadata": self.chunk_metadata[idx] if idx < len(self.chunk_metadata) else {},
            })

        return results

    def delete_vectors(self, chunk_ids: list[str]) -> int:
        ids_to_keep = set(self.chunk_ids) - set(chunk_ids)
        deleted_count = len(self.chunk_ids) - len(ids_to_keep)

        if deleted_count == 0:
            return 0

        keep_indices = [i for i, cid in enumerate(self.chunk_ids) if cid in ids_to_keep]

        if keep_indices and self.vectors is not None:
            self.vectors = self.vectors[keep_indices]
            self.chunk_ids = [self.chunk_ids[i] for i in keep_indices]
            self.chunk_metadata = [self.chunk_metadata[i] for i in keep_indices]
        else:
            self.vectors = None
            self.chunk_ids = []
            self.chunk_metadata = []

        logger.info(f"Deleted {deleted_count} vectors. Remaining: {self.size}")
        return deleted_count

    def save(self, prefix: str = "legal_advisor") -> None:
        vectors_file = self.index_path / f"{prefix}.index"
        metadata_file = self.index_path / f"{prefix}_metadata.json"

        if self.vectors is not None:
            with open(str(vectors_file), "wb") as f:
                np.save(f, self.vectors)

        metadata = {
            "chunk_ids": self.chunk_ids,
            "chunk_metadata": self.chunk_metadata,
            "dimension": self.dimension,
        }
        with open(metadata_file, "w") as f:
            json.dump(metadata, f)

        logger.info(f"Saved index with {self.size} vectors to {self.index_path}")

    def load(self, prefix: str = "legal_advisor") -> bool:
        vectors_file = self.index_path / f"{prefix}.index"
        metadata_file = self.index_path / f"{prefix}_metadata.json"

        if not vectors_file.exists() or not metadata_file.exists():
            logger.warning("Index files not found. Starting with empty index.")
            return False

        try:
            with open(str(vectors_file), "rb") as f:
                self.vectors = np.load(f)

            with open(metadata_file, "r") as f:
                metadata = json.load(f)

            self.chunk_ids = metadata.get("chunk_ids", [])
            self.chunk_metadata = metadata.get("chunk_metadata", [])
            self.dimension = metadata.get("dimension", self.dimension)

            logger.info(f"Loaded index with {self.size} vectors")
            return True
        except Exception as e:
            logger.error(f"Failed to load index: {e}")
            return False

    @property
    def size(self) -> int:
        if self.vectors is None:
            return 0
        return len(self.vectors)


_vector_store: Optional[VectorStore] = None


def get_vector_store() -> VectorStore:
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStore()
        _vector_store.load()
    return _vector_store
