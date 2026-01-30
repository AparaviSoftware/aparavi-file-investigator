# Monorepo Migration Guide

## What Was Done

Your project has been successfully migrated from a flat structure to a **pnpm workspace monorepo**. Here's what changed:

### New Structure

```
aparavi-file-investigator/
├── packages/
│   ├── chat-core/          # NEW - Shared chat logic
│   │   ├── src/
│   │   │   ├── service/
│   │   │   │   └── chatService.ts    # Core business logic
│   │   │   ├── utils/
│   │   │   │   ├── callout.ts
│   │   │   │   ├── pipelineOutput.ts
│   │   │   │   └── webhook.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts          # Shared types
│   │   │   └── index.ts              # Package exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── express-app/        # MOVED from app/
│   │   └── [existing Express app code]
│   └── client/             # MOVED from client/
│       └── [existing React app code]
├── app/                    # OLD - Can be deleted after verification
├── client/                 # OLD - Can be deleted after verification
├── package.json            # UPDATED - Workspace configuration
├── pnpm-workspace.yaml     # UPDATED - Points to packages/*
└── MIGRATION_GUIDE.md      # This file
```

### What's in `chat-core`?

The **@aparavi/chat-core** package now contains:

1. **ChatService** - Core business logic for processing chat requests (extracted from the Express controller)
2. **Utilities**:
   - `Callout` - Promise error handling
   - `PipelineOutput` - Webhook response parsing
   - `Webhook` - Webhook request/response formatting
3. **Shared Types** - TypeScript interfaces used across packages

### Changes Made

#### Root `package.json`
- Added `"workspaces": ["packages/*"]`
- Updated all scripts to use new package names:
  - `@aparavi/chat-core`
  - `@aparavi/express-app`
  - `@aparavi/client`

#### `pnpm-workspace.yaml`
- Updated to point to `packages/*` instead of `app` and `client`

#### `packages/express-app/`
- Updated `package.json`:
  - Name changed to `@aparavi/express-app`
  - Added dependency: `"@aparavi/chat-core": "workspace:*"`
- Updated `src/api/components/chat/controller.ts`:
  - Now imports `ChatService` from `@aparavi/chat-core`
  - Simplified to use the shared service instead of duplicating logic
- Updated `src/api/utils/index.ts`:
  - Removed exports for `Callout`, `PipelineOutput`, and `Webhook` (now from chat-core)
  - Only exports `Logger` (Express-specific utility)

#### `packages/client/`
- Updated `package.json`:
  - Name changed to `@aparavi/client`

## Next Steps - Manual Actions Required

Due to file locks (likely from a running dev server), you need to complete the migration manually:

### 1. Stop All Running Processes
```bash
# Stop any running dev servers, test watchers, etc.
# Press Ctrl+C in any terminal windows running dev/test commands
```

### 2. Clean Up Node Modules
```bash
# Delete all node_modules to start fresh
rm -rf node_modules
rm -rf app/node_modules
rm -rf client/node_modules
rm -rf packages/chat-core/node_modules
rm -rf packages/express-app/node_modules
rm -rf packages/client/node_modules
```

### 3. Install Dependencies
```bash
# From the root directory
pnpm install
```

This will:
- Install dependencies for all packages
- Link `@aparavi/chat-core` to `@aparavi/express-app`
- Set up the workspace properly

### 4. Build the Monorepo
```bash
# Build all packages in order (chat-core must build first)
pnpm build
```

This runs:
1. `pnpm --filter @aparavi/chat-core build`
2. `pnpm --filter @aparavi/express-app build`
3. `pnpm --filter @aparavi/client build`

### 5. Test Everything Works
```bash
# Run tests
pnpm test

# Start dev servers
pnpm dev
```

### 6. Clean Up Old Directories (After Verification)
Once everything works, you can safely delete:
```bash
rm -rf app/
rm -rf client/
```

## Usage

### Development
```bash
# Start all dev servers (backend + frontend)
pnpm dev

# Start only backend
pnpm dev:app

# Start only frontend
pnpm dev:client
```

### Building
```bash
# Build everything
pnpm build

# Build individual packages
pnpm build:chat-core
pnpm --filter @aparavi/express-app build
pnpm --filter @aparavi/client build
```

### Testing
```bash
# Run all tests
pnpm test

# Test individual packages
pnpm test:chat-core
pnpm test:app
pnpm test:client
```

## Benefits

1. **Single Source of Truth**: Chat logic lives in one place (`packages/chat-core`)
2. **Code Reuse**: Both Express and Lambda (future) can import the same logic
3. **Type Safety**: Shared types maintained across packages
4. **Easy to Add Lambda**: Just create `packages/lambda-handler` and import from `@aparavi/chat-core`
5. **Better Testing**: Test core logic independently of Express/Lambda specifics

## Adding Lambda Support (Future)

When you're ready to add Lambda support:

```bash
# Create new package
mkdir -p packages/lambda-handler/src
cd packages/lambda-handler

# Create package.json
{
  "name": "@aparavi/lambda-handler",
  "dependencies": {
    "@aparavi/chat-core": "workspace:*",
    "aws-lambda": "^1.0.7"
  }
}
```

```ts
// packages/lambda-handler/src/index.ts
import { ChatService } from '@aparavi/chat-core';

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const { datasetId } = body;

  // Use PIPELINE_{DATASET_ID}_* env vars for multi-pipeline support
  const prefix = datasetId
    ? `PIPELINE_${datasetId.toUpperCase()}_`
    : 'WEBHOOK_';

  const webhookConfig = {
    baseUrl: process.env[`${prefix}BASE_URL`] || '',
    authorizationKey: process.env[`${prefix}AUTHORIZATION_KEY`] || '',
    token: process.env[`${prefix}TOKEN`] || '',
    timeout: 300000
  };

  return await ChatService.processChat(body, webhookConfig);
};
```

## Troubleshooting

### "Cannot find module '@aparavi/chat-core'"
- Make sure you ran `pnpm install` from the root
- Make sure `chat-core` is built: `pnpm --filter @aparavi/chat-core build`

### Permission Errors During Install
- Stop all dev servers and test watchers
- Close your IDE/editor
- Delete all node_modules directories
- Run `pnpm install` again

### Build Errors
- Always build `chat-core` first: `pnpm --filter @aparavi/chat-core build`
- Then build other packages that depend on it

## Questions?

If you encounter issues, check:
1. All dev processes are stopped
2. All node_modules are deleted
3. You ran `pnpm install` from the root
4. You built packages in the correct order (chat-core → express-app → client)
