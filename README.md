# Aparavi Pipeline Chat Application

A full-stack chat interface for interacting with Aparavi data pipelines. This monorepo contains both the frontend React application and the backend Express proxy server.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Production](#production)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This application provides a clean, Claude-inspired chat interface for interacting with Aparavi data pipeline webhooks. The system consists of two main components:

- **client** - React frontend with Vite (runs on port 3000)
- **app** - TypeScript/Express backend proxy (runs on port 3001)

The backend acts as a secure proxy between the frontend and the Aparavi webhook, handling authentication, rate limiting, error handling, and response processing.

## 🏗️ Architecture

### System Flow

The application supports two backend architectures:

#### Express Backend (Traditional)
```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser   │────────▶│   Frontend   │────────▶│    Backend   │
│  (Port 3000)│         │  (React/Vite)│         │  (Express)   │
└─────────────┘         └──────────────┘         └──────────────┘
                                                          │
                                                          ▼
                                                  ┌──────────────┐
                                                  │ Aparavi      │
                                                  │ Webhook API  │
                                                  └──────────────┘
```

#### Lambda Backend (Serverless)
```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser   │────────▶│   Frontend   │────────▶│  AWS Lambda  │
│  (Port 3000)│         │  (React/Vite)│         │   Function   │
└─────────────┘         └──────────────┘         └──────────────┘
                                                          │
                                                          ▼
                                                  ┌──────────────┐
                                                  │ Aparavi      │
                                                  │ Webhook API  │
                                                  └──────────────┘
```

### Component Responsibilities

**Frontend (client)**
- Provides the user interface (Claude-inspired chat UI)
- Handles user input and file uploads
- Displays messages with markdown support
- Manages conversation state
- Communicates with backend via REST API

**Backend (app)**
- Validates and processes incoming requests
- Handles authentication with Aparavi webhook
- Implements rate limiting and security headers
- Proxies requests to Aparavi webhook API
- Extracts and formats pipeline responses
- Provides error handling and logging

### Data Flow

1. User sends a message or uploads a file in the frontend
2. Frontend sends POST request to `/api/chat` on backend
3. Backend validates request and adds authentication headers
4. Backend forwards request to Aparavi webhook (PUT request)
5. Backend receives response and extracts relevant data
6. Backend formats response and sends back to frontend
7. Frontend displays the response with markdown rendering

## 🛠️ Tech Stack

### Frontend (client)
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Markdown** - Markdown rendering for responses
- **CSS Modules** - Component-scoped styling

### Backend (app)
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Axios** - HTTP client for webhook requests
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin resource sharing

### Monorepo Tools
- **pnpm** - Package manager with workspace support
- **concurrently** - Run multiple services simultaneously

## 📁 Project Structure

```
aparavi-file-investigator/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── About.tsx      # About page component
│   │   │   ├── ChatInput.tsx  # Message input component
│   │   │   ├── ChatMessage.tsx # Message display component
│   │   │   └── LoadingDots.tsx # Loading animation
│   │   ├── services/
│   │   │   └── api.ts         # API client for backend
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript type definitions
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   ├── vite.config.ts         # Vite configuration
│   └── tsconfig.json
│
├── app/            # Backend Express server
│   ├── src/
│   │   ├── server.ts          # Main Express application
│   │   ├── config/
│   │   │   └── index.ts       # Configuration management
│   │   ├── middleware/
│   │   │   └── errorHandler.ts # Error handling middleware
│   │   ├── types/
│   │   │   ├── index.ts       # Type definitions
│   │   │   └── express.d.ts   # Express type extensions
│   │   └── utils/
│   │       └── extractOutput.ts # Response parsing utility
│   ├── dist/                  # Compiled JavaScript (generated)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── lambda/         # AWS Lambda function (alternative to Express)
│   ├── src/
│   │   ├── handler.ts         # Main Lambda handler
│   │   ├── config/            # Configuration management
│   │   ├── types/             # Type definitions
│   │   └── utils/             # Utility functions
│   ├── dist/                  # Compiled JavaScript (generated)
│   ├── function.zip           # Lambda deployment package (generated)
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md              # Lambda-specific documentation
│
├── package.json               # Root package.json (monorepo orchestration)
├── pnpm-workspace.yaml        # pnpm workspace configuration
└── README.md                  # This file
```

## 📦 Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

### Installing pnpm

```bash
# Using npm
npm install -g pnpm

# Using Corepack (recommended, built into Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate

# Using Homebrew (macOS)
brew install pnpm
```

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Install all dependencies for both projects
pnpm install
```

This will install dependencies for both `client` and `app` using pnpm workspaces.

### 2. Configure Environment Variables

#### Backend Configuration (`app/.env`)

Create a `.env` file in the `app` directory:

```bash
cd app
cp .env.example .env  # If .env.example exists
```

Required variables:
```env
WEBHOOK_BASE_URL=https://your-aparavi-webhook-url.com
WEBHOOK_API_KEY=your-api-key-here
```

Optional variables:
```env
PORT=3001                                    # Backend server port (default: 3001)
NODE_ENV=development                         # Environment (development/production)
FRONTEND_URL=http://localhost:3000          # Frontend URL for CORS
RATE_LIMIT_WINDOW_MS=900000                  # Rate limit window (15 minutes)
RATE_LIMIT_MAX_REQUESTS=100                  # Max requests per window
```

#### Frontend Configuration (`client/.env`)

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:3001           # Backend API URL
```

### 3. Start Development Servers

**Option 1: Start Both (Express Backend)**
```bash
pnpm dev
```

This starts both services simultaneously:
- **Backend**: `http://localhost:3001` (with hot reload via ts-node-dev)
- **Frontend**: `http://localhost:3000` (with Vite HMR)

The output will be color-coded:
- 🔵 **Blue** = Backend logs
- 🟢 **Green** = Frontend logs

**Option 2: Start Frontend Only (Lambda Backend)**
```bash
pnpm dev:client
```

This starts only the frontend on `http://localhost:3000` when using Lambda.

**Option 3: Start Backend Only**
```bash
pnpm dev:app
```

This starts only the backend on `http://localhost:3001` for testing.

### 4. Start Production Build

```bash
pnpm start
```

This will:
1. Build both frontend and backend
2. Start the backend production server
3. Start the frontend preview server

## ⚙️ Environment Configuration

### Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WEBHOOK_BASE_URL` | ✅ Yes | - | Aparavi webhook endpoint URL |
| `WEBHOOK_API_KEY` | ✅ Yes | - | API key for webhook authentication |
| `PORT` | No | `3001` | Backend server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `FRONTEND_URL` | No | `http://localhost:3000` | Frontend origin for CORS |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit time window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |

## 🔀 Backend Type Configuration

The application supports two backend architectures:
1. **Express** - Traditional Node.js/Express server (default)
2. **Lambda** - Serverless AWS Lambda function

### Choosing Your Backend

#### Option 1: Express Backend (Default)

**When to use:**
- Local development
- Self-hosted deployments
- Traditional server infrastructure

**Configuration:**

Backend (`app/.env`):
```env
BACKEND_TYPE=express
```

Frontend (`client/.env`):
```env
VITE_BACKEND_TYPE=express
VITE_API_URL=http://localhost:3001
```

**Starting the servers:**
```bash
pnpm dev
```

This starts both the Express backend (port 3001) and frontend (port 3000).

#### Option 2: AWS Lambda Backend

**When to use:**
- Serverless deployments
- AWS infrastructure
- Cost-optimized scaling

**Prerequisites:**
- Deploy the Lambda function (see `lambda/README.md`)
- Set up Lambda Function URL or API Gateway endpoint

**Configuration:**

Backend (`app/.env`):
```env
BACKEND_TYPE=lambda
```

Frontend (`client/.env`):
```env
VITE_BACKEND_TYPE=lambda
VITE_LAMBDA_URL=https://your-function-url.lambda-url.us-east-1.on.aws
```

**Lambda Deployment:**

1. Build and deploy the Lambda function:
   ```bash
   cd lambda
   pnpm package
   # Upload function.zip to AWS Lambda
   ```

2. Create a **Lambda Function URL** or **API Gateway** endpoint:
   - **Function URL** (simpler): Enable Function URL in Lambda console
   - **API Gateway** (more features): Create REST API with Lambda integration

3. Set the function URL in `client/.env`:
   ```env
   VITE_LAMBDA_URL=https://abcd1234.lambda-url.us-east-1.on.aws
   ```

**Starting with Lambda backend:**
```bash
# Only start the frontend (no backend needed)
pnpm dev:client
```

This starts only the frontend on port 3000. The frontend will make HTTP requests directly to your Lambda Function URL.

**Note:** You can still run `pnpm dev` if you want - the Express server will show a message that it's in Lambda mode and won't actually start the HTTP server.

### Frontend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | `http://localhost:3001` | Backend API base URL |

**Note**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

## 💻 Development

### Available Scripts

From the **root directory**:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both services in development mode with hot reload |
| `pnpm start` | Build and start both services in production mode |
| `pnpm build` | Build both frontend and backend |
| `pnpm install:all` | Install dependencies for all workspace packages |

### Running Individual Services

You can also run services individually:

**Backend only:**
```bash
cd app
pnpm dev        # Development mode
pnpm build      # Build TypeScript
pnpm start      # Production mode
```

**Frontend only:**
```bash
cd client
pnpm dev        # Development server
pnpm build      # Production build
pnpm preview    # Preview production build
```

### Development Workflow

1. **Make changes** to either frontend or backend code
2. **Hot reload** will automatically refresh:
   - Backend: `ts-node-dev` watches for TypeScript changes
   - Frontend: Vite HMR updates React components instantly
3. **Check logs** in the terminal (color-coded by service)
4. **Test** your changes in the browser at `http://localhost:3000`

### Type Checking

```bash
# Check backend types
cd app
pnpm type-check

# Check frontend types
cd client
pnpm type-check
```

### Linting

```bash
# Lint backend
cd app
pnpm lint

# Lint frontend
cd client
pnpm lint
```

## 🚢 Production

### Building for Production

```bash
# Build both services
pnpm build
```

This will:
- Compile TypeScript in `app` → `dist/`
- Build React app in `client` → `dist/`

### Running Production Build

```bash
pnpm start
```

### Docker Deployment

#### Backend Only

```bash
cd app
docker build -t aparavi-backend .
docker run -p 3001:3001 --env-file .env aparavi-backend
```

#### Using Docker Compose

```bash
cd app
docker-compose up -d
```

#### Frontend Deployment

The frontend can be deployed to any static hosting service:

**Vercel/Netlify:**
```bash
cd client
pnpm build
# Deploy the dist/ folder
```

**Nginx:**
```bash
cd client
pnpm build
# Copy dist/ to nginx html directory
```

### Environment Setup for Production

Make sure to set `NODE_ENV=production` in your backend `.env` file:

```env
NODE_ENV=production
WEBHOOK_BASE_URL=https://your-production-webhook-url.com
WEBHOOK_API_KEY=your-production-api-key
FRONTEND_URL=https://your-frontend-domain.com
```

## 📡 API Documentation

### Backend Endpoints

#### `POST /api/chat`

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

**Response:**
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

#### `GET /`

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

### Rate Limiting

- **Window**: 15 minutes (configurable via `RATE_LIMIT_WINDOW_MS`)
- **Max Requests**: 100 per window (configurable via `RATE_LIMIT_MAX_REQUESTS`)
- **Scope**: Applied to `/api/*` routes only

### Security Features

- **Helmet.js**: Security headers (XSS protection, content security policy, etc.)
- **CORS**: Configured for frontend origin only
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Request validation before processing
- **Error Handling**: Secure error messages (details hidden in production)

## 🐛 Troubleshooting

### Common Issues

#### "No projects matched the filters"

**Problem**: pnpm can't find the workspace packages.

**Solution**: Make sure `pnpm-workspace.yaml` exists in the root and contains:
```yaml
packages:
  - 'app'
  - 'client'
```

#### Backend won't start - "Missing required environment variables"

**Problem**: Required environment variables not set.

**Solution**: Create `.env` file in `app/` with:
```env
WEBHOOK_BASE_URL=your-url
WEBHOOK_API_KEY=your-key
```

#### CORS errors in browser

**Problem**: Frontend can't connect to backend.

**Solution**: 
1. Check `FRONTEND_URL` in backend `.env` matches your frontend URL
2. Verify backend is running on port 3001
3. Check `VITE_API_URL` in frontend `.env`

#### TypeScript build errors

**Problem**: Type errors preventing build.

**Solution**: 
```bash
# Check for type errors
cd app
pnpm type-check

# Fix unused variable warnings by prefixing with underscore: _req, _res, _next
```

#### Port already in use

**Problem**: Port 3000 or 3001 is already occupied.

**Solution**: 
- Change backend port: Set `PORT=3002` in `app/.env`
- Change frontend port: Update `vite.config.ts` or use `--port` flag

#### Webhook timeout errors

**Problem**: Pipeline takes too long to respond.

**Solution**: Increase timeout in `app/src/config/index.ts` (default: 5 minutes)

### Getting Help

1. Check the logs in the terminal (color-coded by service)
2. Verify environment variables are set correctly
3. Ensure both services are running (`pnpm dev`)
4. Check browser console for frontend errors
5. Check backend terminal output for API errors

## 📝 Additional Notes

### Monorepo Benefits

- **Shared dependencies**: pnpm hoists common dependencies to reduce disk usage
- **Unified commands**: Run both services with a single command
- **Consistent tooling**: Same package manager and Node.js version across projects
- **Independent deployment**: Each service can still be deployed separately

### Development Tips

- Use `pnpm dev` for development (hot reload enabled)
- Backend changes require TypeScript compilation in production
- Frontend changes are instantly reflected via Vite HMR
- Check terminal output for colored logs (blue=backend, green=frontend)
- Use browser DevTools Network tab to debug API calls

### Security Considerations

- Never commit `.env` files to version control
- Use strong API keys for production
- Configure CORS properly for production domains
- Keep dependencies updated (`pnpm outdated`)
- Review rate limit settings for your use case

## 📄 License

MIT
