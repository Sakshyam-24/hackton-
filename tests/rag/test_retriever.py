"""Tests for the VectorStore."""

import json
import sys
import tempfile
from pathlib import Path
from unittest.mock import patch

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "backend"))

from app.rag.vector_store import VectorStore


@pytest.fixture
def vector_store():
    """Create a VectorStore with dimension 128 for testing."""
    with tempfile.TemporaryDirectory() as tmpdir:
        with patch("app.rag.vector_store.get_settings") as mock_settings:
            mock_settings.return_value.FAISS_INDEX_PATH = tmpdir
            store = VectorStore(dimension=128)
            yield store


@pytest.fixture
def sample_embeddings():
    """Create sample embeddings for testing."""
    np.random.seed(42)
    return np.random.rand(5, 128).astype(np.float32).tolist()


@pytest.fixture
def sample_ids():
    """Create sample chunk IDs."""
    return [f"chunk_{i}" for i in range(5)]


@pytest.fixture
def sample_metadata():
    """Create sample metadata."""
    return [
        {"content": f"Content {i}", "document_id": f"doc_{i % 2}"}
        for i in range(5)
    ]


class TestVectorStoreInit:
    """Tests for VectorStore initialization."""

    def test_default_dimension(self):
        """VectorStore initializes with correct dimension."""
        with tempfile.TemporaryDirectory() as tmpdir:
            with patch("app.rag.vector_store.get_settings") as mock_settings:
                mock_settings.return_value.FAISS_INDEX_PATH = tmpdir
                store = VectorStore(dimension=128)
                assert store.dimension == 128

    def test_empty_index_initially(self, vector_store):
        """Index starts empty."""
        assert vector_store.size == 0
        assert len(vector_store.chunk_ids) == 0

    def test_empty_chunk_ids_initially(self, vector_store):
        """Chunk IDs list starts empty."""
        assert vector_store.chunk_ids == []

    def test_empty_metadata_initially(self, vector_store):
        """Chunk metadata list starts empty."""
        assert vector_store.chunk_metadata == []


class TestAddVectors:
    """Tests for add_vectors method."""

    def test_add_vectors(self, vector_store, sample_embeddings, sample_ids):
        """Adding vectors increases index size."""
        count = vector_store.add_vectors(sample_embeddings, sample_ids)
        assert count == 5
        assert vector_store.size == 5

    def test_add_vectors_updates_ids(self, vector_store, sample_embeddings, sample_ids):
        """Adding vectors stores chunk IDs."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        assert vector_store.chunk_ids == sample_ids

    def test_add_vectors_with_metadata(self, vector_store, sample_embeddings, sample_ids, sample_metadata):
        """Adding vectors stores metadata."""
        vector_store.add_vectors(sample_embeddings, sample_ids, sample_metadata)
        assert len(vector_store.chunk_metadata) == 5
        assert vector_store.chunk_metadata[0]["content"] == "Content 0"

    def test_add_empty_vectors(self, vector_store):
        """Adding empty list returns 0."""
        count = vector_store.add_vectors([], [])
        assert count == 0

    def test_add_vectors_returns_count(self, vector_store, sample_embeddings, sample_ids):
        """Add returns the number of vectors added."""
        count = vector_store.add_vectors(sample_embeddings[:3], sample_ids[:3])
        assert count == 3


class TestSearch:
    """Tests for search method."""

    def test_search_returns_results(self, vector_store, sample_embeddings, sample_ids):
        """Search returns results after adding vectors."""
        vector_store.add_vectors(sample_embeddings, sample_ids)

        query = sample_embeddings[0]
        results = vector_store.search(query, top_k=3)
        assert len(results) > 0
        assert len(results) <= 3

    def test_search_returns_chunk_id(self, vector_store, sample_embeddings, sample_ids):
        """Search results contain chunk_id."""
        vector_store.add_vectors(sample_embeddings, sample_ids)

        query = sample_embeddings[0]
        results = vector_store.search(query, top_k=1)
        assert "chunk_id" in results[0]
        assert results[0]["chunk_id"] in sample_ids

    def test_search_returns_distance(self, vector_store, sample_embeddings, sample_ids):
        """Search results contain distance."""
        vector_store.add_vectors(sample_embeddings, sample_ids)

        query = sample_embeddings[0]
        results = vector_store.search(query, top_k=1)
        assert "distance" in results[0]
        assert isinstance(results[0]["distance"], float)

    def test_search_returns_score(self, vector_store, sample_embeddings, sample_ids):
        """Search results contain score."""
        vector_store.add_vectors(sample_embeddings, sample_ids)

        query = sample_embeddings[0]
        results = vector_store.search(query, top_k=1)
        assert "score" in results[0]
        assert 0 <= results[0]["score"] <= 1

    def test_search_returns_metadata(self, vector_store, sample_embeddings, sample_ids, sample_metadata):
        """Search results contain metadata."""
        vector_store.add_vectors(sample_embeddings, sample_ids, sample_metadata)

        query = sample_embeddings[0]
        results = vector_store.search(query, top_k=1)
        assert "metadata" in results[0]

    def test_search_empty_index(self, vector_store):
        """Search on empty index returns empty list."""
        query = [0.0] * 128
        results = vector_store.search(query, top_k=5)
        assert results == []

    def test_search_top_k_limits_results(self, vector_store, sample_embeddings, sample_ids):
        """Search respects top_k parameter."""
        vector_store.add_vectors(sample_embeddings, sample_ids)

        query = sample_embeddings[0]
        results = vector_store.search(query, top_k=2)
        assert len(results) <= 2

    def test_search_same_query_returns_highest_score(self, vector_store, sample_embeddings, sample_ids):
        """Searching for an indexed vector returns it with highest score."""
        vector_store.add_vectors(sample_embeddings, sample_ids)

        query = sample_embeddings[0]
        results = vector_store.search(query, top_k=5)
        assert results[0]["chunk_id"] == sample_ids[0]


class TestDeleteVectors:
    """Tests for delete_vectors method."""

    def test_delete_vectors(self, vector_store, sample_embeddings, sample_ids):
        """Deleting vectors reduces index size."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        deleted = vector_store.delete_vectors(["chunk_0", "chunk_1"])
        assert deleted == 2
        assert vector_store.size == 3

    def test_delete_vectors_updates_ids(self, vector_store, sample_embeddings, sample_ids):
        """Deleting vectors removes IDs."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        vector_store.delete_vectors(["chunk_0"])
        assert "chunk_0" not in vector_store.chunk_ids

    def test_delete_nonexistent_returns_zero(self, vector_store, sample_embeddings, sample_ids):
        """Deleting non-existent IDs returns 0."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        deleted = vector_store.delete_vectors(["nonexistent"])
        assert deleted == 0

    def test_delete_all_vectors(self, vector_store, sample_embeddings, sample_ids):
        """Deleting all vectors empties the index."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        deleted = vector_store.delete_vectors(sample_ids)
        assert deleted == 5
        assert vector_store.size == 0
        assert vector_store.chunk_ids == []


class TestSaveAndLoad:
    """Tests for save and load methods."""

    def test_save_creates_files(self, vector_store, sample_embeddings, sample_ids):
        """Saving creates index and metadata files."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        vector_store.save()

        index_file = vector_store.index_path / "legal_advisor.index"
        metadata_file = vector_store.index_path / "legal_advisor_metadata.json"
        assert index_file.exists()
        assert metadata_file.exists()

    def test_load_restores_index(self, vector_store, sample_embeddings, sample_ids):
        """Loading restores the index."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        vector_store.save()

        new_store = VectorStore(dimension=128)
        new_store.index_path = vector_store.index_path
        result = new_store.load()

        assert result is True
        assert new_store.size == 5
        assert new_store.chunk_ids == sample_ids

    def test_load_restores_metadata(self, vector_store, sample_embeddings, sample_ids, sample_metadata):
        """Loading restores metadata."""
        vector_store.add_vectors(sample_embeddings, sample_ids, sample_metadata)
        vector_store.save()

        new_store = VectorStore(dimension=128)
        new_store.index_path = vector_store.index_path
        new_store.load()

        assert len(new_store.chunk_metadata) == 5
        assert new_store.chunk_metadata[0]["content"] == "Content 0"

    def test_load_nonexistent_returns_false(self, vector_store):
        """Loading from empty path returns False."""
        result = vector_store.load()
        assert result is False

    def test_save_custom_prefix(self, vector_store, sample_embeddings, sample_ids):
        """Saving with custom prefix creates named files."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        vector_store.save(prefix="custom")

        index_file = vector_store.index_path / "custom.index"
        metadata_file = vector_store.index_path / "custom_metadata.json"
        assert index_file.exists()
        assert metadata_file.exists()

    def test_load_custom_prefix(self, vector_store, sample_embeddings, sample_ids):
        """Loading with custom prefix restores correct data."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        vector_store.save(prefix="test")

        new_store = VectorStore(dimension=128)
        new_store.index_path = vector_store.index_path
        result = new_store.load(prefix="test")

        assert result is True
        assert new_store.size == 5


class TestSize:
    """Tests for size property."""

    def test_size_empty(self, vector_store):
        """Size is 0 for empty index."""
        assert vector_store.size == 0

    def test_size_after_add(self, vector_store, sample_embeddings, sample_ids):
        """Size reflects number of vectors."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        assert vector_store.size == 5

    def test_size_after_delete(self, vector_store, sample_embeddings, sample_ids):
        """Size updates after deletion."""
        vector_store.add_vectors(sample_embeddings, sample_ids)
        vector_store.delete_vectors(["chunk_0"])
        assert vector_store.size == 4
