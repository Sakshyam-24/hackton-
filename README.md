# Legal Advisor AI — Legal Intelligence Platform for SDG 16

An AI-powered legal advisory platform supporting **SDG 16 (Peace, Justice and Strong Institutions)** — democratizing access to legal information for individuals, startups, and small businesses. It provides AI-driven legal consultation, document analysis, search, analytics, and administration in a bilingual (English / Nepali) interface.

> **Disclaimer:** This tool provides AI-generated legal information for educational and preliminary reference only. It does not constitute legal advice and should not be relied upon as a substitute for consultation with a qualified attorney.

## Features

- **AI Legal Chat** — Conversational legal Q&A with RAG (retrieval-augmented generation), demo fallback when no LLM key is configured, and bilingual instructions.
- **White Animated Line Background** — Canvas-based particle/line animation (mouse-reactive, reduced-motion aware) across the landing experience.
- **Search** — Full legal knowledge search with category chips, confidence badges, and suggested queries.
- **Document Analysis** — Upload contracts, agreements, or notices (txt/pdf/md) for chunking, embedding, and retrieval.
- **Admin Dashboard** — User overview, moderation, and account lifecycle (suspend/reactivate).
- **Analytics** — Weekly usage charts, category/language splits, and insights backed by `/api/v1/metrics`.
- **Bilingual i18n** — English / Nepali toggle with translation provider and language-aware responses.
- **Onboarding & Shortcuts** — Multi-step onboarding modal with keyboard shortcuts (`Ctrl+K`, `Ctrl+N`, `Ctrl+/`).
- **Session History** — Persisted conversation history per user.
- **Authentication & Roles** — JWT-based auth (PBKDF2-HMAC-SHA256) with user/admin role separation.
- **Reliability** — Rate limiting (sliding window), response caching (in-memory or Redis), structured metrics.
- **CI/CD** — GitHub Actions: backend tests, frontend typecheck/lint, Docker image build.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend | Python 3.14, FastAPI, SQLAlchemy, Pydantic v2 |
| Storage | In-memory stores (pluggable PostgreSQL/Redis via `DATABASE_URL` / `REDIS_URL`) |
| AI / LLM | Pluggable OpenAI-compatible provider; local hash-embedding + demo fallback by default |
| Embeddings | Local deterministic hashing when no API key is available |
| Containerization | Docker, Docker Compose, multi-stage `standalone` build |

## Project Structure

```
legal-advisor-ai/
├── frontend/                 # Next.js application (port 3000)
│   ├── app/                  # App Router pages (chat, search, admin, analytics, ...)
│   ├── components/           # AnimatedLines, Navbar, Sidebar, Onboarding, ChatInput, ...
│   ├── hooks/                # useChat, useShortcuts, ...
│   ├── lib/                  # i18n provider, utils
│   ├── services/             # API client layer (apiClient, chatService, documentService)
│   ├── Dockerfile            # multi-stage standalone build
│   └── next.config.js
├── backend/                  # FastAPI application (port 8000)
│   ├── app/
│   │   ├── api/              # chat, search, upload, auth, metrics routers
│   │   ├── core/             # config, security, cache, rate_limit
│   │   ├── llm/              # prompts, language instruction
│   │   ├── rag/              # chunker, vector_store, retriever, ingestion
│   │   └── main.py
│   └── requirements.txt
├── tests/                    # Backend pytest suite (run from repo root)
├── docs/                     # setup, architecture, api
├── .github/workflows/ci.yml  # CI/CD pipeline
├── .env
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.14+
- Node.js 18+
- Docker & Docker Compose (optional)

### 1. Configure environment

```bash
cp .env .env.local
# Edit .env.local with your credentials and (optional) OPENAI_API_KEY
```

### 2. Run the backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:3000
```

### 4. Run tests

```bash
python -m pytest tests -q           # from repo root (75 tests)
cd frontend && npm run typecheck    # tsc --noEmit
cd frontend && npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Secret for JWT signing | dev-only default |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes | 30 |
| `JWT_ALGORITHM` | JWT algorithm | HS256 |
| `OPENAI_API_KEY` | Optional LLM key; fallback demo mode otherwise | — |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000` |
| `REDIS_URL` | Optional Redis URL for cache/rate-limit backends | in-memory |
| `DATABASE_URL` | Optional PostgreSQL connection string | in-memory |
| `RATE_LIMIT_ENABLED` / `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW` | Rate limiting toggle, max requests, window seconds | on / 60 / 60 |
| `APP_ENV` | `development` or `production` | development |

## API Endpoints (all under `/api/v1`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Authenticate and receive JWT |
| GET | `/api/v1/auth/me` | Get current user profile |
| POST | `/api/v1/chat` | Send a legal question |
| GET | `/api/v1/chat` | Retrieve conversation history |
| DELETE | `/api/v1/chat/{session_id}` | Delete a session (204) |
| POST | `/api/v1/documents/upload` | Upload a document for analysis |
| GET | `/api/v1/documents` | List uploaded documents |
| GET | `/api/v1/documents/{doc_id}` | Get document details |
| DELETE | `/api/v1/documents/{doc_id}` | Delete a document |
| GET | `/api/v1/search` | Cached legal knowledge search |
| GET | `/api/v1/metrics` | Usage / category / language analytics |

Interactive docs: http://localhost:8000/docs

## License

MIT. See [LICENSE](./LICENSE).

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/), [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- United Nations **SDG 16** — Peace, Justice and Strong Institutions
