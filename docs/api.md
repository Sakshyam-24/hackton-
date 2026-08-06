# API Documentation

## Base URL

```
http://localhost:8000
```

## Authentication

All endpoints (except health check) require a JWT Bearer token:

```
Authorization: Bearer <token>
```

Obtain a token via `/api/auth/login`.

---

## Endpoints

### Chat

#### `POST /api/chat`

Send a legal question and receive an AI-generated response with source citations.

**Request Body:**

```json
{
  "message": "What are the key elements of a valid contract?",
  "conversation_id": "optional-existing-session-id",
  "legal_category": "contract_law",
  "use_rag": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | User's legal question (1-10000 chars) |
| `conversation_id` | string | No | Existing conversation ID for context |
| `legal_category` | string | No | Legal domain hint (e.g., `contract_law`, `ip_law`) |
| `use_rag` | boolean | No | Enable RAG retrieval (default: `true`) |

**Response (200):**

```json
{
  "response": "Based on your question about...",
  "conversation_id": "conv_abc123",
  "sources": [
    {
      "chunk_id": "chunk_001",
      "content": "Relevant text excerpt...",
      "source": "contract_law_guide.pdf",
      "page": 5,
      "score": 0.82
    }
  ],
  "disclaimer": "This is AI-generated legal information for reference only. Consult a qualified attorney for official legal advice."
}
```

**Error (422):**

```json
{
  "detail": [
    {
      "loc": ["body", "message"],
      "msg": "Field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

#### `GET /api/chat/history`

Retrieve conversation history for the authenticated user.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 50 | Max conversations to return |
| `offset` | integer | 0 | Pagination offset |

**Response (200):**

```json
{
  "conversations": [
    {
      "id": "conv_abc123",
      "title": "Contract Law Question",
      "created_at": "2025-01-15T10:30:00Z",
      "message_count": 12
    }
  ],
  "total": 5
}
```

---

#### `DELETE /api/chat/{session_id}`

Delete a conversation session.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `session_id` | string | Conversation ID to delete |

**Response (200):**

```json
{
  "status": "deleted",
  "session_id": "conv_abc123"
}
```

---

### Documents

#### `POST /api/documents/upload`

Upload a legal document for analysis and indexing.

**Request:**

```
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | Yes | Document file (PDF, DOCX, TXT, MD) |
| `title` | string | No | Document title |
| `legal_category` | string | No | Legal category classification |

**File Constraints:**

- Max size: 20MB
- Allowed extensions: `.pdf`, `.docx`, `.txt`, `.md`

**Response (200):**

```json
{
  "status": "success",
  "document": {
    "id": "doc_a1b2c3d4e5f6",
    "filename": "contract_template.pdf",
    "title": "Contract Template",
    "file_size": 1048576
  }
}
```

**Error (400):**

```json
{
  "detail": "File type '.exe' not allowed. Allowed: ['.pdf', '.docx', '.txt', '.md']"
}
```

---

#### `GET /api/documents`

List all uploaded documents.

**Response (200):**

```json
{
  "documents": [
    {
      "id": "doc_a1b2c3d4e5f6",
      "filename": "contract_template.pdf",
      "title": "Contract Template",
      "file_size": 1048576,
      "legal_category": "contract_law",
      "uploaded_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

#### `GET /api/documents/{doc_id}`

Get detailed information about a specific document.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `doc_id` | string | Document ID |

**Response (200):**

```json
{
  "document": {
    "id": "doc_a1b2c3d4e5f6",
    "filename": "contract_template.pdf",
    "title": "Contract Template",
    "file_hash": "abc123...",
    "file_size": 1048576,
    "legal_category": "contract_law",
    "tags": ["contract", "template"],
    "text": "Extracted document text...",
    "uploaded_at": "2025-01-15T10:30:00Z"
  }
}
```

---

### Search

#### `POST /api/search`

Search documents by semantic similarity.

**Request Body:**

```json
{
  "query": "termination clauses in employment contracts",
  "top_k": 5,
  "legal_category": "employment_law"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | Search query (1-1000 chars) |
| `top_k` | integer | No | Number of results (1-20, default: 5) |
| `legal_category` | string | No | Filter by legal category |

**Response (200):**

```json
{
  "results": [
    {
      "chunk_id": "chunk_001",
      "content": "Section 8.1: The employer may terminate...",
      "source": "employment_agreement.pdf",
      "page": 12,
      "score": 0.91
    }
  ],
  "query": "termination clauses in employment contracts",
  "total_results": 3
}
```

---

### Research

#### `POST /api/research`

Search case law and statutes.

**Request Body:**

```json
{
  "query": "negligence duty of care",
  "jurisdiction": "US_Federal",
  "max_results": 10
}
```

**Response (200):**

```json
{
  "results": [
    {
      "case_name": "Smith v. Jones Corp",
      "citation": "123 F.3d 456 (2d Cir. 2020)",
      "summary": "The court held that...",
      "relevance_score": 0.95
    }
  ]
}
```

---

### Authentication

#### `POST /api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}
```

**Response (201):**

```json
{
  "id": "usr_abc123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

#### `POST /api/auth/login`

Authenticate and receive a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

#### `GET /api/auth/me`

Get current user profile (requires authentication).

**Response (200):**

```json
{
  "id": "usr_abc123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user"
}
```

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/chat` | 30 requests | 1 minute |
| `/api/documents/upload` | 10 requests | 1 minute |
| `/api/search` | 60 requests | 1 minute |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad request - invalid input |
| 401 | Unauthorized - missing or invalid token |
| 403 | Forbidden - insufficient permissions |
| 404 | Not found - resource does not exist |
| 413 | Payload too large - file exceeds size limit |
| 422 | Validation error - request body validation failed |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
