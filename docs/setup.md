# Setup Instructions

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.11+ | Backend runtime |
| Node.js | 18+ | Frontend runtime |
| npm | 9+ | Frontend package manager |
| PostgreSQL | 16+ | Database (optional for dev) |
| Redis | 7+ | Cache (optional for dev) |

## Quick Start

### 1. Clone and navigate

```bash
cd legal-advisor-ai
```

### 2. Backend setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pydantic pydantic-settings openai anthropic faiss-cpu python-multipart PyMuPDF python-docx

# Create .env file
cat > .env << EOF
OPENAI_API_KEY=your-api-key-here
LLM_PROVIDER=openai
FAISS_INDEX_PATH=./data/faiss_index
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
EOF
```

### 3. Frontend setup

```bash
cd frontend

npm install
```

### 4. Start the application

**Terminal 1 - Backend:**

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The application is available at:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## Project Structure

```
legal-advisor-ai/
├── backend/
│   └── app/
│       ├── api/              # API route handlers
│       │   ├── chat.py       # Chat endpoints
│       │   └── upload.py     # Document upload
│       ├── core/
│       │   ├── config.py     # Settings management
│       │   └── logger.py     # Logging setup
│       ├── llm/
│       │   └── provider.py   # LLM provider abstraction
│       ├── models/
│       │   └── request.py    # Pydantic request models
│       ├── rag/
│       │   ├── chunker.py    # Document chunking
│       │   └── retriever.py  # FAISS vector retrieval
│       ├── services/
│       │   └── document_service.py  # Document processing
│       └── __init__.py
├── frontend/
│   ├── app/                  # Next.js pages
│   ├── components/           # React components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── services/             # API client layer
│   ├── styles/               # CSS/Tailwind
│   └── types/                # TypeScript types
├── scripts/
│   ├── ingest_documents.py   # Document ingestion
│   ├── create_embeddings.py  # Embedding creation
│   ├── rebuild_index.py      # Full index rebuild
│   └── evaluate_rag.py       # RAG evaluation
├── tests/
│   ├── backend/              # Backend tests
│   ├── frontend/             # Frontend tests
│   └── rag/                  # RAG pipeline tests
├── data/
│   ├── raw/                  # Uploaded files
│   ├── processed/            # Extracted text
│   └── embeddings/           # FAISS indices
└── docs/
    ├── architecture.md       # System design
    ├── api.md                # API reference
    └── setup.md              # This file
```

---

## RAG Pipeline Setup

### Ingest documents

```bash
# Ingest a single file
python scripts/ingest_documents.py path/to/document.pdf

# Ingest entire directory
python scripts/ingest_documents.py data/raw/ --recursive
```

### Create embeddings

```bash
python scripts/create_embeddings.py
```

### Full rebuild (ingest + embed)

```bash
python scripts/rebuild_index.py --source-dir data/raw/
```

### Evaluate retrieval quality

```bash
# First create test data in data/evaluation/test_queries.json
python scripts/evaluate_rag.py
```

---

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for LLM and embeddings |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `openai` | LLM provider: `openai` or `anthropic` |
| `ANTHROPIC_API_KEY` | — | Anthropic API key (if using Claude) |
| `OPENAI_MODEL` | `gpt-4o` | Chat completion model |
| `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-small` | Embedding model |
| `FAISS_INDEX_PATH` | `./data/faiss_index` | FAISS index storage path |
| `CHUNK_SIZE` | `1000` | Text chunk size in characters |
| `CHUNK_OVERLAP` | `200` | Overlap between chunks |
| `TOP_K_RETRIEVAL` | `10` | Candidates for initial retrieval |
| `TOP_K_RERANK` | `5` | Final results after reranking |
| `MAX_UPLOAD_SIZE_MB` | `20` | Maximum upload file size |
| `LOG_LEVEL` | `INFO` | Logging level |
| `SECRET_KEY` | — | JWT signing secret |

---

## Testing

### Backend tests

```bash
cd backend
pip install pytest pytest-asyncio httpx
pytest
```

### Frontend tests

```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
npm test
```

### RAG pipeline tests

```bash
cd tests/rag
pytest test_chunker.py test_retriever.py -v
```

---

## Troubleshooting

### FAISS import error

```bash
pip install faiss-cpu     # CPU only
pip install faiss-gpu     # With GPU support
```

### OpenAI API errors

1. Verify `OPENAI_API_KEY` is set in `.env`
2. Check API quota at https://platform.openai.com/usage
3. Ensure the model is available for your account

### Frontend build errors

```bash
rm -rf node_modules .next
npm install
npm run build
```

### Port conflicts

Change ports via environment variables:

```bash
# Backend
uvicorn app.main:app --port 8001

# Frontend (next.config.js or .env.local)
PORT=3001
```
