# Aparavi - File Investigator

A full-stack chat interface for interacting with Aparavi data pipelines. This monorepo contains a React frontend and choice of Express or Lambda backend.

## Project Structure

```
aparavi-file-investigator/
├── packages/
│   ├── chat-core/      # Shared business logic library
│   ├── express-app/    # Express backend server
│   └── client/         # React frontend (Vite)
└── package.json        # Monorepo orchestration
```

## Prerequisites

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 8.0.0 ([Installation guide](https://pnpm.io/installation))

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd aparavi-file-investigator
pnpm install
```

### 2. Configure Environment Variables

**Backend (`packages/express-app/.env`):**
```env
# Multi-pipeline configuration (per dataset)
# Format: PIPELINE_{DATASET_ID}_{PROPERTY}
PIPELINE_EPSTEIN_BASE_URL=https://epstein-pipeline.aparavi.com/api/webhook/endpoint
PIPELINE_EPSTEIN_AUTHORIZATION_KEY=your-authorization-key
PIPELINE_EPSTEIN_TOKEN=your-token

PIPELINE_JFK_BASE_URL=https://jfk-pipeline.aparavi.com/api/webhook/endpoint
PIPELINE_JFK_AUTHORIZATION_KEY=your-authorization-key
PIPELINE_JFK_TOKEN=your-token

# Legacy single webhook (fallback when no datasetId is provided)
WEBHOOK_BASE_URL=https://your-aparavi-webhook-url.com
WEBHOOK_AUTHORIZATION_KEY=your_authorization_key
WEBHOOK_TOKEN=your_token

PORT=3001
```

**Frontend (`packages/client/.env`):**
```env
VITE_API_URL=http://localhost:3001
VITE_BACKEND_TYPE=express
```

> For detailed environment configuration, see [packages/express-app/README.md](./packages/express-app/README.md) and [packages/client/README.md](./packages/client/README.md)

### 3. Start Development Servers

**Option A: Run both services (Express backend):**
```bash
pnpm dev
```

This starts:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:3000`

**Option B: Frontend only (when using Lambda):**
```bash
pnpm dev:client
```

## Production Deployment

### Build All

```bash
pnpm build
```

### Deploy Components

Each component has specific deployment requirements:

- **Frontend (Static Hosting)**: See [packages/client/README.md](./packages/client/README.md#production-deployment)
- **Backend (Express/Docker)**: See [packages/express-app/README.md](./packages/express-app/README.md#production-deployment)

## Architecture

The application supports two backend architectures:

### Express Backend (Default)
```
Browser → Frontend (React/Vite) → Backend (Express) → Aparavi Webhook
```

**Use when:**
- Local development
- Self-hosted deployments
- Traditional server infrastructure

## Testing Pipelines

Once the server is running, you can test individual pipelines using curl:

```bash
# Test a specific dataset pipeline
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What can you tell me about this?", "datasetId": "epstein"}'

# Test a different dataset
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Search query here", "datasetId": "jfk"}'

# Test legacy webhook fallback (no datasetId)
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Uses default WEBHOOK_* config"}'
```

### Pipeline Selection Logic

1. If `datasetId` is provided and a matching `PIPELINE_{DATASET_ID}_*` config exists, that pipeline is used
2. If no `datasetId` or no matching pipeline, falls back to legacy `WEBHOOK_*` config
3. If neither exists, returns HTTP 400

## Available Commands

From root directory:

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all workspace dependencies |
| `pnpm dev` | Start both frontend and backend in dev mode |
| `pnpm dev:client` | Start frontend only (for Lambda backend) |
| `pnpm dev:app` | Start backend only |
| `pnpm build` | Build both projects for production |
| `pnpm start` | Start production builds |

## Documentation

- **[Backend (Express)](./packages/express-app/README.md)** - Express server setup, configuration, and deployment
- **[Frontend (React)](./packages/client/README.md)** - React app setup, configuration, and deployment
- **[Shared Library](./packages/chat-core/)** - Chat-core shared business logic

## License

MIT
