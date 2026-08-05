# System Architecture

## Overview

Legal Advisor AI is a Retrieval-Augmented Generation (RAG) system that combines document retrieval with large language model generation to provide legal guidance.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │   Chat   │ │  Upload  │ │ History  │ │    Sidebar    │  │
│  │   UI     │ │   UI     │ │   UI     │ │  Navigation   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬───────┘  │
└───────┼─────────────┼───────────┼────────────────┼──────────┘
        │             │           │                │
        ▼             ▼           ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                    REST API (FastAPI)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ /chat    │ │/upload   │ │ /history │ │ /documents    │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬───────┘  │
└───────┼─────────────┼───────────┼────────────────┼──────────┘
        │             │           │                │
        ▼             ▼           ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  RAG Pipeline                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │   │
│  │  │ Chunker  │ │Retriever │ │ Embedder │             │   │
│  │  └──────────┘ └──────────┘ └──────────┘             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │   LLM    │ │ Document │ │  Legal   │                    │
│  │ Provider │ │ Service  │ │ Domain   │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
        │             │           │
        ▼             ▼           ▼
┌─────────────┐ ┌───────────┐ ┌───────────┐
│  OpenAI /   │ │   FAISS   │ │  File     │
│  Anthropic  │ │   Index   │ │  Storage  │
│  API        │ │           │ │           │
└─────────────┘ └───────────┘ └───────────┘
```

## Components

### Frontend (Next.js + React)

| Component | Purpose |
|-----------|---------|
| `Chat/` | Main chat interface with message input and response display |
| `MessageBubble/` | Individual message rendering with markdown support |
| `CitationCard/` | Source citation display for retrieved documents |
| `SuggestedQuestions/` | Pre-built legal question templates |
| `Sidebar/` | Navigation and session history |
| `Navbar/` | Top navigation bar |

### Backend (FastAPI)

| Module | Purpose |
|--------|---------|
| `api/chat.py` | Chat endpoint handling user messages |
| `api/upload.py` | Document upload and processing |
| `rag/chunker.py` | Document text splitting with overlap |
| `rag/retriever.py` | FAISS vector search and retrieval |
| `llm/provider.py` | LLM abstraction (OpenAI/Anthropic) |
| `services/document_service.py` | File handling and text extraction |
| `core/config.py` | Environment-based configuration |
| `core/logger.py` | Structured logging setup |

## RAG Pipeline Flow

```
User Query
    │
    ▼
┌─────────────┐
│  Embedding  │  Convert query to vector
│  Generation │  using text-embedding-3-small
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   FAISS     │  Vector similarity search
│   Search    │  against document index
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Chunk     │  Retrieve top-k relevant
│  Retrieval  │  document chunks
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Context   │  Combine retrieved chunks
│  Assembly   │  into prompt context
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   LLM      │  Generate response with
│ Generation │  legal context
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Response   │  Return answer with
│  + Sources  │  source citations
└─────────────┘
```

## Document Processing Pipeline

```
Upload File
    │
    ▼
┌─────────────┐
│  Validate   │  Check extension, size
│  File       │  (pdf, docx, txt, md)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Text      │  Extract text using
│ Extraction  │  PyMuPDF / python-docx
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Chunking   │  Split into overlapping
│  (1000 tok) │  chunks (200 overlap)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Embedding  │  Generate vectors via
│  Generation │  OpenAI embeddings API
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   FAISS     │  Store vectors in
│   Indexing  │  IndexFlatL2 index
└──────┬──────┘
       │
       ▼
  Saved to disk
```

## Data Storage

```
data/
├── raw/              # Uploaded original files
├── processed/        # Extracted text and chunks
│   ├── chunks.pkl    # Pickled Chunk objects
│   └── *.txt         # Extracted text files
├── embeddings/       # Vector indices
│   └── faiss_index/
│       ├── index.faiss   # FAISS index file
│       ├── chunks.pkl    # Chunk metadata
│       └── index_stats.txt
└── evaluation/       # Test data and reports
    ├── test_queries.json
    └── report.json
```

## Configuration

All settings are managed via environment variables with sensible defaults:

- **LLM Provider**: OpenAI (default) or Anthropic
- **Embedding Model**: `text-embedding-3-small` (1536 dimensions)
- **Chunk Parameters**: 1000 tokens, 200 overlap
- **Retrieval**: Top-10 candidates, rerank to Top-5

## Security Considerations

- API keys stored in environment variables, never committed
- File upload validation (type + size limits)
- CORS configured for allowed origins only
- JWT-based authentication for user sessions
