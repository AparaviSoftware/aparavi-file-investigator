# Aparavi Chat Lambda Function

AWS Lambda function that provides the same chat functionality as the Express server endpoint. Send a query and receive a processed response from the Aparavi webhook pipeline.

## Overview

This Lambda function replicates the `/api/chat` endpoint functionality from the Express backend. It accepts a message or data payload, forwards it to the configured Aparavi webhook, and returns the processed response.

## Features

- **Webhook Integration**: Forwards requests to Aparavi data pipeline webhooks
- **Error Handling**: Comprehensive error handling with detailed logging
- **Response Processing**: Extracts and formats pipeline output
- **TypeScript**: Fully typed for development safety
- **AWS Lambda**: Serverless deployment ready

## Requirements

- Node.js >= 18.0.0
- AWS Lambda runtime compatible with Node.js 18.x or higher
- Valid Aparavi webhook credentials

## Environment Variables

The Lambda function requires the following environment variables to be configured:

```env
WEBHOOK_BASE_URL=<your-webhook-url>
WEBHOOK_AUTHORIZATION_KEY=<your-authorization-key>
WEBHOOK_TOKEN=<your-webhook-token>
```

These should be configured in the Lambda function's environment settings in AWS.

## Installation

```bash
npm install
# or
pnpm install
```

## Building

```bash
npm run build
# or
pnpm build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

## Packaging for Lambda

```bash
npm run package
# or
pnpm package
```

This builds the project and creates a `function.zip` file ready for Lambda deployment.

**Note:** The package script uses cross-platform tools (`bestzip` and `rimraf`) that work on both Windows and Unix systems.

## Deployment

### Using AWS Console

1. Build and package the function:
   ```bash
   npm run package
   # or
   pnpm package
   ```

2. Upload `function.zip` to AWS Lambda console

3. Configure environment variables in Lambda settings

4. Set handler to: `handler.handler`

5. Configure appropriate timeout (recommended: 5 minutes to match webhook timeout)

### Using AWS CLI

```bash
# Build and package
npm run package
# or: pnpm package

# Create or update Lambda function
aws lambda update-function-code \
  --function-name aparavi-chat-lambda \
  --zip-file fileb://function.zip
```

## Usage

### Direct Invocation

```json
{
  "message": "What files were modified today?"
}
```

Or with data:

```json
{
  "data": {
    "query": "file statistics",
    "filters": {}
  }
}
```

### API Gateway Integration

When integrated with API Gateway, the function expects the request body in the `event.body` field (as a JSON string):

```json
{
  "body": "{\"message\":\"What files were modified today?\"}"
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Response from pipeline",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "metadata": {
    "processingTime": "1234ms"
  }
}
```

### Error Response

```json
{
  "error": true,
  "message": "Error description",
  "details": {}
}
```

## Project Structure

```
lambda/
├── src/
│   ├── config/
│   │   └── index.ts          # Configuration management
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── callout/          # Promise wrapper utility
│   │   ├── logger/           # Logging utility
│   │   ├── pipelineOutput/   # Response extraction utility
│   │   ├── webhook/          # Webhook integration utility
│   │   └── index.ts          # Utils barrel export
│   └── handler.ts            # Main Lambda handler
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## Development

### Type Checking

```bash
npm run type-check
# or
pnpm type-check
```

### Linting

```bash
npm run lint
# or
pnpm lint
```

### Clean Build

```bash
npm run clean
npm run build
# or
pnpm clean
pnpm build
```

## Error Handling

The Lambda function follows the same error handling patterns as the Express backend:

- Uses the `Callout` utility to wrap promises
- All errors are logged with context
- Appropriate HTTP status codes are returned
- Timeout errors (504) for webhook timeouts
- Validation errors (400) for malformed requests
- Server errors (500) for unexpected failures

## Logging

All operations are logged using the `Logger` utility:

- Info: Request processing, configuration validation
- Error: Webhook errors, parsing failures, unhandled exceptions

Logs are available in CloudWatch Logs for the Lambda function.

## Configuration Validation

On cold start, the Lambda validates that all required environment variables are present. Missing configuration will cause the function to fail immediately with a clear error message.

## Timeout Settings

The webhook has a 5-minute timeout. Ensure your Lambda function timeout is set to at least 5 minutes (300 seconds) to accommodate long-running pipeline operations.

## License

MIT
