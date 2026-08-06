"""Embedding creation script for building FAISS vector index."""

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.core.config import get_settings
from app.core.logger import logger
from app.llm.embeddings import get_embedding_generator
from app.rag.vector_store import get_vector_store


def create_embeddings_from_metadata(
    metadata_path: Path,
    output_prefix: str = "legal_advisor",
) -> None:
    """Create embeddings from pre-processed metadata and build FAISS index."""
    if not metadata_path.exists():
        logger.error(f"Metadata file not found: {metadata_path}")
        sys.exit(1)

    with open(metadata_path, "r") as f:
        metadata = json.load(f)

    chunk_texts = [item["content"] for item in metadata.get("chunks", [])]
    chunk_ids = [item["chunk_id"] for item in metadata.get("chunks", [])]
    chunk_metadata = [item.get("metadata", {}) for item in metadata.get("chunks", [])]

    if not chunk_texts:
        logger.error("No chunks found in metadata file")
        sys.exit(1)

    logger.info(f"Generating embeddings for {len(chunk_texts)} chunks...")
    embedding_generator = get_embedding_generator()

    embeddings = asyncio.run(
        embedding_generator.generate_embeddings(chunk_texts)
    )

    logger.info("Building FAISS index...")
    vector_store = get_vector_store()
    vector_store.add_vectors(embeddings, chunk_ids, chunk_metadata)
    vector_store.save(prefix=output_prefix)

    logger.info(f"Index saved with {vector_store.size} vectors")


def main():
    parser = argparse.ArgumentParser(description="Create embeddings and build FAISS index")
    parser.add_argument(
        "--metadata-path",
        type=Path,
        default=Path("./data/processed/chunks_metadata.json"),
        help="Path to chunks metadata JSON file",
    )
    parser.add_argument(
        "--output-prefix",
        type=str,
        default="legal_advisor",
        help="Output prefix for index files",
    )
    args = parser.parse_args()

    import asyncio
    create_embeddings_from_metadata(args.metadata_path, args.output_prefix)


if __name__ == "__main__":
    main()
