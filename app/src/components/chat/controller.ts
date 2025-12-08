import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import config from '../../config';
import { AppError } from '../../middleware/errorHandler';
import {
	PipelineOutput,
	Callout,
	Logger,
	Webhook
} from '../../utils';
import { t } from '../../translations/translations';
import {
	ChatRequestBody,
	ChatResponse,
	WebhookResponse
} from '../../types';

export default class ChatController {
	/**
	 * Handles POST requests to /api/chat endpoint.
	 * Validates request, forwards to webhook, and returns processed response.
	 *
	 * @param {Request} req - Express request object containing chat message or data
	 * @param {Response} res - Express response object
	 * @param {NextFunction} next - Express next function for error handling
	 *
	 * @return {Promise<void>} Resolves when response is sent
	 *
	 * @example
	 *     router.post('/chat', ChatController.chat);
	 */
	static async chat(req: Request<Record<string, never>, ChatResponse, ChatRequestBody>, res: Response<ChatResponse>, next: NextFunction): Promise<void> {
		const { message, data } = req.body;

		if (!message && !data) {
			return next(new AppError(t.errors.messageOrDataRequired, 400));
		}

		Logger.info('Processing chat request', {
			hasMessage: !!message,
			hasData: !!data
		});

		const payload = Webhook.buildPayload(message, data);
		const webhookConfig = Webhook.buildConfig();

		const [error, response] = await Callout.call(
			axios.put<WebhookResponse>(
				config.webhook.baseUrl,
				payload,
				webhookConfig
			)
		);

		if (error) {
			return next(Webhook.handleError(error));
		}

		if (response.status !== 200) {
			return next(new AppError('Pipeline returned an error', response.status, response.data));
		}

		const result = PipelineOutput.extract(response.data);
		const successResponse = Webhook.buildSuccessResponse(result, response.headers);

		res.json(successResponse);
	}
}
