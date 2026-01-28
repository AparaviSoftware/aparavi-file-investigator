# Frontend References

## React Client (`packages/client/src/`)

| File | Purpose |
|------|---------|
| `App.tsx` | React Router setup |
| `pages/Home/index.tsx` | Dataset selection page |
| `pages/FilesChatbot/index.tsx` | Main chat interface |
| `services/api.ts` | Backend API communication |
| `services/conversationStorage.ts` | LocalStorage persistence |
| `services/fingerprint.ts` | Browser fingerprinting |
| `translations/en.tsx` | UI strings and dataset content |

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Dataset selection cards |
| `/chat/:datasetId` | FilesChatbot | Chat interface for specific dataset |
| `*` | Redirect | Redirects to home |

## Services

### api.ts
- `sendChatMessage(message, datasetId?)` — POST to `/api/chat`
- Includes fingerprint data in requests
- Supports Express and Lambda backends via `VITE_BACKEND_TYPE`

### conversationStorage.ts
- Per-dataset LocalStorage persistence
- `loadConversation(datasetId)` — Load or create conversation
- `addUserMessage()` / `addAssistantMessage()` — Add messages
- `editMessage()` / `trackRegeneration()` — Message modifications
- `hasReachedQueryLimit()` — Check 25-query limit
- `clearConversation()` — Reset conversation

### fingerprint.ts
- Generates browser fingerprint for rate limiting
- Collects: browser, OS, device type, screen resolution, timezone, language
