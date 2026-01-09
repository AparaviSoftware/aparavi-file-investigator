import { Request, Response, NextFunction } from 'express';
import { ChatService } from '@aparavi/chat-core';
import config from '@config';
import { AppError } from '@middleware/error';
import { Logger } from '@utils';
import { t } from '@translations/translations';
import {
	ChatRequestBody,
	ChatResponse
} from '@types';

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

		const webhookConfig = {
			baseUrl: config.webhook.baseUrl,
			authorizationKey: config.webhook.authorizationKey,
			token: config.webhook.token,
			timeout: config.webhook.timeout
		};

		const result = await ChatService.processChat(
			{ message, data },
			webhookConfig,
			Logger
		);

		if (!result.success && result.error) {
			return next(new AppError(result.error.message, result.error.statusCode, result.error.details));
		}

		res.json(result);
	}
}
