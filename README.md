# Aparavi Pipeline Chat Application

A full-stack chat interface for interacting with Aparavi data pipelines. This monorepo contains a React frontend and choice of Express or Lambda backend.

## Project Structure

```
aparavi-file-investigator/
├── client/         # React frontend (Vite)
├── app/            # Express backend server
├── lambda/         # AWS Lambda function (alternative backend)
└── package.json    # Monorepo orchestration
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

**Backend (`app/.env`):**
```env
WEBHOOK_BASE_URL=https://your-aparavi-webhook-url.com
WEBHOOK_AUTHORIZATION_KEY=your_authorization_key
WEBHOOK_TOKEN=your_token
PORT=3001
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:3001
```

> For detailed environment configuration, see [app/README.md](./app/README.md) and [client/README.md](./client/README.md)

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

> See [lambda/README.md](./lambda/README.md) for Lambda deployment instructions

## Production Deployment

### Build All

```bash
pnpm build
```

### Deploy Components

Each component has specific deployment requirements:

- **Frontend (Static Hosting)**: See [client/README.md](./client/README.md#production-deployment)
- **Backend (Express/Docker)**: See [app/README.md](./app/README.md#production-deployment)
- **Backend (Lambda)**: See [lambda/README.md](./lambda/README.md#deployment)

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

### Lambda Backend (Serverless)
```
Browser → Frontend (React/Vite) → AWS Lambda → Aparavi Webhook
```

**Use when:**
- Serverless deployments
- AWS infrastructure
- Cost-optimized scaling

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

- **[Backend (Express)](./app/README.md)** - Express server setup, configuration, and deployment
- **[Frontend (React)](./client/README.md)** - React app setup, configuration, and deployment
- **[Lambda Function](./lambda/README.md)** - AWS Lambda deployment and configuration

## License

MIT
