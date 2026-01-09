import { AxiosError } from 'axios';
import { WebhookRequestConfig, WebhookConfig, ChatResponse } from '../types';

export default class Webhook {
	/**
	 * Builds the payload for webhook request.
	 *
	 * @param {string | undefined} message - The message text
	 * @param {any} data - The data object
	 *
	 * @return {string} Payload as plain text for webhook request
	 *
	 * @example
	 *     const payload = Webhook.buildPayload(message, data);
	 */
	static buildPayload(message: string | undefined, data: any): string {
		return message !== undefined ? message : JSON.stringify(data);
	}

	/**
	 * Builds the configuration for webhook request.
	 *
	 * @param {WebhookConfig} config - Webhook configuration object
	 *
	 * @return {WebhookRequestConfig} Configuration object for webhook request
	 *
	 * @example
	 *     const config = Webhook.buildConfig(webhookConfig);
	 */
	static buildConfig(config: WebhookConfig): WebhookRequestConfig {
		return {
			headers: {
				'Content-Type': 'text/plain',
				Authorization: config.authorizationKey
			},
			params: {
				token: config.token
			},
			timeout: config.timeout,
			validateStatus: (status: number) => status < 500
		};
	}

	/**
	 * Builds the success response object.
	 *
	 * @param {any} result - The extracted pipeline output
	 * @param {any} headers - The response headers
	 *
	 * @return {ChatResponse} Formatted success response
	 *
	 * @example
	 *     const response = Webhook.buildSuccessResponse(result, headers);
	 */
	static buildSuccessResponse(result: any, headers: any): ChatResponse {
		let message: string;

		if (typeof result === 'string') {
			message = result;
		} else if (result?.answers && Array.isArray(result.answers)) {
			message = result.answers[0];
		} else {
			message = JSON.stringify(result);
		}

		return {
			success: true,
			message,
			timestamp: new Date().toISOString(),
			metadata: {
				processingTime: headers['x-response-time']
			}
		};
	}

	/**
	 * Formats an error into a standardized structure.
	 *
	 * @param {Error} error - The error object from webhook request
	 *
	 * @return {object} Formatted error object with message, statusCode, and details
	 *
	 * @example
	 *     const errorObj = Webhook.formatError(error);
	 */
	static formatError(error: Error): { message: string; statusCode: number; details?: any } {
		const axiosError = error as AxiosError;

		if (axiosError.code === 'ECONNABORTED') {
			return {
				message: 'Pipeline processing timeout - request took too long',
				statusCode: 504
			};
		}

		if (axiosError.response) {
			return {
				message: 'Pipeline processing failed',
				statusCode: axiosError.response.status,
				details: axiosError.response.data
			};
		}

		return {
			message: error.message || 'Unknown error occurred',
			statusCode: 500
		};
	}
}
