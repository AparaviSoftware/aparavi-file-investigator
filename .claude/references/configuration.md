# Configuration References

## Root Configuration Files

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Workspace package definitions |
| `package.json` | Root scripts and shared dependencies |
| `.eslintrc.json` | ESLint rules (tabs, semicolons, TypeScript) |
| `tsconfig.eslint.json` | ESLint-compatible TypeScript config |
| `.gitignore` | Git ignore patterns |

## Package Configuration

| File | Purpose |
|------|---------|
| `packages/express-app/tsconfig.json` | Backend TS config with path aliases |
| `packages/express-app/.mocharc.json` | Mocha test configuration |
| `packages/client/vite.config.ts` | Vite build configuration |
| `packages/client/tsconfig.json` | Frontend TS config |
| `packages/chat-core/tsconfig.json` | Shared library TS config |

## Environment Variables

### Backend (`packages/express-app/.env`)
```env
# Multi-pipeline configuration (per dataset)
# Format: PIPELINE_{DATASET_ID}_{PROPERTY}
# Dataset IDs are auto-extracted and lowercased (e.g., PIPELINE_EPSTEIN_* → "epstein")
PIPELINE_EPSTEIN_BASE_URL=https://epstein-pipeline.aparavi.com/api/webhook/endpoint
PIPELINE_EPSTEIN_AUTHORIZATION_KEY=epstein-authorization-key-here
PIPELINE_EPSTEIN_TOKEN=epstein-webhook-token-here

PIPELINE_JFK_BASE_URL=https://jfk-pipeline.aparavi.com/api/webhook/endpoint
PIPELINE_JFK_AUTHORIZATION_KEY=jfk-authorization-key-here
PIPELINE_JFK_TOKEN=jfk-webhook-token-here

PIPELINE_UFO_BASE_URL=https://ufo-pipeline.aparavi.com/api/webhook/endpoint
PIPELINE_UFO_AUTHORIZATION_KEY=ufo-authorization-key-here
PIPELINE_UFO_TOKEN=ufo-webhook-token-here

# Legacy single webhook (fallback when no datasetId provided)
WEBHOOK_BASE_URL=
WEBHOOK_AUTHORIZATION_KEY=
WEBHOOK_TOKEN=

# Server config
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Pipeline Properties

| Property | Required | Description |
|----------|----------|-------------|
| `PIPELINE_{ID}_BASE_URL` | Yes | Webhook endpoint URL |
| `PIPELINE_{ID}_AUTHORIZATION_KEY` | Yes | Authorization key |
| `PIPELINE_{ID}_TOKEN` | Yes | Authentication token |
| `PIPELINE_{ID}_API_KEY` | No | Optional API key |

Each pipeline has a default timeout of 300,000ms (5 minutes). At least one configuration source is required — either `PIPELINE_*` or `WEBHOOK_*` variables.

### Pipeline Selection Logic

1. If request contains `datasetId` matching a `PIPELINE_*` config → uses that pipeline
2. If no `datasetId` or no match → falls back to `WEBHOOK_*` config
3. If neither exists → HTTP 400 error

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

### Frontend (`packages/client/.env`)
```env
VITE_API_URL=http://localhost:3001
VITE_BACKEND_TYPE=express
```
