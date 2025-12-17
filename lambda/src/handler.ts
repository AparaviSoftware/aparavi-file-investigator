import axios from 'axios';
import config from './config';
import { Callout, PipelineOutput, Logger, Webhook } from './utils';
import {
	LambdaEvent,
	LambdaResponse,
	ChatRequestBody,
	ChatResponse,
	WebhookResponse,
	ErrorResponse
} from './types';

/**
 * AWS Lambda handler for chat endpoint.
 * Processes chat requests by forwarding to webhook and returning processed response.
 *
 * @param {LambdaEvent} event - Lambda event object containing message or data
 *
 * @return {Promise<LambdaResponse>} Lambda response with status code and body
 *
 * @example
 *     const response = await handler({ message: "Hello" });
 */
export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
	try {
		// Handle CORS preflight requests
		if (event.httpMethod === 'OPTIONS') {
			return {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type'
				},
				body: ''
			};
		}

		// Validate configuration on cold start
		config.validate();

		// Parse event body if it's a string (API Gateway format)
		let requestBody: ChatRequestBody;
		if (typeof event.body === 'string') {
			try {
				requestBody = JSON.parse(event.body);
			} catch (parseError) {
				Logger.error('Failed to parse request body', { body: event.body });
				return buildErrorResponse('Invalid request body format', 400);
			}
		} else {
			// Direct invocation format
			requestBody = {
				message: event.message,
				data: event.data
			};
		}

		const { message, data } = requestBody;

		if (!message && !data) {
			return buildErrorResponse('Either message or data is required', 400);
		}

		Logger.info('Processing chat request', {
			hasMessage: !!message,
			hasData: !!data
		});

		const payload = Webhook.buildPayload(message, data);
		const webhookConfig = Webhook.buildConfig();

		const [error, response] = await Callout.call(
			axios.post<WebhookResponse>(
				config.webhook.baseUrl,
				payload,
				webhookConfig
			)
		);

		if (error) {
			const lambdaError = Webhook.handleError(error);
			return buildErrorResponse(
				lambdaError.message,
				lambdaError.statusCode,
				lambdaError.details
			);
		}

		if (response.status !== 200) {
			return buildErrorResponse(
				'Pipeline returned an error',
				response.status,
				response.data
			);
		}

		// Parse response data if it's a string
		let parsedData = response.data;
		if (typeof response.data === 'string') {
			try {
				parsedData = JSON.parse(response.data);
			} catch (parseError) {
				Logger.error('Failed to parse webhook response', { data: response.data });
				return buildErrorResponse('Invalid response format from webhook', 500);
			}
		}

		const result = PipelineOutput.extract(parsedData);
		const successResponse = Webhook.buildSuccessResponse(result, response.headers);

		return buildSuccessResponse(successResponse);

	} catch (error) {
		Logger.error('Unhandled error in Lambda handler', { error });
		const errorMessage = error instanceof Error ? error.message : 'Internal server error';
		return buildErrorResponse(errorMessage, 500);
	}
}

/**
 * Builds a successful Lambda response.
 *
 * @param {ChatResponse} data - The response data
 *
 * @return {LambdaResponse} Formatted Lambda response
 *
 * @example
 *     return buildSuccessResponse({ success: true, message: "Done" });
 */
function buildSuccessResponse(data: ChatResponse): LambdaResponse {
	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		},
		body: JSON.stringify(data)
	};
}

/**
 * Builds an error Lambda response.
 *
 * @param {string} message - The error message
 * @param {number} statusCode - The HTTP status code
 * @param {any} details - Optional error details
 *
 * @return {LambdaResponse} Formatted Lambda error response
 *
 * @example
 *     return buildErrorResponse("Not found", 404);
 */
function buildErrorResponse(message: string, statusCode: number = 500, details?: any): LambdaResponse {
	const errorResponse: ErrorResponse = {
		error: true,
		message,
		details
	};

	return {
		statusCode,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		},
		body: JSON.stringify(errorResponse)
	};
}
