import { Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';
import config from '../../config';
import { AppError } from '../../middleware/errorHandler';
import { extractPipelineOutput, callout } from '../../utils';
import { t } from '../../translations/translations';
import {
  ChatRequestBody,
  ChatResponse,
  WebhookResponse,
  WebhookRequestConfig
} from '../../types';

export class ChatController {
  /**
	 * Handle POST /api/chat
	 */
  async chat(req: Request<{}, ChatResponse, ChatRequestBody>, res: Response<ChatResponse>, next: NextFunction): Promise<void> {
    const { message, data } = req.body;

    // Validation
    if (!message && !data) {
      return next(new AppError(t.errors.messageOrDataRequired, 400));
    }

    console.log('Processing chat request:', {
      hasMessage: !!message,
      hasData: !!data
    });

    // Prepare payload
    const payload = data || { text: message };

    // Configure webhook request
    const webhookConfig: WebhookRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': config.webhook.apiKey
      },
      params: {
        apikey: config.webhook.apiKey
      },
      timeout: config.webhook.timeout,
      validateStatus: (status: number) => status < 500 // Don't throw on 4xx errors
    };

    // Make PUT request to webhook
    const [error, response] = await callout(
      axios.put<WebhookResponse>(
        config.webhook.baseUrl,
        payload,
        webhookConfig
      )
    );

    if (error) {
      const axiosError = error as AxiosError;

      console.error('Chat endpoint error:', {
        message: (error as Error).message,
        response: axiosError.response?.data,
        status: axiosError.response?.status
      });

      if (axiosError.code === 'ECONNABORTED') {
        return next(new AppError('Pipeline processing timeout - request took too long', 504));
      }

      if (axiosError.response) {
        return next(new AppError(
          'Pipeline processing failed',
          axiosError.response.status,
          axiosError.response.data
        ));
      }

      return next(error);
    }

    // Handle non-200 responses
    if (response.status !== 200) {
      return next(new AppError('Pipeline returned an error', response.status, response.data));
    }

    // Extract result
    const result = extractPipelineOutput(response.data);

    res.json({
      success: true,
      result,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTime: response.headers['x-response-time']
      }
    });
  }
}
