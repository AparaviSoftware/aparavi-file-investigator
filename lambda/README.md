# Aparavi Chat Lambda Function

AWS Lambda function providing serverless chat functionality for Aparavi data pipelines. Alternative to the Express backend for serverless deployments.

## Features

- **Serverless**: AWS Lambda-based deployment
- **Webhook Integration**: Forwards requests to Aparavi pipeline webhooks
- **Error Handling**: Comprehensive error handling with CloudWatch logging
- **Response Processing**: Extracts and formats pipeline output
- **TypeScript**: Full type safety
- **Lambda-ready**: Packaged and optimized for AWS deployment

## Prerequisites

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 8.0.0 ([Install guide](https://pnpm.io/installation))
- **AWS Account** ([Sign up](https://aws.amazon.com/))
- **AWS CLI** (optional, for CLI deployment) ([Install guide](https://aws.amazon.com/cli/))

## Development Setup

### 1. Install Dependencies

```bash
cd lambda
pnpm install
```

### 2. Configure Environment Variables

The Lambda function requires these environment variables (configured in AWS Lambda console):

```env
WEBHOOK_BASE_URL=https://your-webhook-url.com
WEBHOOK_AUTHORIZATION_KEY=your_authorization_key
WEBHOOK_TOKEN=your_token
```

For local testing, create a `.env` file:
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Build and Package

```bash
# Build TypeScript
pnpm build

# Package for Lambda deployment
pnpm package
```

This creates `function.zip` ready for upload to AWS Lambda.

### Development Commands

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Clean build artifacts
pnpm clean
```

## Deployment

### Option 1: AWS Console (Recommended for First Deployment)

1. **Build and package:**
   ```bash
   pnpm package
   ```

2. **Create Lambda function:**
   - Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda)
   - Click "Create function"
   - Choose "Author from scratch"
   - Function name: `aparavi-chat-lambda`
   - Runtime: Node.js 18.x or higher
   - Click "Create function"

3. **Upload code:**
   - In the "Code" tab, click "Upload from" → ".zip file"
   - Upload `function.zip`
   - Click "Save"

4. **Configure handler:**
   - In "Runtime settings", set Handler to: `handler.handler`

5. **Set environment variables:**
   - Go to "Configuration" → "Environment variables"
   - Add:
     - `WEBHOOK_BASE_URL`
     - `WEBHOOK_AUTHORIZATION_KEY`
     - `WEBHOOK_TOKEN`

6. **Adjust timeout:**
   - Go to "Configuration" → "General configuration"
   - Set timeout to **5 minutes (300 seconds)** to match webhook timeout

7. **Set up HTTP access** (choose one):

   **Option A: Lambda Function URL** (Simpler)
   - Go to "Configuration" → "Function URL"
   - Click "Create function URL"
   - Auth type: `NONE` (or `AWS_IAM` for authentication)
   - Configure CORS:
     - Allow origin: `*` or your frontend domain
     - Allow methods: `POST`
     - Allow headers: `Content-Type`
   - Save and copy the Function URL

   **Option B: API Gateway** (More features)
   - Create a new REST API in [API Gateway Console](https://console.aws.amazon.com/apigateway)
   - Create a `POST` method at root (`/`)
   - Integration: Lambda Function (enable Lambda Proxy Integration)
   - Select your Lambda function
   - Enable CORS
   - Deploy to a stage (e.g., `prod`)
   - Copy the invoke URL

8. **Update frontend configuration:**

   In `client/.env`:
   ```env
   VITE_BACKEND_TYPE=lambda
   VITE_LAMBDA_URL=https://your-function-url.lambda-url.us-east-1.on.aws
   ```

### Option 2: AWS CLI

```bash
# Build and package
pnpm package

# Create Lambda function
aws lambda create-function \
  --function-name aparavi-chat-lambda \
  --runtime nodejs18.x \
  --handler handler.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
  --timeout 300 \
  --environment Variables="{WEBHOOK_BASE_URL=https://...,WEBHOOK_AUTHORIZATION_KEY=...,WEBHOOK_TOKEN=...}"

# Update existing function
aws lambda update-function-code \
  --function-name aparavi-chat-lambda \
  --zip-file fileb://function.zip
```

### Option 3: Serverless Framework / SAM

For infrastructure-as-code deployment, consider using:
- [AWS SAM](https://aws.amazon.com/serverless/sam/)
- [Serverless Framework](https://www.serverless.com/)
- [Terraform](https://www.terraform.io/)

## Configuration

### Timeout Settings

The webhook has a 5-minute timeout. Ensure your Lambda timeout is set to at least **5 minutes (300 seconds)**.

### Memory Settings

Recommended: 512 MB (adjust based on actual usage in CloudWatch metrics)

### Cold Start Optimization

- Keep dependencies minimal
- Use Lambda provisioned concurrency for critical workloads
- Monitor cold start metrics in CloudWatch

## Switching from Express to Lambda

1. Deploy Lambda function (follow deployment steps above)
2. Update `client/.env`:
   ```env
   VITE_BACKEND_TYPE=lambda
   VITE_LAMBDA_URL=https://your-function-url.lambda-url.us-east-1.on.aws
   ```
3. Rebuild and redeploy frontend: `pnpm build`
4. Decommission Express server if no longer needed

## Switching from Lambda to Express

1. Start Express backend (see [app/README.md](../app/README.md))
2. Update `client/.env`:
   ```env
   VITE_BACKEND_TYPE=express
   VITE_API_URL=http://localhost:3001
   ```
3. Rebuild frontend: `pnpm build`

## License

MIT
