import axios from 'axios';
import Callout from '../utils/callout';
import PipelineOutput from '../utils/pipelineOutput';
import Webhook from '../utils/webhook';
import {
	ChatRequestBody,
	ChatServiceResult,
	WebhookConfig,
	WebhookResponse
} from '../types';

export default class ChatService {
	/**
	 * Processes a chat request by forwarding to webhook and returning processed response.
	 *
	 * @param {ChatRequestBody} request - The chat request containing message or data
	 * @param {WebhookConfig} webhookConfig - Webhook configuration object
	 * @param {Function} logger - Optional logger function for logging info and errors
	 *
	 * @return {Promise<ChatServiceResult>} Resolves with processed chat response
	 *
	 * @example
	 *     const result = await ChatService.processChat({ message: 'Hello' }, webhookConfig, logger);
	 */
	static async processChat(
		request: ChatRequestBody,
		webhookConfig: WebhookConfig,
		logger?: {
			info: (message: string, context?: any) => void;
			error: (message: string, context?: any) => void;
		}
	): Promise<ChatServiceResult> {
		const { message, data } = request;

		if (!message && !data) {
			return {
				success: false,
				message: 'Message or data is required',
				timestamp: new Date().toISOString(),
				error: {
					message: 'Message or data is required',
					statusCode: 400
				}
			};
		}

		if (logger) {
			logger.info('Processing chat request', {
				hasMessage: !!message,
				hasData: !!data
			});
		}

		const payload = Webhook.buildPayload(message, data);
		const axiosConfig = Webhook.buildConfig(webhookConfig);

		const [error, response] = await Callout.call(
			axios.post<WebhookResponse>(
				webhookConfig.baseUrl,
				payload,
				axiosConfig
			)
		);

		if (error) {
			const formattedError = Webhook.formatError(error);

			if (logger) {
				logger.error('Chat endpoint error', {
					message: error.message,
					...formattedError
				});
			}

			return {
				success: false,
				message: formattedError.message,
				timestamp: new Date().toISOString(),
				error: formattedError
			};
		}

		if (response.status !== 200) {
			const errorMessage = 'Pipeline returned an error';

			if (logger) {
				logger.error(errorMessage, {
					status: response.status,
					data: response.data
				});
			}

			return {
				success: false,
				message: errorMessage,
				timestamp: new Date().toISOString(),
				error: {
					message: errorMessage,
					statusCode: response.status,
					details: response.data
				}
			};
		}

		// Parse response data if it's a string
		let parsedData = response.data;
		if (typeof response.data === 'string') {
			try {
				parsedData = JSON.parse(response.data);
			} catch (parseError) {
				if (logger) {
					logger.error('Failed to parse webhook response', { data: response.data });
				}

				return {
					success: false,
					message: 'Invalid response format from webhook',
					timestamp: new Date().toISOString(),
					error: {
						message: 'Invalid response format from webhook',
						statusCode: 500
					}
				};
			}
		}

		const result = PipelineOutput.extract(parsedData);
		const successResponse = Webhook.buildSuccessResponse(result, response.headers);

		return successResponse;
	}
}
