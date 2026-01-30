# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

Full-stack TypeScript monorepo providing a chat interface for querying Aparavi data pipeline webhooks across multiple datasets (Epstein, JFK, UFO).

**Packages:**
- `packages/chat-core/` — Shared business logic library (ChatService, utilities)
- `packages/express-app/` — Express backend proxy server (port 3001)
- `packages/client/` — React + Vite frontend (port 3000)

---

## Development Commands

### Root
```bash
pnpm install          # Install all dependencies
pnpm dev              # Run backend + frontend concurrently
pnpm build            # Build all packages (chat-core → express-app → client)
pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm lint:fix         # Fix lint issues
```

### Run Single Package
```bash
pnpm dev:app          # Backend only
pnpm dev:client       # Frontend only
```

### Package-Specific Tests
```bash
pnpm test:chat-core   # Test shared library
pnpm test:app         # Test backend
pnpm test:client      # Test frontend
```

### Within Package Directories
```bash
cd packages/express-app
pnpm test             # Mocha + Chai + Sinon
pnpm type-check       # TypeScript validation

cd packages/client
pnpm test             # Vitest + React Testing Library
```

---

## Architecture

### Data Flow
```
Client (React) → POST /api/chat → Express → ChatService.processChat() → Webhook API
```

### Backend Key Patterns

1. **Route Auto-Discovery:** `src/api/router/router.ts` loads all `components/*/routes.ts` automatically
2. **Multi-Pipeline Support:** Dataset-specific webhooks via `PIPELINE_{DATASET_ID}_{PROPERTY}` env vars
3. **Path Aliases:** `@config`, `@utils`, `@middleware`, `@types`, `@components`, `@router`

### Chat-Core Library

Shared between Express and future Lambda backends:
- `ChatService.processChat()` — Core business logic
- `Callout.call()` — Promise error wrapper returning `[error, data]`
- `Webhook.*` — Payload/response formatting utilities
- `PipelineOutput.extract()` — Response data extraction

### Frontend Key Patterns

- React Router: `/` (home) → `/chat/:datasetId` (chat page)
- LocalStorage persistence per dataset via `conversationStorage.ts`
- Browser fingerprinting for rate limiting via `fingerprint.ts`

---

## Environment Configuration

### Backend (`packages/express-app/.env`)
```env
# Multi-pipeline (per dataset)
# Format: PIPELINE_{DATASET_ID}_{PROPERTY}
PIPELINE_EPSTEIN_BASE_URL=
PIPELINE_EPSTEIN_AUTHORIZATION_KEY=
PIPELINE_EPSTEIN_TOKEN=

PIPELINE_JFK_BASE_URL=
PIPELINE_JFK_AUTHORIZATION_KEY=
PIPELINE_JFK_TOKEN=

PIPELINE_UFO_BASE_URL=
PIPELINE_UFO_AUTHORIZATION_KEY=
PIPELINE_UFO_TOKEN=

# Legacy single webhook (fallback)
WEBHOOK_BASE_URL=
WEBHOOK_AUTHORIZATION_KEY=
WEBHOOK_TOKEN=

PORT=3001
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Testing Pipelines
```bash
# Test a specific dataset pipeline
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What can you tell me?", "datasetId": "epstein"}'

# Test legacy webhook fallback (no datasetId)
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Uses WEBHOOK_* config"}'
```

Pipeline selection: `datasetId` → matching `PIPELINE_*` config → legacy `WEBHOOK_*` fallback → HTTP 400.

### Frontend (`packages/client/.env`)
```env
VITE_API_URL=http://localhost:3001
VITE_BACKEND_TYPE=express
```

---

## Coding Standards (Quick Reference)

See `.claude/references/code-style.md` for complete guide.

- **Error Handling:** Use `Callout.call()` — never try/catch
- **Logging:** Use logger abstraction — never console.log
- **Formatting:** Semicolons, tabs, no trailing commas, camelCase files
- **TypeScript:** Define types, prefer `type` over `interface`, avoid `any`
- **JSDoc:** Required for all exported functions
- **Testing:** Run `pnpm test` before completing any code change

---

## Adding New Backend Components

1. Create `packages/express-app/src/api/components/yourComponent/`
2. Add `routes.ts` exporting an Express router
3. Add `controller.ts` with business logic
4. Route auto-mounts at `/api/yourComponent`

---

## Additional Documentation

See `.claude/` directory for detailed references:

**Product**
- `.claude/prd.md` — Product requirements, features, user flows, success metrics

**Architecture & Style**
- `.claude/references/architecture.md` — System architecture and data flow diagrams
- `.claude/references/code-style.md` — Coding standards, naming, error handling patterns

**Commands**
- `.claude/commands/development.md` — All available pnpm commands
- `.claude/commands/test.md` — Testing guide, mocking patterns, debugging
- `.claude/commands/commit.md` — Git workflow, commit message format, branch strategy

**File References**
- `.claude/references/backend.md` — Backend file references and path aliases
- `.claude/references/chat-core.md` — Shared library exports and usage
- `.claude/references/frontend.md` — Frontend routes and services
- `.claude/references/configuration.md` — Config files and environment variables
