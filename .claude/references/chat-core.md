# Chat-Core Library References

## Shared Library (`packages/chat-core/src/`)

| File | Purpose |
|------|---------|
| `service/chatService.ts` | Core chat processing logic |
| `utils/callout.ts` | Promise error wrapper `[err, data]` |
| `utils/webhook.ts` | Webhook payload/response formatting |
| `utils/pipelineOutput.ts` | Response data extraction |
| `types/index.ts` | Shared interfaces |

## Key Exports

### ChatService.processChat()
Main entry point for processing chat requests. Handles validation, webhook calls, and response formatting.

### Callout.call()
Promise wrapper that returns `[error, data]` tuple instead of throwing exceptions.

```ts
const [err, data] = await Callout.call(promise);
if (err) {
    // handle error
}
```

### Webhook Utilities
- `Webhook.buildPayload()` — Format message for webhook
- `Webhook.buildConfig()` — Build axios request config with auth
- `Webhook.formatError()` — Standardize error responses
- `Webhook.buildSuccessResponse()` — Format successful responses

### PipelineOutput.extract()
Extracts relevant data from webhook responses with fallback priorities:
1. First element of `answers` array
2. Text field from first object in `data.objects`
3. Full response data as fallback
