"""
Build Knowledge Base — Main script for ingesting legal documents into the RAG pipeline.

Usage:
    python scripts/build_knowledge_base.py                          # Ingest all PDFs from data/raw
    python scripts/build_knowledge_base.py --file path/to/doc.pdf   # Ingest a single file
    python scripts/build_knowledge_base.py --category labour_rights  # Tag with category
    python scripts/build_knowledge_base.py --fresh                   # Clear existing index first
"""

import argparse
import asyncio
import json
import shutil
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.core.config import get_settings
from app.core.logger import logger
from app.rag.ingestion import DocumentIngestion


RAW_DIR = Path(__file__).resolve().parent.parent / "backend" / "data" / "raw"
PROCESSED_DIR = Path(__file__).resolve().parent.parent / "backend" / "data" / "processed"


def ensure_dirs():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


def clear_index():
    settings = get_settings()
    index_path = Path(settings.FAISS_INDEX_PATH)
    if index_path.exists():
        for f in index_path.glob("*"):
            f.unlink()
        logger.info(f"Cleared index at {index_path}")


def ingest_single(ingestion: DocumentIngestion, filepath: Path, title: str = None, category: str = None) -> dict:
    logger.info(f"Processing: {filepath.name}")
    start = time.time()

    result = asyncio.run(
        ingestion.ingest_file(
            file_path=str(filepath),
            title=title,
            legal_category=category,
        )
    )

    elapsed = time.time() - start
    if result["status"] == "success":
        logger.info(f"  -> {result['chunks_created']} chunks created in {elapsed:.1f}s")
    else:
        logger.warning(f"  -> Failed: {result['message']}")

    result["processing_time"] = elapsed
    return result


def save_processed_chunks(results: list[dict]):
    output = PROCESSED_DIR / "chunks.json"
    with open(output, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    logger.info(f"Saved processing results to {output}")


def main():
    parser = argparse.ArgumentParser(description="Build the legal knowledge base")
    parser.add_argument("--file", "-f", type=Path, help="Ingest a single file")
    parser.add_argument("--category", "-c", type=str, default="labour_rights", help="Legal category tag")
    parser.add_argument("--title", "-t", type=str, help="Document title")
    parser.add_argument("--recursive", "-r", action="store_true", help="Scan subdirectories")
    parser.add_argument("--fresh", action="store_true", help="Clear existing index before ingesting")
    args = parser.parse_args()

    ensure_dirs()

    if args.fresh:
        clear_index()

    ingestion = DocumentIngestion()
    results = []

    if args.file:
        if not args.file.exists():
            logger.error(f"File not found: {args.file}")
            sys.exit(1)
        result = ingest_single(ingestion, args.file, args.title, args.category)
        results.append(result)
    else:
        pattern = "**/*.pdf" if args.recursive else "*.pdf"
        pdf_files = sorted(RAW_DIR.glob(pattern))

        if not pdf_files:
            logger.warning(f"No PDF files found in {RAW_DIR}")
            logger.info("Place your legal document PDFs in: backend/data/raw/")
            sys.exit(0)

        logger.info(f"Found {len(pdf_files)} PDF(s) in {RAW_DIR}")
        logger.info(f"Category: {args.category}")
        logger.info("-" * 60)

        for pdf in pdf_files:
            result = ingest_single(ingestion, pdf, category=args.category)
            results.append(result)

    # Summary
    total_chunks = sum(r.get("chunks_created", 0) for r in results)
    successful = sum(1 for r in results if r.get("status") == "success")
    total_time = sum(r.get("processing_time", 0) for r in results)

    logger.info("=" * 60)
    logger.info(f"COMPLETE: {successful}/{len(results)} files ingested")
    logger.info(f"Total chunks: {total_chunks}")
    logger.info(f"Total time: {total_time:.1f}s")
    logger.info("=" * 60)

    save_processed_chunks(results)


if __name__ == "__main__":
    main()
