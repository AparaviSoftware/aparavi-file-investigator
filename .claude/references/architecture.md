# Architecture

## Overview

Full-stack TypeScript monorepo providing a chat interface for querying Aparavi data pipeline webhooks across multiple datasets.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          pnpm Workspace                              │
├─────────────────┬─────────────────────┬─────────────────────────────┤
│  chat-core      │    express-app      │         client              │
│  (shared lib)   │    (backend)        │        (frontend)           │
│                 │                     │                             │
│  ChatService    │    Express Server   │    React + Vite             │
│  Callout        │    Controllers      │    Pages                    │
│  Webhook utils  │    Middleware       │    Services                 │
│  Types          │    Routes           │    Components               │
└─────────────────┴─────────────────────┴─────────────────────────────┘
```

## Data Flow

```
User Input
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Client (React)                                                      │
│  - FilesChatbot captures message                                     │
│  - fingerprint.ts generates browser fingerprint                      │
│  - api.ts sends POST /api/chat with { message, datasetId }          │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Express Server                                                      │
│  - Fingerprint middleware extracts client ID                         │
│  - Rate limiter checks request limits                                │
│  - ChatController validates request                                  │
│  - Selects pipeline config based on datasetId                        │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ChatService (chat-core)                                             │
│  - Webhook.buildPayload() formats message                            │
│  - Webhook.buildConfig() adds auth headers                           │
│  - Callout.call() executes POST to webhook                           │
│  - PipelineOutput.extract() parses response                          │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Aparavi Webhook API                                                 │
│  - Processes query against dataset                                   │
│  - Returns answers array or data objects                             │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
Response flows back through the stack
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Client                                                              │
│  - conversationStorage.ts persists to LocalStorage                   │
│  - ChatMessage renders with markdown support                         │
└─────────────────────────────────────────────────────────────────────┘
```

## Package Dependencies

```
client ──────────────────────► express-app
   │                               │
   │                               │
   └───────────► chat-core ◄───────┘
```

- `client` calls `express-app` via HTTP
- `express-app` imports `@aparavi/chat-core` for business logic
- `chat-core` is a pure library with no external dependencies on other packages

## Backend Architecture

### Middleware Stack (in order)
1. **helmet()** — Security headers
2. **CORS** — Origin validation (localhost in dev, FRONTEND_URL in prod)
3. **Body Parsing** — JSON (10MB limit), text, URL-encoded
4. **Fingerprint Extraction** — Client device identification
5. **Rate Limiting** — 100 requests per 15 minutes per fingerprint/IP
6. **Request Logging** — Dev-only request logging

### Route Auto-Discovery
The router (`src/api/router/router.ts`) automatically discovers and mounts all `components/*/routes.ts` files at `/api/{componentName}`.

To add a new endpoint:
1. Create `src/api/components/yourComponent/`
2. Add `routes.ts` with Express router
3. Add `controller.ts` with handlers
4. Route auto-mounts at `/api/yourComponent`

### Multi-Pipeline Support
Each dataset has its own webhook configuration via environment variables:
```
PIPELINE_{DATASET_ID}_BASE_URL
PIPELINE_{DATASET_ID}_AUTHORIZATION_KEY
PIPELINE_{DATASET_ID}_TOKEN
PIPELINE_{DATASET_ID}_API_KEY          # optional
```

The controller selects the appropriate config based on the `datasetId` in the request body. Pipeline selection follows this priority:

1. If `datasetId` matches a `PIPELINE_*` config → uses that pipeline
2. If no match → falls back to legacy `WEBHOOK_*` config
3. If neither exists → returns HTTP 400

### Chat API Request/Response Format

**Endpoint:** `POST /api/chat`

**Request body:**
```json
{
  "message": "string (optional)",
  "data": { },
  "datasetId": "epstein | jfk | ufo | ...",
  "fingerprint": { }
}
```
Either `message` or `data` is required.

**Success response:**
```json
{
  "success": true,
  "message": "Response text from the pipeline",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "metadata": { "processingTime": "1234ms" }
}
```

**Error codes:** 400 (bad request / no config), 429 (rate limited), 504 (timeout)

## Frontend Architecture

### Routing
| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Home | Dataset selection cards |
| `/chat/:datasetId` | FilesChatbot | Chat interface |
| `*` | Redirect | Fallback to home |

### State Management
- React hooks for local component state
- `conversationStorage.ts` for persistence across sessions
- Per-dataset conversation isolation via LocalStorage keys

### Key Components
- **FilesChatbot** — Main chat page with message history, input, suggested questions
- **ChatMessage** — Renders messages with markdown, copy/edit/regenerate actions
- **InputBox** — Message input with query counter and submit handling
- **HeroBanner** — Dataset-specific hero images (fades when chat starts)

## Error Handling Architecture

### Backend
- `AppError` class for structured errors with status codes
- Global error middleware catches all errors
- `Callout.call()` wraps promises to return `[error, data]` tuples
- No try/catch blocks in application code

### Frontend
- API errors mapped to user-friendly messages
- Toast notifications for query limits and errors
- Graceful degradation on network failures
