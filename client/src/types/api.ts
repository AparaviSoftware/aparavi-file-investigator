export interface ChatRequestBody {
	message?: string;
	data?: any;
}

export interface ChatResponse {
	success: boolean;
	message: string;
	timestamp: string;
}

export interface ErrorResponse {
	error: true;
	message: string;
	details?: any;
	stack?: string;
	path?: string;
}
