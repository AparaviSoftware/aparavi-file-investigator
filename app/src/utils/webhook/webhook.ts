import { AxiosError } from 'axios';
import config from '@config';
import { AppError } from '@middleware/error';
import Logger from '@utils/logger/logger';
import { WebhookRequestConfig, ChatResponse } from '@types';

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
	 * @return {WebhookRequestConfig} Configuration object for webhook request
	 *
	 * @example
	 *     const config = Webhook.buildConfig();
	 */
	static buildConfig(): WebhookRequestConfig {
		return {
			headers: {
				'Content-Type': 'text/plain',
				Authorization: config.webhook.authorizationKey
			},
			params: {
				token: config.webhook.token
			},
			timeout: config.webhook.timeout,
			validateStatus: (status: number) => status < 500
		};
	}

	/**
	 * Handles webhook error and returns appropriate AppError.
	 *
	 * @param {Error} error - The error object from webhook request
	 *
	 * @return {AppError} Formatted error for Express error handler
	 *
	 * @example
	 *     const appError = Webhook.handleError(error);
	 */
	static handleError(error: Error): AppError {
		const axiosError = error as AxiosError;

		Logger.error('Chat endpoint error', {
			message: error.message,
			response: axiosError.response?.data,
			status: axiosError.response?.status
		});

		if (axiosError.code === 'ECONNABORTED') {
			return new AppError('Pipeline processing timeout - request took too long', 504);
		}

		if (axiosError.response) {
			return new AppError(
				'Pipeline processing failed',
				axiosError.response.status,
				axiosError.response.data
			);
		}

		return error as AppError;
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
}
