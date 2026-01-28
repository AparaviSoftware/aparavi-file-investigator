# Backend References

## Express App (`packages/express-app/src/`)

| File | Purpose |
|------|---------|
| `bin/www.ts` | Server entry point, startup logging, graceful shutdown |
| `app.ts` | Express app setup, middleware stack |
| `api/config/index.ts` | Configuration loader, pipeline env var parsing |
| `api/router/router.ts` | Auto-discovery of component routes |
| `api/components/chat/controller.ts` | Chat endpoint request handler |
| `api/components/chat/routes.ts` | Chat route definitions |
| `api/middleware/error.ts` | AppError class, global error handler |
| `api/utils/logger.ts` | Logging abstraction |
| `api/types/index.ts` | Shared TypeScript types |

## Path Aliases

The backend uses TypeScript path aliases for clean imports:

| Alias | Path |
|-------|------|
| `@config` | `src/api/config` |
| `@utils` | `src/api/utils` |
| `@middleware` | `src/api/middleware` |
| `@types` | `src/api/types` |
| `@components` | `src/api/components` |
| `@router` | `src/api/router` |
| `@translations` | `src/api/translations` |
