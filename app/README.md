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
cd app
pnpm install
```

### 2. Configure Environment

Create a `.env` file in the `app/` directory:

```env
# Required
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

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WEBHOOK_BASE_URL` | Yes | - | Aparavi webhook endpoint URL |
| `WEBHOOK_AUTHORIZATION_KEY` | Yes | - | Authorization key for webhook |
| `WEBHOOK_TOKEN` | Yes | - | Authentication token |
| `PORT` | No | `3001` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `FRONTEND_URL` | No | `http://localhost:3000` | Frontend URL for CORS |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |

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
WEBHOOK_BASE_URL=https://your-production-webhook.com
WEBHOOK_AUTHORIZATION_KEY=your_prod_key
WEBHOOK_TOKEN=your_prod_token
FRONTEND_URL=https://your-frontend-domain.com
```

## API Endpoints

### `POST /api/chat`

Send a message to the Aparavi pipeline.

**Request:**
```json
{
  "message": "Your message here"
}
```

Or with custom data:
```json
{
  "data": {
    "text": "Your message",
    "customField": "value"
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "result": "Pipeline response text or object",
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "processingTime": "1234ms"
  }
}
```

**Error Response:**
```json
{
  "error": true,
  "message": "Error message",
  "details": {}
}
```

### `GET /`

Root endpoint with API information.

**Response:**
```json
{
  "name": "Aparavi Pipeline Chat Backend",
  "version": "1.0.0",
  "endpoints": {
    "chat": "POST /api/chat"
  }
}
```

## Project Structure

```
app/
├── src/
│   ├── server.ts               # Main Express application
│   ├── config/
│   │   └── index.ts           # Configuration management
│   ├── router/
│   │   ├── index.ts
│   │   └── router.ts          # Auto-discovers component routes
│   ├── components/
│   │   └── chat/
│   │       ├── routes.ts      # Chat endpoint routes
│   │       └── controller.ts  # Chat business logic
│   ├── middleware/
│   │   └── errorHandler.ts   # Error handling middleware
│   ├── utils/
│   │   ├── callout.ts        # Promise wrapper utility
│   │   └── extractOutput.ts  # Response parsing
│   ├── translations/          # i18n translations
│   └── types/
│       ├── index.ts          # Type definitions
│       └── express.d.ts      # Express type extensions
├── dist/                      # Compiled output (generated)
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Security Features

- **Helmet.js**: Security headers (XSS protection, CSP, etc.)
- **CORS**: Restricted to configured frontend origin
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Request validation before processing
- **Error Handling**: Secure error messages (details hidden in production)

## Troubleshooting

### Missing Environment Variables

**Error**: "Missing required environment variables"

**Solution**: Ensure `.env` file exists with all required variables:
```env
WEBHOOK_BASE_URL=...
WEBHOOK_AUTHORIZATION_KEY=...
WEBHOOK_TOKEN=...
```

### CORS Errors

**Error**: CORS policy blocking requests

**Solution**:
1. Check `FRONTEND_URL` in `.env` matches your frontend URL
2. Verify frontend is making requests to the correct backend URL
3. Ensure backend is running

### Port Already in Use

**Error**: "Port 3001 is already in use"

**Solution**: Change the port in `.env`:
```env
PORT=3002
```

### Webhook Timeout

**Error**: Request timeout

**Solution**: The default webhook timeout is 5 minutes. For longer operations, adjust the timeout in `src/config/index.ts`.

## Development Tips

- Use `pnpm dev` for hot reload during development
- Check logs for detailed error information
- Use `pnpm type-check` before committing
- Follow coding standards in [CLAUDE.md](../CLAUDE.md)

## License

MIT
