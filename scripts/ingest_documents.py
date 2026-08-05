"""Document ingestion script for the Legal Advisor AI RAG pipeline."""

import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.core.config import get_settings
from app.core.logger import logger
from app.rag.ingestion import DocumentIngestion


def ingest_file(
    ingestion: DocumentIngestion,
    filepath: Path,
    title: str = None,
    legal_category: str = None,
) -> dict:
    """Ingest a single file."""
    logger.info(f"Processing: {filepath.name}")

    result = asyncio.run(
        ingestion.ingest_file(
            file_path=str(filepath),
            title=title,
            legal_category=legal_category,
        )
    )

    if result["status"] == "success":
        logger.info(f"  -> {result['chunks_created']} chunks created")
    else:
        logger.warning(f"  -> {result['message']}")

    return result


def ingest_directory(
    ingestion: DocumentIngestion,
    directory: Path,
    recursive: bool = False,
) -> list[dict]:
    """Ingest all supported files from a directory."""
    settings = get_settings()
    results = []
    pattern = "**/*" if recursive else "*"

    for ext in settings.ALLOWED_EXTENSIONS:
        for filepath in directory.glob(f"{pattern}{ext}"):
            result = ingest_file(ingestion, filepath)
            results.append(result)

    return results


def main():
    parser = argparse.ArgumentParser(description="Ingest documents into the RAG pipeline")
    parser.add_argument(
        "path",
        type=Path,
        help="Path to a file or directory to ingest",
    )
    parser.add_argument(
        "--recursive", "-r",
        action="store_true",
        help="Recursively process subdirectories",
    )
    parser.add_argument(
        "--title",
        type=str,
        default=None,
        help="Document title (for single files)",
    )
    parser.add_argument(
        "--category",
        type=str,
        default=None,
        help="Legal category",
    )
    args = parser.parse_args()

    if not args.path.exists():
        logger.error(f"Path does not exist: {args.path}")
        sys.exit(1)

    ingestion = DocumentIngestion()

    if args.path.is_file():
        result = ingest_file(ingestion, args.path, args.title, args.category)
        results = [result]
    else:
        results = ingest_directory(ingestion, args.path, args.recursive)

    total_chunks = sum(r.get("chunks_created", 0) for r in results)
    successful = sum(1 for r in results if r.get("status") == "success")

    logger.info(f"\nIngestion complete: {successful}/{len(results)} files, {total_chunks} total chunks")


if __name__ == "__main__":
    main()
