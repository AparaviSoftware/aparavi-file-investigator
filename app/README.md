# Aparavi Pipeline Chat Backend (TypeScript + pnpm)

Secure TypeScript/Node.js proxy server for Aparavi data pipeline webhook integration.

## Tech Stack

- **TypeScript** - Type-safe development
- **Express** - Web framework
- **Axios** - HTTP client
- **pnpm** - Fast, disk space efficient package manager

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Install pnpm
```bash
# Using npm
npm install -g pnpm

# Using Homebrew (macOS)
brew install pnpm

# Using Corepack (built into Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your actual webhook URL and API key
```

### 3. Development
```bash
# Run with hot reload
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### 4. Production Build
```bash
# Build TypeScript
pnpm build

# Start production server
pnpm start
```

### 5. Test
```bash
pnpm test
```

## Project Structure
```
pipeline-chat-backend/
├── src/
│   ├── server.ts              # Main application
│   ├── config/
│   │   └── index.ts          # Configuration
│   ├── middleware/
│   │   └── errorHandler.ts   # Error handling
│   ├── types/
│   │   ├── index.ts          # Type definitions
│   │   └── express.d.ts      # Express extensions
│   └── utils/
│       └── extractOutput.ts  # Helper functions
├── dist/                      # Compiled output (generated)
├── .npmrc                     # pnpm configuration
├── package.json
├── pnpm-lock.yaml            # Lock file (auto-generated)
└── tsconfig.json
```

## API Endpoints

### Text Chat
```bash
POST /api/chat
Content-Type: application/json

{
  "message": "Your text here"
}
```

## pnpm Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start development server |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Start production server |
| `pnpm test` | Run tests |
| `pnpm lint` | Run ESLint |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No | Server port (default: 3001) |
| WEBHOOK_BASE_URL | Yes | Your Aparavi webhook URL |
| WEBHOOK_API_KEY | Yes | Webhook API key |
| FRONTEND_URL | No | Frontend origin for CORS |
| NODE_ENV | No | Environment (development/production) |

## Production Deployment

### Docker
```bash
docker build -t pipeline-chat-backend .
docker run -p 3001:3001 --env-file .env pipeline-chat-backend
```

### Docker Compose
```bash
docker-compose up -d
```

### PM2
```bash
pnpm add -g pm2
pnpm build
pm2 start dist/server.js --name pipeline-backend
pm2 save
```

## License

MIT