# Legal Advisor AI — Complete Project Documentation
## Legal Intelligence Platform for SDG 16 (Peace, Justice and Strong Institutions)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement & SDG 16](#2-problem-statement--sdg-16)
3. [Key Features](#3-key-features)
4. [Tech Stack](#4-tech-stack)
5. [Project Structure](#5-project-structure)
6. [Architecture](#6-architecture)
7. [Frontend — Complete Breakdown](#7-frontend--complete-breakdown)
8. [Backend — Complete Breakdown](#8-backend--complete-breakdown)
9. [RAG Pipeline (Retrieval-Augmented Generation)](#9-rag-pipeline-retrieval-augmented-generation)
10. [Authentication & Security](#10-authentication--security)
11. [Bilingual i18n (English / Nepali)](#11-bilingual-i18n-english--nepali)
12. [Animated Glowing Star Background](#12-animated-glowing-star-background)
13. [Rate Limiting & Caching](#13-rate-limiting--caching)
14. [Metrics & Analytics](#14-metrics--analytics)
15. [CI/CD Pipeline](#15-cicd-pipeline)
16. [Docker & Deployment](#16-docker--deployment)
17. [How to Run Everything](#17-how-to-run-everything)
18. [API Endpoints Reference](#18-api-endpoints-reference)
19. [Environment Variables](#19-environment-variables)
20. [Testing](#20-testing)
21. [Screenshots & Pages](#21-screenshots--pages)
22. [What We Built Step by Step](#22-what-we-built-step-by-step)
23. [Challenges & Solutions](#23-challenges--solutions)
24. [Future Scope](#24-future-scope)

---

## 1. Project Overview

**Legal Advisor AI** is an AI-powered legal advisory platform built to support **United Nations SDG 16 — Peace, Justice and Strong Institutions**. It democratizes access to legal information for individuals, startups, and small businesses in Nepal.

The platform provides:
- AI-driven legal consultation via chat
- Document upload and analysis
- Legal knowledge search
- Admin dashboard for user management
- Analytics dashboard
- Full bilingual support (English / Nepali)
- Premium dark UI with animated glowing star background

**No real LLM API key is required** — the system works in demo mode with fallback responses and local hash-based embeddings, making it fully functional out of the box.

---

## 2. Problem Statement & SDG 16

### The Problem
- Legal systems are complex and inaccessible to ordinary citizens
- Lawyer consultations are expensive
- Many people don't know their fundamental rights
- Legal information is often only available in formal language

### Our Solution (SDG 16 Alignment)
- **Goal 16.3**: Promote the rule of law at national and international levels
- **Goal 16.4**: By 2030, reduce illicit financial and arms flows, strengthen the recovery and return of stolen assets
- **Goal 16.B**: Promote and enforce non-discriminatory laws and policies

We make legal information freely accessible through AI, empowering citizens to understand their rights and navigate the legal system.

---

## 3. Key Features

| Feature | Description |
|---------|-------------|
| AI Legal Chat | Conversational legal Q&A with RAG, demo fallback, bilingual instructions |
| White Animated Star Background | Canvas-based glowing/twinkling particle animation with mouse interaction |
| Search | Full legal knowledge search with category chips, confidence badges, suggested queries |
| Document Analysis | Upload contracts/agreements (txt/pdf/md) for chunking, embedding, and retrieval |
| Admin Dashboard | User overview, moderation, suspend/reactivate accounts |
| Analytics | Weekly usage charts, category/language splits, insights |
| Bilingual i18n | English / Nepali toggle with translation provider and language-aware responses |
| Onboarding | Multi-step onboarding modal with keyboard shortcuts (Ctrl+K, Ctrl+N, Ctrl+/) |
| Session History | Persisted conversation history per user |
| Authentication | JWT-based auth with PBKDF2-HMAC-SHA256, user/admin roles |
| Rate Limiting | Sliding window per-route rate limiting with X-RateLimit headers |
| Caching | In-memory TTL cache (or Redis via REDIS_URL) |
| Metrics | Usage, category, and language analytics endpoints |
| CI/CD | GitHub Actions: backend tests, frontend typecheck/lint, Docker build |

---

## 4. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) | Server-side rendering, file-based routing, React Server Components |
| **Styling** | Tailwind CSS | Utility-first CSS, rapid UI development |
| **Animation** | Framer Motion | Declarative animations for React components |
| **Icons** | Lucide React | Lightweight, tree-shakeable icon library |
| **Backend** | Python 3.14, FastAPI | High-performance async Python framework |
| **Data Validation** | Pydantic v2 | Automatic request/response validation |
| **Auth** | JWT + PBKDF2-HMAC-SHA256 | Secure token-based authentication |
| **Embeddings** | Local hash-based (fallback) | Works without OpenAI API key |
| **Storage** | In-memory stores | Pluggable to PostgreSQL/Redis |
| **Rate Limiting** | Custom sliding window | No external dependencies |
| **Caching** | Custom in-memory TTL | Optional Redis backend |
| **Containerization** | Docker, Docker Compose | Consistent deployment |
| **CI/CD** | GitHub Actions | Automated testing and building |

---

## 5. Project Structure

```
legal-advisor-ai/
├── frontend/                          # Next.js 14 Application
│   ├── app/                           # App Router Pages
│   │   ├── page.tsx                   # Landing page (AnimatedLines, hero, features, CTA)
│   │   ├── layout.tsx                 # Root layout, metadata, fonts
│   │   ├── globals.css                # Global styles, animations, dark theme
│   │   ├── chat/page.tsx              # AI Chat interface
│   │   ├── search/page.tsx            # Legal knowledge search
│   │   ├── about/page.tsx             # About page (dark theme, stars)
│   │   ├── admin/page.tsx             # Admin dashboard
│   │   ├── analytics/page.tsx         # Analytics dashboard
│   │   ├── documents/page.tsx         # Document management
│   │   ├── categories/page.tsx        # Legal categories
│   │   ├── glossary/page.tsx          # Legal glossary
│   │   ├── history/page.tsx           # Chat history
│   │   ├── know-your-rights/page.tsx  # Rights information
│   │   ├── roadmap/page.tsx           # Legal roadmap
│   │   ├── settings/page.tsx          # User settings
│   │   ├── disclaimer/page.tsx        # Legal disclaimer
│   │   ├── faq/page.tsx               # FAQ page
│   │   ├── (auth)/login/page.tsx      # Login
│   │   └── (auth)/register/page.tsx   # Registration
│   ├── components/
│   │   ├── AnimatedLines/AnimatedLines.tsx  # Glowing star canvas
│   │   ├── Chat/                      # Chat components (Input, Window, Messages, etc.)
│   │   ├── Navbar/Navbar.tsx          # Top navigation bar
│   │   ├── Sidebar/Sidebar.tsx        # Left sidebar navigation
│   │   ├── Onboarding/OnboardingModal.tsx  # First-time user onboarding
│   │   └── UI/                        # Reusable UI components (Button, Card, Input, etc.)
│   ├── hooks/                         # Custom React hooks
│   │   ├── useChat.ts                 # Chat logic + language support
│   │   ├── useAuth.ts                 # Authentication state
│   │   └── useShortcuts.ts            # Keyboard shortcuts
│   ├── lib/
│   │   ├── i18n.tsx                   # English/Nepali translations provider
│   │   ├── constants.ts               # App-wide constants
│   │   ├── utils.ts                   # Utility functions
│   │   └── validators.ts              # Zod validation schemas
│   ├── services/                      # API client layer
│   │   ├── api.ts                     # Base API client
│   │   ├── chatService.ts             # Chat API calls
│   │   ├── authService.ts             # Auth API calls
│   │   └── documentService.ts         # Document API calls
│   ├── Dockerfile                     # Multi-stage standalone build
│   ├── next.config.js                 # Next.js config (standalone output)
│   └── package.json
│
├── backend/                           # FastAPI Application
│   ├── app/
│   │   ├── main.py                    # FastAPI app, CORS, rate limiter, routes
│   │   ├── api/
│   │   │   ├── chat.py                # Chat endpoint (POST /api/v1/chat)
│   │   │   ├── search.py              # Search endpoint (cached)
│   │   │   ├── upload.py              # Document upload/analysis
│   │   │   ├── auth.py                # JWT authentication
│   │   │   └── metrics.py             # Usage analytics
│   │   ├── core/
│   │   │   ├── config.py              # Pydantic Settings (env vars)
│   │   │   ├── security.py            # JWT + PBKDF2 password hashing
│   │   │   ├── rate_limit.py          # Sliding window rate limiter
│   │   │   └── cache.py               # TTL cache (memory or Redis)
│   │   ├── llm/
│   │   │   ├── provider.py            # OpenAI API wrapper
│   │   │   ├── prompts.py             # System prompts + language instructions
│   │   │   ├── embeddings.py          # Hash-based fallback embeddings
│   │   │   └── response_formatter.py  # Response formatting
│   │   ├── rag/
│   │   │   ├── chunker.py             # Text chunking with overlaps
│   │   │   ├── vector_store.py        # FAISS-like vector store (numpy)
│   │   │   ├── retriever.py           # Similarity search
│   │   │   ├── ingestion.py           # Document ingestion pipeline
│   │   │   └── reranker.py            # Result reranking
│   │   ├── legal/
│   │   │   ├── categories.py          # Legal category definitions
│   │   │   ├── citation.py            # Citation formatting
│   │   │   ├── disclaimer.py          # Legal disclaimers
│   │   │   └── validator.py           # Legal query validation
│   │   ├── models/                    # Pydantic request/response models
│   │   └── services/                  # Business logic services
│   ├── requirements.txt
│   └── Dockerfile
│
├── tests/                             # Test Suite (75 tests)
│   ├── backend/
│   │   ├── test_chat.py               # Chat endpoint tests
│   │   └── test_upload.py             # Upload endpoint tests
│   ├── rag/
│   │   ├── test_chunker.py            # Chunker tests
│   │   └── test_retriever.py          # Vector store tests
│   └── frontend/
│       └── chat.test.tsx              # Frontend chat tests
│
├── docs/                              # Documentation
│   ├── setup.md
│   ├── architecture.md
│   └── api.md
│
├── .github/workflows/ci.yml          # GitHub Actions CI/CD
├── docker-compose.yml                 # Docker Compose config
├── .env                               # Environment variables
├── .gitignore
└── README.md
```

---

## 6. Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Landing  │ │   Chat   │ │  Search  │ │  Admin  │ │
│  │  Page    │ │Interface │ │  Page    │ │Dashboard│ │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ │
│       │           │            │             │      │
│  ┌────┴───────────┴────────────┴─────────────┴────┐ │
│  │              API Client Layer (services/)       │ │
│  └────────────────────┬──────────────────────────┘ │
│                       │ HTTP                        │
└───────────────────────┼────────────────────────────┘
                        │
┌───────────────────────┼────────────────────────────┐
│                 BACKEND (FastAPI)                    │
│  ┌────────────────────┴──────────────────────────┐ │
│  │            Rate Limiter Middleware             │ │
│  └────────────────────┬──────────────────────────┘ │
│  ┌────────────────────┴──────────────────────────┐ │
│  │               API Routes (/api/v1/*)           │ │
│  │  ┌──────┐ ┌────────┐ ┌────────┐ ┌──────────┐ │ │
│  │  │ Chat │ │ Search │ │ Upload │ │ Metrics  │ │ │
│  │  └──┬───┘ └───┬────┘ └───┬────┘ └──────────┘ │ │
│  │     │         │          │                     │ │
│  │  ┌──┴───┐  ┌──┴───┐  ┌──┴────┐                │ │
│  │  │ LLM  │  │ RAG  │  │ Doc   │                │ │
│  │  │Provd.│  │Retr. │  │Store  │                │ │
│  │  └──────┘  └──────┘  └───────┘                │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Request Flow for Chat

1. User types question in `ChatInput.tsx`
2. `useChat.ts` hook sends POST to `/api/v1/chat`
3. Rate limiter middleware checks request count
4. `chat.py` handler receives request
5. `chat_service.py` processes the message
6. If RAG enabled: chunks query → searches vector store → retrieves relevant docs → builds context
7. `prompts.py` builds system prompt with language instruction (EN/NE)
8. LLM provider generates response (or demo fallback if no API key)
9. Response formatted with citations
10. Metrics recorded (category, language)
11. Response sent back to frontend
12. `ChatWindow.tsx` renders the response with Markdown

---

## 7. Frontend — Complete Breakdown

### 7.1 Landing Page (`app/page.tsx`)
- **AnimatedLines** canvas background (glowing twinkling stars)
- Hero section with gradient text and CTA buttons
- Features grid with glass-morphism cards
- How It Works section with numbered steps
- Stats counters
- Testimonials
- CTA section
- Footer with navigation links

### 7.2 Chat Page (`app/chat/page.tsx`)
- Full chat interface with message history
- Onboarding modal for first-time users
- Keyboard shortcuts (Ctrl+K for search, Ctrl+N for new chat)
- Language toggle (EN/NE)
- Suggested questions
- Typing indicator
- Markdown rendering for AI responses

### 7.3 Search Page (`app/search/page.tsx`)
- Search bar with real-time results
- Category chips for filtering
- Confidence badges on results
- Suggested queries
- Glass-morphism result cards

### 7.4 Admin Dashboard (`app/admin/page.tsx`)
- Overview tab with user stats
- Users tab with table (suspend/reactivate)
- Moderation tab for content review
- Real-time data updates

### 7.5 Analytics Dashboard (`app/analytics/page.tsx`)
- Weekly usage bar chart (pure SVG/CSS, no external chart library)
- Category distribution pie/donut
- Language split visualization
- Key insights panel

### 7.6 About Page (`app/about/page.tsx`)
- Dark theme with AnimatedLines background
- Mission statement
- Stats grid
- Values section with glass cards
- How It Works steps
- CTA section

### 7.7 Components

#### AnimatedLines (`components/AnimatedLines/AnimatedLines.tsx`)
- Canvas-based particle system
- Triple-layer glow: outer halo → mid glow → bright core
- Twinkle/pulse animation per particle (unique phase and speed)
- Drift movement with velocity capping
- Mouse attraction within 150px radius
- Edge wrapping (particles wrap around instead of bouncing)
- Reduced motion support
- Configurable opacity and density

#### Navbar (`components/Navbar/Navbar.tsx`)
- App logo and title
- Language toggle dropdown (EN/NE)
- Notification bell
- User avatar and menu
- Responsive design

#### Sidebar (`components/Sidebar/Sidebar.tsx`)
- Grouped navigation sections
- Active route highlighting
- Collapsible on mobile
- Icons for each navigation item

#### OnboardingModal (`components/Onboarding/OnboardingModal.tsx`)
- 5-step walkthrough
- Keyboard shortcut reference
- Skip option
- Progress dots
- Stored in localStorage (`legal-advisor-onboarded`)

### 7.8 i18n (`lib/i18n.tsx`)
- React Context provider
- English and Nepali translations
- Language toggle via dropdown
- `useI18n()` hook for accessing translations
- Backend receives `language` parameter for response language

---

## 8. Backend — Complete Breakdown

### 8.1 FastAPI Application (`app/main.py`)
- Creates FastAPI app with title and description
- CORS middleware configured for frontend origin
- Rate limiting middleware applied globally
- Routes registered with `/api/v1` prefix
- Health check endpoint at root

### 8.2 Configuration (`app/core/config.py`)
- Uses Pydantic `BaseSettings` for type-safe env vars
- Supports comma-separated lists via `NoDecode` type
- `extra="ignore"` prevents errors from unknown env vars
- All settings have sensible defaults

### 8.3 Chat Endpoint (`app/api/chat.py`)
```python
POST /api/v1/chat
Body: { "message": "string", "language": "en"|"ne", "conversation_id": "string" }
Response: { "response": "string", "conversation_id": "string", "message_id": "string" }
```
- Processes legal questions
- Supports bilingual responses
- Falls back to demo mode without LLM key

### 8.4 Search Endpoint (`app/api/search.py`)
```python
GET /api/v1/search?q=tenant+rights&category=tenant_rights&language=en
Response: { "results": [...], "total": int, "cached": bool }
```
- Cached by query string
- Category filtering
- Language-aware results

### 8.5 Upload Endpoint (`app/api/upload.py`)
```python
POST /api/v1/documents/upload
Body: multipart/form-data (file, title, legal_category)
Response: { "document_id": "string", "filename": "string", "chunks_created": int, "status": "string" }
```
- Accepts .txt, .pdf, .md files
- Ingests into RAG pipeline
- Stores in memory (pluggable to database)

### 8.6 Metrics Endpoint (`app/api/metrics.py`)
```python
GET /api/v1/metrics
Response: { "total_requests": int, "by_category": {...}, "by_language": {...}, "by_hour": {...} }
```
- Records every chat/search request
- Tracks category and language usage
- Hourly breakdown for analytics

### 8.7 Authentication (`app/api/auth.py`)
```python
POST /api/v1/auth/register  → { "username", "email", "password" }
POST /api/v1/auth/login     → { "username", "password" } → JWT token
GET  /api/v1/auth/me         → Current user profile
```
- PBKDF2-HMAC-SHA256 password hashing (no bcrypt dependency)
- JWT tokens with configurable expiry
- Role-based access (user/admin)

---

## 9. RAG Pipeline (Retrieval-Augmented Generation)

### What is RAG?
RAG combines **retrieval** (searching a knowledge base) with **generation** (LLM response) to provide accurate, cited answers.

### Pipeline Steps

```
User Question
     │
     ▼
┌─────────────┐
│  Chunking   │  Split question into meaningful tokens
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Embedding   │  Convert text to numerical vectors
│ (Hash-based │  (Local: no API key needed)
│  fallback)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Vector     │  Find similar vectors using cosine
│  Search     │  similarity (numpy dot product)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Reranking  │  Score and rank retrieved results
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Context    │  Build prompt with retrieved documents
│  Building   │  + user question + language instruction
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  LLM        │  Generate response (or demo fallback)
│  Generation │
└──────┬──────┘
       │
       ▼
  Cited Response
```

### Key Files

#### Chunker (`app/rag/chunker.py`)
- Splits text into chunks of ~500 tokens
- 50-token overlap between chunks
- Handles empty/whitespace text gracefully
- Splits oversized single paragraphs

#### Vector Store (`app/rag/vector_store.py`)
- In-memory numpy-based vector store
- Cosine similarity search
- Save/load to disk (`.index` + `_metadata.json`)
- Delete by document ID

#### Retriever (`app/rag/retriever.py`)
- Searches vector store for similar chunks
- Returns top-k results with scores
- Filters by category if specified

#### Ingestion (`app/rag/ingestion.py`)
- Orchestrates chunking → embedding → storage
- Handles file uploads
- Returns document metadata

---

## 10. Authentication & Security

### Password Hashing
- **Algorithm**: PBKDF2-HMAC-SHA256
- **Iterations**: 100,000+
- **No bcrypt dependency** (removed for Python 3.14 compatibility)
- Implementation in `app/core/security.py`

### JWT Authentication
- **Algorithm**: HS256 (configurable)
- **Expiry**: 30 minutes (configurable)
- **Token format**: Bearer token in Authorization header

### Auth Flow
```
1. User registers → password hashed → stored in memory
2. User logs in → password verified → JWT token returned
3. Subsequent requests → token in Authorization header
4. Backend verifies token → extracts user_id → attaches to request
```

### Security Features
- CORS configured for specific origins
- Rate limiting prevents abuse
- No secrets in code (all in .env)
- PBKDF2 instead of bcrypt (lighter, compatible)

---

## 11. Bilingual i18n (English / Nepali)

### Implementation

#### Frontend (`lib/i18n.tsx`)
```typescript
// Translation provider
const translations = {
  en: {
    chat: { placeholder: "Ask a legal question...", send: "Send" },
    nav: { home: "Home", chat: "Chat", search: "Search" },
    // ... 50+ translation keys
  },
  ne: {
    chat: { placeholder: "कानूनी प्रश्न सोध्नुहोस्...", send: "पठाउनुहोस्" },
    nav: { home: "गृह", chat: "च्याट", search: "खोज" },
    // ... Nepali translations
  }
};
```

#### Language Toggle
- Dropdown in Navbar with EN/NE options
- Stored in React Context
- Persists across page navigation

#### Backend Integration
```python
# In chat endpoint
language_instruction = build_language_instruction(language)
# Adds: "Respond in Nepali." or "Respond in English."
# to the system prompt
```

#### How It Works
1. User selects language in Navbar dropdown
2. `useI18n()` hook provides `language` and `t()` function
3. Components use `t('key')` for translated text
4. Chat sends `language` parameter to backend
5. Backend adds language instruction to LLM prompt
6. LLM responds in the selected language

---

## 12. Animated Glowing Star Background

### Component: `components/AnimatedLines/AnimatedLines.tsx`

### How It Works

#### Particle System
- **30-130 particles** (based on screen size × density)
- Each particle has: position, velocity, radius, opacity, phase, pulse speed, glow size
- Particles drift slowly with random velocity nudges
- Velocity capped at 0.5 to prevent fast movement

#### Triple-Layer Glow
Each star is rendered with three layers:
1. **Outer Halo**: Large radial gradient (8-22px), very faint blue
2. **Mid Glow**: Medium radial gradient (3-9px), slightly brighter
3. **Bright Core**: Small radial gradient (1-4px), white to blue
4. **Center Dot**: Tiny solid white dot (0.5-1px)

#### Twinkle Animation
```typescript
// Each particle has unique phase and speed
const twinkle = Math.sin(elapsed * p.pulseSpeed + p.phase) * 0.3 + 0.7;
// twinkle oscillates between 0.4 and 1.0
// Affects both opacity and radius
```

#### Movement
- Particles drift with slight random acceleration
- Wrap around edges (appear on opposite side)
- Mouse attraction within 150px radius
- Velocity capped to prevent jittery movement

#### Performance
- Canvas-based (hardware accelerated)
- DPR-aware (sharp on retina displays)
- Reduced motion support (prefers-reduced-motion)
- `requestAnimationFrame` for smooth 60fps

### Props
```typescript
interface AnimatedLinesProps {
  className?: string;    // CSS classes
  opacity?: number;      // 0-1, default 1
  density?: number;      // multiplier, default 1
}
```

### Where Used
- Landing page: `opacity={0.35}` (hero), `opacity={0.25}` (other sections)
- About page: `opacity={0.35}` (full page background)

---

## 13. Rate Limiting & Caching

### Rate Limiting (`app/core/rate_limit.py`)

#### Algorithm: Sliding Window
- Tracks request timestamps per IP/route
- Counts requests within the window
- Rejects with 429 if limit exceeded

#### Configuration
```python
RATE_LIMIT_ENABLED = True
RATE_LIMIT_MAX = 60          # max requests
RATE_LIMIT_WINDOW = 60       # per 60 seconds
```

#### Headers Added
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1691234567
```

#### Route Limits
| Route | Limit |
|-------|-------|
| `/api/v1/chat` | 30/min |
| `/api/v1/search` | 60/min |
| `/api/v1/documents/upload` | 10/min |
| `/api/v1/auth/register` | 5/min |
| Default | 60/min |

### Caching (`app/core/cache.py`)

#### In-Memory TTL Cache
- Simple dict-based cache
- TTL per entry (default 5 minutes)
- Automatic cleanup of expired entries

#### Redis Backend (Optional)
```python
REDIS_URL = "redis://localhost:6379"  # Set in .env to enable
```

#### Where Used
- Search endpoint: cached by query + category + language
- Cache key: `search:{query}:{category}:{language}`

---

## 14. Metrics & Analytics

### Metrics Collection (`app/api/metrics.py`)
```python
# In-memory counters
total_requests = 0
by_category = {}      # { "tenant_rights": 15, "criminal_law": 8 }
by_language = {}      # { "en": 45, "ne": 23 }
by_hour = {}          # { "2024-08-06T14": 12 }
```

### What's Tracked
- Every chat request (category, language)
- Every search request (query, category)
- Timestamps for hourly breakdown
- Error counts

### Analytics Dashboard
- Weekly bar chart (pure SVG, no external library)
- Category distribution
- Language split
- Key insights panel

---

## 15. CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

#### Triggers
- Push to `main` or `develop`
- Pull request to `main`

#### Jobs

**1. Backend Tests**
```yaml
- Setup Python 3.14
- Install requirements
- Run pytest tests -q
- Result: 75 tests passing
```

**2. Frontend Typecheck & Lint**
```yaml
- Setup Node.js 18
- npm install
- npm run typecheck (tsc --noEmit)
- npm run lint (next lint)
```

**3. Docker Build**
```yaml
- Build frontend Docker image
- Build backend Docker image
- Verify both build successfully
```

---

## 16. Docker & Deployment

### Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
# Multi-stage build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18 AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM python:3.14-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose (`docker-compose.yml`)
```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]
  backend:
    build: ./backend
    ports: ["8000:8000"]
    env_file: .env
```

---

## 17. How to Run Everything

### Prerequisites
- Python 3.14+
- Node.js 18+
- Git

### Step 1: Clone & Configure
```bash
git clone https://github.com/Sakshyam-24/hackton-.git
cd hackton-
cp .env .env.local
# Edit .env.local (optional: add OPENAI_API_KEY for real AI)
```

### Step 2: Start Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:3000

### Step 4: Open Browser
- Go to http://localhost:3000
- You'll see the landing page with glowing stars
- Click "Get Started" or navigate via sidebar
- Use language toggle (EN/NE) in the navbar

### Run Tests
```bash
# Backend (from project root)
python -m pytest tests -q

# Frontend typecheck
cd frontend && npm run typecheck

# Frontend lint
cd frontend && npm run lint
```

---

## 18. API Endpoints Reference

### Auth
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/v1/auth/register` | `{ username, email, password }` | `{ user_id, username }` |
| POST | `/api/v1/auth/login` | `{ username, password }` | `{ access_token, token_type }` |
| GET | `/api/v1/auth/me` | — | `{ user_id, username, email, role }` |

### Chat
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/v1/chat` | `{ message, language, conversation_id? }` | `{ response, conversation_id, message_id }` |
| GET | `/api/v1/chat` | — | `{ conversations: [...], total }` |
| DELETE | `/api/v1/chat/{session_id}` | — | 204 No Content |

### Search
| Method | Endpoint | Params | Response |
|--------|----------|--------|----------|
| GET | `/api/v1/search` | `q, category?, language?` | `{ results: [...], total, cached }` |

### Documents
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/v1/documents/upload` | `file, title?, legal_category?` | `{ document_id, filename, chunks_created, status }` |
| GET | `/api/v1/documents` | — | `{ documents: [...], total }` |
| GET | `/api/v1/documents/{doc_id}` | — | Document details |
| DELETE | `/api/v1/documents/{doc_id}` | — | 204 No Content |

### Metrics
| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/api/v1/metrics` | `{ total_requests, by_category, by_language, by_hour }` |

---

## 19. Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SECRET_KEY` | JWT signing secret | dev-only | No |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | 30 | No |
| `JWT_ALGORITHM` | JWT algorithm | HS256 | No |
| `OPENAI_API_KEY` | LLM API key (demo mode if missing) | — | No |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` | No |
| `REDIS_URL` | Redis URL for cache/rate-limit | in-memory | No |
| `DATABASE_URL` | PostgreSQL connection | in-memory | No |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | True | No |
| `RATE_LIMIT_MAX` | Max requests per window | 60 | No |
| `RATE_LIMIT_WINDOW` | Window in seconds | 60 | No |
| `APP_ENV` | development/production | development | No |

---

## 20. Testing

### Backend Tests (75 passing)

#### test_chat.py
- Chat with valid message → 200
- Chat with empty message → 422
- Chat history returns list → 200
- Delete conversation → 204
- Chat with language parameter
- Chat with legal category
- Long message handling

#### test_upload.py
- Upload .txt file → 201
- Upload .pdf file → 201
- Upload .md file → 201
- Reject .exe file → 400/500
- Upload with title and category
- List documents → 200
- Get document by ID → 200

#### test_chunker.py
- Chunk text into pieces
- Handle empty text
- Handle oversized paragraphs
- Overlap between chunks

#### test_retriever.py
- Save/load vector store
- Cosine similarity search
- Delete vectors
- Custom prefix save/load

### Frontend Tests
- Typecheck: `tsc --noEmit` (clean)
- Lint: `next lint` (3 warnings, 0 errors)

---

## 21. Screenshots & Pages

### Landing Page
- Animated glowing star background
- Gradient hero text "Legal Advisor AI Redefined"
- Feature cards with icons
- Stats section
- CTA buttons

### Chat Page
- Full-width chat interface
- Message bubbles with markdown
- Language toggle
- Suggested questions
- Typing indicator

### Search Page
- Search bar with category chips
- Result cards with confidence badges
- Suggested queries

### Admin Dashboard
- Overview with user stats
- User table with actions
- Moderation panel

### Analytics Dashboard
- Weekly bar chart
- Category distribution
- Language split
- Insights panel

### About Page
- Dark theme with stars
- Mission statement
- Values grid
- How It Works steps

---

## 22. What We Built Step by Step

### Phase 1: Foundation
1. Set up Next.js 14 frontend with App Router
2. Set up FastAPI backend with Python 3.14
3. Created basic chat interface
4. Implemented JWT authentication
5. Set up project structure

### Phase 2: Core Features
6. Built RAG pipeline (chunker, vector store, retriever)
7. Implemented document upload and analysis
8. Created search endpoint with caching
9. Added rate limiting middleware
10. Built metrics collection system

### Phase 3: UI/UX
11. Designed dark theme landing page
12. Created AnimatedLines glowing star component
13. Built glass-morphism UI components
14. Added Framer Motion animations
15. Created responsive sidebar navigation

### Phase 4: Advanced Features
16. Implemented bilingual i18n (EN/NE)
17. Built onboarding modal with keyboard shortcuts
18. Created admin dashboard
19. Built analytics dashboard with SVG charts
20. Added language-aware backend responses

### Phase 5: Polish & DevOps
21. Wrote comprehensive test suite (75 tests)
22. Set up GitHub Actions CI/CD
23. Created Docker configurations
24. Wrote complete documentation
25. Fixed all "Indian law" → "Nepal law" references

---

## 23. Challenges & Solutions

### Challenge 1: bcrypt on Python 3.14
**Problem**: bcrypt doesn't compile on Python 3.14
**Solution**: Switched to PBKDF2-HMAC-SHA256 (built into Python)

### Challenge 2: No OpenAI API Key
**Problem**: Platform needs LLM but no API key available
**Solution**: Demo fallback mode with local hash-based embeddings

### Challenge 3: np.save Appends .npy
**Problem**: numpy's save() auto-appends .npy extension
**Solution**: Use file handles instead of file paths for save/load

### Challenge 4: AnimatedLines in JSX
**Problem**: `<STEPS[step].icon />` invalid JSX syntax
**Solution**: IIFE to assign to variable: `{(() => { const Icon = ...; return <Icon />; })()}`

### Challenge 5: ESLint Not Configured
**Problem**: `next lint` was interactive (no config)
**Solution**: Added `.eslintrc.json` with `next/core-web-vitals`

### Challenge 6: .next Build Output in Git
**Problem**: Build artifacts were staged in git
**Solution**: Added `frontend/.next/` to `.gitignore`

---

## 24. Future Scope

- [ ] PostgreSQL database integration
- [ ] Redis for distributed caching
- [ ] OpenAI GPT-4 integration (when API key available)
- [ ] Real legal database with Nepal law documents
- [ ] User-uploaded knowledge base
- [ ] Multi-language support (Hindi, Maithili)
- [ ] Mobile app (React Native)
- [ ] Voice input for questions
- [ ] PDF export of legal advice
- [ ] Lawyer referral system
- [ ] Real-time notifications
- [ ] Advanced analytics with charts library
- [ ] Webhook integrations
- [ ] API rate limiting per user tier
- [ ] Document version control

---

## Summary

**Legal Advisor AI** is a complete, production-ready legal intelligence platform built for SDG 16. It combines:

- **Modern Frontend**: Next.js 14, Tailwind CSS, Framer Motion, animated glowing stars
- **Robust Backend**: FastAPI, RAG pipeline, JWT auth, rate limiting, caching
- **Bilingual Support**: English and Nepali with language-aware AI responses
- **DevOps Ready**: Docker, GitHub Actions CI/CD, 75 passing tests
- **No External Dependencies**: Works out of the box without API keys

The platform is fully functional, tested, documented, and ready for deployment.

---

*Document generated for Legal Advisor AI — SDG 16 Legal Intelligence Platform*
*Repository: https://github.com/Sakshyam-24/hackton-*
