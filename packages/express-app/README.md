# Aparavi Pipeline Chat Backend

TypeScript/Express backend proxy server for Aparavi data pipeline webhook integration. Handles authentication, rate limiting, error processing, and response formatting.

## Features

- **Secure Webhook Proxy**: Handles authentication with Aparavi webhooks
- **Rate Limiting**: Configurable request throttling
- **Error Handling**: Comprehensive error processing and logging
- **CORS**: Cross-origin support for frontend
- **TypeScript**: Full type safety
- **Auto-Route Discovery**: Component-based routing

## Prerequisites

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 8.0.0 ([Install guide](https://pnpm.io/installation))

## Development Setup

### 1. Install Dependencies

```bash
cd packages/express-app
pnpm install
```

### 2. Configure Environment

Create a `.env` file in the `packages/express-app/` directory (see `.env.example`):

```env
# Multi-pipeline configuration (per dataset)
# Format: PIPELINE_{DATASET_ID}_{PROPERTY}
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
WEBHOOK_BASE_URL=https://your-aparavi-webhook-url.com
WEBHOOK_AUTHORIZATION_KEY=your_authorization_key
WEBHOOK_TOKEN=your_token

# Optional
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Environment Variables

#### Pipeline Configuration (Multi-Dataset)

Pipeline environment variables use the format `PIPELINE_{DATASET_ID}_{PROPERTY}`. Dataset IDs are automatically extracted and lowercased (e.g., `PIPELINE_EPSTEIN_BASE_URL` maps to dataset `epstein`).

| Property | Required | Description |
|----------|----------|-------------|
| `PIPELINE_{ID}_BASE_URL` | Yes | Webhook endpoint URL for this dataset |
| `PIPELINE_{ID}_AUTHORIZATION_KEY` | Yes | Authorization key for this dataset |
| `PIPELINE_{ID}_TOKEN` | Yes | Authentication token for this dataset |
| `PIPELINE_{ID}_API_KEY` | No | Optional API key for this dataset |

Each pipeline has a default timeout of 300,000ms (5 minutes).

#### Legacy Webhook Configuration (Fallback)

Used when no `datasetId` is provided in the request, or when the provided `datasetId` has no matching pipeline config.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WEBHOOK_BASE_URL` | No* | - | Aparavi webhook endpoint URL |
| `WEBHOOK_AUTHORIZATION_KEY` | No* | - | Authorization key for webhook |
| `WEBHOOK_TOKEN` | No* | - | Authentication token |

*At least one configuration source is required — either `PIPELINE_*` or `WEBHOOK_*` variables.

#### Server Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `FRONTEND_URL` | No | `http://localhost:3000` | Frontend URL for CORS |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |
| `LOG_LEVEL` | No | `info` | Logging level |

### 3. Start Development Server

```bash
# With hot reload
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint
```

The server will start on `http://localhost:3001` with hot reload enabled via `ts-node-dev`.

## Testing Pipelines

### Chat API Endpoint

**Endpoint:** `POST /api/chat`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | `string` | No* | Text message to send to the pipeline |
| `data` | `object` | No* | Arbitrary data object to send |
| `datasetId` | `string` | No | Selects which pipeline to use (e.g., `epstein`, `jfk`, `ufo`) |
| `fingerprint` | `object` | No | Browser fingerprint data for rate limiting |

*Either `message` or `data` is required.

**Pipeline Selection Logic:**

1. If `datasetId` is provided and matches a `PIPELINE_{DATASET_ID}_*` config → uses that pipeline
2. If no `datasetId` or no match → falls back to legacy `WEBHOOK_*` config
3. If neither exists → returns HTTP 400

### Example Requests

```bash
# Test a specific dataset pipeline
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What can you tell me about this?", "datasetId": "epstein"}'

# Test a different dataset
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Search query here", "datasetId": "jfk"}'

# Send structured data instead of a message
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"data": {"query": "search terms"}, "datasetId": "ufo"}'

# Test legacy webhook fallback (no datasetId)
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Uses default WEBHOOK_* config"}'
```

### Response Format

```json
{
  "success": true,
  "message": "Response text from the pipeline",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "metadata": {
    "processingTime": "1234ms"
  }
}
```

### Error Responses

| Status | Cause |
|--------|-------|
| 400 | Missing `message` and `data`, or no pipeline config found for `datasetId` |
| 429 | Rate limit exceeded (100 requests per 15 minutes) |
| 504 | Pipeline processing timeout (5 minutes) |

## Production Deployment

### Build

```bash
pnpm build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Start Production Server

```bash
pnpm start
```

### Docker Deployment

**Build and run:**
```bash
docker build -t aparavi-backend .
docker run -p 3001:3001 --env-file .env aparavi-backend
```

**Using Docker Compose:**
```bash
docker-compose up -d
```

### PM2 Deployment

```bash
# Install PM2 globally
npm install -g pm2

# Build the project
pnpm build

# Start with PM2
pm2 start dist/server.js --name aparavi-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Environment Setup

For production, ensure you set:
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Configure one or more pipelines
PIPELINE_EPSTEIN_BASE_URL=https://your-production-webhook.com/epstein
PIPELINE_EPSTEIN_AUTHORIZATION_KEY=your_prod_key
PIPELINE_EPSTEIN_TOKEN=your_prod_token

# Or use legacy single webhook
WEBHOOK_BASE_URL=https://your-production-webhook.com
WEBHOOK_AUTHORIZATION_KEY=your_prod_key
WEBHOOK_TOKEN=your_prod_token
```

## Security Features

- **Helmet.js**: Security headers (XSS protection, CSP, etc.)
- **CORS**: Restricted to configured frontend origin
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Request validation before processing
- **Error Handling**: Secure error messages (details hidden in production)

## License

MIT
