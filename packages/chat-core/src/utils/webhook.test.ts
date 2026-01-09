import { expect } from 'chai';
import { AxiosError } from 'axios';
import Webhook from './webhook';
import { WebhookConfig } from '../types';

describe('Webhook', () => {
	describe('.buildPayload', () => {
		it('should return message when message is provided', () => {
			const result = Webhook.buildPayload('test message', undefined);

			expect(result).to.equal('test message');
		});

		it('should return stringified data when message is undefined', () => {
			const data = { key: 'value', number: 123 };
			const result = Webhook.buildPayload(undefined, data);

			expect(result).to.equal(JSON.stringify(data));
		});

		it('should prioritize message over data', () => {
			const result = Webhook.buildPayload('message', { key: 'value' });

			expect(result).to.equal('message');
		});

		it('should return empty string when message is empty string', () => {
			const result = Webhook.buildPayload('', { key: 'value' });

			expect(result).to.equal('');
		});
	});

	describe('.buildConfig', () => {
		it('should build correct webhook request config', () => {
			const webhookConfig: WebhookConfig = {
				baseUrl: 'https://api.example.com',
				authorizationKey: 'Bearer token123',
				token: 'token456',
				timeout: 30000
			};

			const result = Webhook.buildConfig(webhookConfig);

			expect(result).to.deep.equal({
				headers: {
					'Content-Type': 'text/plain',
					Authorization: 'Bearer token123'
				},
				params: {
					token: 'token456'
				},
				timeout: 30000,
				validateStatus: result.validateStatus
			});
		});

		it('should have validateStatus function that returns true for status < 500', () => {
			const webhookConfig: WebhookConfig = {
				baseUrl: 'https://api.example.com',
				authorizationKey: 'key',
				token: 'token',
				timeout: 30000
			};

			const result = Webhook.buildConfig(webhookConfig);

			expect(result.validateStatus!(200)).to.be.true;
			expect(result.validateStatus!(400)).to.be.true;
			expect(result.validateStatus!(499)).to.be.true;
			expect(result.validateStatus!(500)).to.be.false;
			expect(result.validateStatus!(502)).to.be.false;
		});
	});

	describe('.buildSuccessResponse', () => {
		it('should build response with string result', () => {
			const result = Webhook.buildSuccessResponse(
				'Simple text response',
				{ 'x-response-time': '100ms' }
			);

			expect(result).to.have.property('success', true);
			expect(result).to.have.property('message', 'Simple text response');
			expect(result).to.have.property('timestamp');
			expect(result.metadata).to.deep.equal({ processingTime: '100ms' });
		});

		it('should extract message from answers array', () => {
			const resultData = {
				answers: ['First answer', 'Second answer']
			};
			const result = Webhook.buildSuccessResponse(resultData, {});

			expect(result.message).to.equal('First answer');
		});

		it('should stringify non-string, non-answers result', () => {
			const resultData = { key: 'value', number: 123 };
			const result = Webhook.buildSuccessResponse(resultData, {});

			expect(result.message).to.equal(JSON.stringify(resultData));
		});

		it('should include timestamp in ISO format', () => {
			const result = Webhook.buildSuccessResponse('test', {});

			expect(result.timestamp).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
		});
	});

	describe('.formatError', () => {
		it('should handle timeout errors', () => {
			const error = new Error('Request timeout') as AxiosError;
			error.code = 'ECONNABORTED';

			const result = Webhook.formatError(error);

			expect(result).to.deep.equal({
				message: 'Pipeline processing timeout - request took too long',
				statusCode: 504
			});
		});

		it('should handle axios errors with response', () => {
			const error = {
				response: {
					status: 400,
					data: { error: 'Bad Request' }
				}
			} as AxiosError;

			const result = Webhook.formatError(error);

			expect(result).to.deep.equal({
				message: 'Pipeline processing failed',
				statusCode: 400,
				details: { error: 'Bad Request' }
			});
		});

		it('should handle axios errors with 500 status', () => {
			const error = {
				response: {
					status: 500,
					data: { error: 'Internal Server Error' }
				}
			} as AxiosError;

			const result = Webhook.formatError(error);

			expect(result.statusCode).to.equal(500);
			expect(result.message).to.equal('Pipeline processing failed');
		});

		it('should handle generic errors without response', () => {
			const error = new Error('Network error');

			const result = Webhook.formatError(error);

			expect(result).to.deep.equal({
				message: 'Network error',
				statusCode: 500
			});
		});

		it('should handle errors without message', () => {
			const error = new Error('');

			const result = Webhook.formatError(error);

			expect(result.message).to.equal('Unknown error occurred');
			expect(result.statusCode).to.equal(500);
		});
	});
});
