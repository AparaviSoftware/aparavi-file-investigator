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
		authorizationKey: string;
		token: string;
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

export interface FingerprintData {
	fingerprint: string;
	browser: string;
	browserVersion: string;
	os: string;
	osVersion: string;
	device: string;
	deviceType: string;
	deviceVendor: string;
	cpu: string;
	screenResolution: string;
	colorDepth: number;
	timezone: string;
	language: string;
	userAgent: string;
}

export interface ChatRequestBody {
	message?: string;
	data?: Record<string, any>;
	fingerprint?: FingerprintData;
}

export interface ChatResponse {
	success: boolean;
	message: string;
	timestamp: string;
	metadata?: {
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
	answers?: string[];
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
		Authorization?: string;
	};
	params: {
		token: string;
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