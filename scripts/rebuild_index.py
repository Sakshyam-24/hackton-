"""Index rebuilding script - full pipeline: ingest + embed + index."""

import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.core.config import get_settings
from app.core.logger import logger
from app.rag.ingestion import DocumentIngestion
from app.rag.vector_store import get_vector_store


def rebuild_index(
    source_dir: Path,
    recursive: bool = False,
) -> None:
    """Full rebuild: ingest documents, chunk, embed, and build index."""
    settings = get_settings()

    logger.info("=" * 60)
    logger.info("Starting full index rebuild")
    logger.info("=" * 60)

    ingestion = DocumentIngestion()

    logger.info("\n[1/3] Clearing existing index...")
    vector_store = get_vector_store()
    vector_store.index = type(vector_store.index)(vector_store.dimension)
    vector_store.chunk_ids = []
    vector_store.chunk_metadata = []

    logger.info("\n[2/3] Ingesting documents...")
    pattern = "**/*" if recursive else "*"
    total_chunks = 0

    for ext in settings.ALLOWED_EXTENSIONS:
        for filepath in source_dir.glob(f"{pattern}{ext}"):
            logger.info(f"  Processing: {filepath.name}")
            result = asyncio.run(
                ingestion.ingest_file(file_path=str(filepath))
            )
            if result["status"] == "success":
                total_chunks += result["chunks_created"]
                logger.info(f"    -> {result['chunks_created']} chunks")
            else:
                logger.warning(f"    -> {result['message']}")

    logger.info(f"\n[3/3] Index built with {total_chunks} chunks")

    logger.info("\n" + "=" * 60)
    logger.info("Index rebuild complete!")
    logger.info(f"  Total chunks indexed: {vector_store.size}")
    logger.info(f"  Index location: {settings.FAISS_INDEX_PATH}")
    logger.info("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="Full index rebuild pipeline")
    parser.add_argument(
        "--source-dir",
        type=Path,
        default=Path("./data/raw"),
        help="Source directory with documents (default: ./data/raw)",
    )
    parser.add_argument(
        "--recursive", "-r",
        action="store_true",
        help="Recursively process subdirectories",
    )
    args = parser.parse_args()

    if not args.source_dir.exists():
        logger.error(f"Source directory does not exist: {args.source_dir}")
        sys.exit(1)

    rebuild_index(args.source_dir, args.recursive)


if __name__ == "__main__":
    main()
