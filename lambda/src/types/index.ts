// ============================================================================
// Configuration Types
// ============================================================================

export interface Config {
	webhook: {
		baseUrl: string;
		apiKey: string;
		authorizationKey: string;
		token: string;
		timeout: number;
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
// Lambda Types
// ============================================================================

export interface LambdaEvent {
	body?: string;
	message?: string;
	data?: Record<string, any>;
	httpMethod?: string;
	path?: string;
	headers?: Record<string, string>;
}

export interface LambdaResponse {
	statusCode: number;
	headers?: Record<string, string>;
	body: string;
}

// ============================================================================
// Error Types
// ============================================================================

export class LambdaError extends Error {
	statusCode: number;
	details?: any;

	constructor(message: string, statusCode: number = 500, details?: any) {
		super(message);
		this.name = 'LambdaError';
		this.statusCode = statusCode;
		this.details = details;
	}
}
