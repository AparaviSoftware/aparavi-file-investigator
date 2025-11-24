// ============================================================================
// Configuration Types
// ============================================================================

export interface Config {
  port: number;
  nodeEnv: string;
  frontend: {
    url: string;
  };
  webhook: {
    baseUrl: string;
    apiKey: string;
    timeout: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  validate: () => void;
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface ChatRequestBody {
  message?: string;
  data?: Record<string, any>;
}

export interface ChatResponse {
  success: boolean;
  result: any;
  metadata?: {
    timestamp: string;
    processingTime?: string;
  };
}

export interface ErrorResponse {
  error: boolean;
  message: string;
  details?: any;
  stack?: string;
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface WebhookResponse {
  data?: {
    objects?: {
      [key: string]: {
        text?: string;
        [key: string]: any;
      };
    };
  };
  [key: string]: any;
}

export interface WebhookRequestConfig {
  headers: {
    'Content-Type': string;
    Authorization: string;
  };
  params: {
    apikey: string;
  };
  timeout: number;
  validateStatus?: (status: number) => boolean;
  maxBodyLength?: number;
  maxContentLength?: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}