import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import axios, { AxiosError } from 'axios';
import config from './config';
import { errorHandler, notFoundHandler, AppError } from './middleware/errorHandler';
import { extractPipelineOutput } from './utils/extractOutput';
import {
  ChatRequestBody,
  ChatResponse,
  WebhookResponse,
  WebhookRequestConfig
} from './types';

// Validate configuration on startup
try {
  config.validate();
} catch (error) {
  console.error('❌ Configuration error:', (error as Error).message);
  process.exit(1);
}

const app: Application = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: true,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Request logging (development only)
if (config.nodeEnv === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// ============================================================================
// ROUTES
// ============================================================================

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Aparavi Pipeline Chat Backend',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /api/chat'
    }
  });
});

// ============================================================================
// CHAT ENDPOINTS
// ============================================================================

// Text/JSON chat endpoint
app.post('/api/chat', async (req: Request<{}, ChatResponse, ChatRequestBody>, res: Response<ChatResponse>, next: NextFunction) => {
  try {
    const { message, data } = req.body;

    // Validation
    if (!message && !data) {
      throw new AppError('Either "message" or "data" field is required', 400);
    }

    console.log('Processing chat request:', {
      hasMessage: !!message,
      hasData: !!data
    });

    // Prepare payload
    const payload = data || { text: message };

    // Configure webhook request
    const webhookConfig: WebhookRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': config.webhook.apiKey
      },
      params: {
        apikey: config.webhook.apiKey
      },
      timeout: config.webhook.timeout,
      validateStatus: (status: number) => status < 500 // Don't throw on 4xx errors
    };

    // Make POST request to webhook
    const response = await axios.post<WebhookResponse>(
      config.webhook.baseUrl,
      payload,
      webhookConfig
    );

    // Handle non-200 responses
    if (response.status !== 200) {
      throw new AppError('Pipeline returned an error', response.status, response.data);
    }

    // Extract result
    const result = extractPipelineOutput(response.data);

    res.json({
      success: true,
      result,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTime: response.headers['x-response-time']
      }
    });

  } catch (error) {
    const axiosError = error as AxiosError;

    console.error('Chat endpoint error:', {
      message: (error as Error).message,
      response: axiosError.response?.data,
      status: axiosError.response?.status
    });

    if (axiosError.code === 'ECONNABORTED') {
      return next(new AppError('Pipeline processing timeout - request took too long', 504));
    }

    if (axiosError.response) {
      return next(new AppError(
        'Pipeline processing failed',
        axiosError.response.status,
        axiosError.response.data
      ));
    }

    next(error);
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

const server = app.listen(config.port, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 Aparavi Pipeline Chat Backend (TypeScript)');
  console.log('='.repeat(60));
  console.log(`📍 Server: http://localhost:${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Webhook: ${config.webhook.baseUrl}`);
  console.log(`🎨 Frontend: ${config.frontend.url}`);
  console.log('='.repeat(60));
  console.log('');
  console.log('Available endpoints:');
  console.log(`  POST /api/chat        - Text/JSON chat`);
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});

// Graceful shutdown
const shutdown = (): void => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;