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

export interface WebhookConfig {
	baseUrl: string;
	authorizationKey: string;
	token: string;
	timeout: number;
}

// ============================================================================
// Service Response Types
// ============================================================================

export interface ChatServiceResult {
	success: boolean;
	message: string;
	timestamp: string;
	metadata?: {
		processingTime?: string;
	};
	error?: {
		message: string;
		statusCode: number;
		details?: any;
	};
}
