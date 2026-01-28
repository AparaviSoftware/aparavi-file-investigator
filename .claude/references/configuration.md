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
# Multi-pipeline (per dataset)
PIPELINE_{DATASET_ID}_BASE_URL=
PIPELINE_{DATASET_ID}_AUTHORIZATION_KEY=
PIPELINE_{DATASET_ID}_TOKEN=

# Legacy single webhook (fallback)
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
```

### Frontend (`packages/client/.env`)
```env
VITE_API_URL=http://localhost:3001
VITE_BACKEND_TYPE=express
VITE_LAMBDA_URL=              # Required if VITE_BACKEND_TYPE=lambda
```
