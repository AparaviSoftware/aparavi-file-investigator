import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import axios from 'axios';
import ChatService from './chatService';
import { WebhookConfig } from '../types';

use(sinonChai);

describe('ChatService', () => {
	let axiosPostStub: sinon.SinonStub;
	let mockLogger: { info: sinon.SinonSpy; error: sinon.SinonSpy };
	let webhookConfig: WebhookConfig;

	beforeEach(() => {
		axiosPostStub = sinon.stub(axios, 'post');
		mockLogger = {
			info: sinon.spy(),
			error: sinon.spy()
		};
		webhookConfig = {
			baseUrl: 'https://api.example.com/webhook',
			authorizationKey: 'Bearer token123',
			token: 'token456',
			timeout: 30000
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('.processChat', () => {
		context('when validation fails', () => {
			it('should return error if both message and data are missing', async () => {
				const result = await ChatService.processChat({}, webhookConfig);

				expect(result.success).to.be.false;
				expect(result.error).to.deep.equal({
					message: 'Message or data is required',
					statusCode: 400
				});
				expect(axiosPostStub).to.not.have.been.called;
			});

			it('should include timestamp in error response', async () => {
				const result = await ChatService.processChat({}, webhookConfig);

				expect(result.timestamp).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
			});
		});

		context('when request has valid message', () => {
			it('should log processing info when logger provided', async () => {
				axiosPostStub.resolves({
					status: 200,
					data: { answers: ['Response'] },
					headers: {}
				});

				await ChatService.processChat(
					{ message: 'test message' },
					webhookConfig,
					mockLogger
				);

				expect(mockLogger.info).to.have.been.calledWith('Processing chat request', {
					hasMessage: true,
					hasData: false
				});
			});

			it('should not throw if logger not provided', async () => {
				axiosPostStub.resolves({
					status: 200,
					data: { answers: ['Response'] },
					headers: {}
				});

				await ChatService.processChat({ message: 'test' }, webhookConfig);

				expect(axiosPostStub).to.have.been.called;
			});

			it('should make axios call with correct parameters', async () => {
				axiosPostStub.resolves({
					status: 200,
					data: { answers: ['Response'] },
					headers: {}
				});

				await ChatService.processChat({ message: 'test message' }, webhookConfig);

				expect(axiosPostStub).to.have.been.calledOnce;
				const [url, payload, config] = axiosPostStub.firstCall.args;
				expect(url).to.equal('https://api.example.com/webhook');
				expect(payload).to.equal('test message');
				expect(config.headers['Authorization']).to.equal('Bearer token123');
				expect(config.params.token).to.equal('token456');
			});
		});

		context('when request has valid data', () => {
			it('should stringify data for payload', async () => {
				const data = { key: 'value', number: 123 };
				axiosPostStub.resolves({
					status: 200,
					data: { answers: ['Response'] },
					headers: {}
				});

				await ChatService.processChat({ data }, webhookConfig);

				const [, payload] = axiosPostStub.firstCall.args;
				expect(payload).to.equal(JSON.stringify(data));
			});
		});

		context('when webhook request fails', () => {
			it('should handle network errors', async () => {
				const networkError = new Error('Network error');
				axiosPostStub.rejects(networkError);

				const result = await ChatService.processChat(
					{ message: 'test' },
					webhookConfig,
					mockLogger
				);

				expect(result.success).to.be.false;
				expect(result.error?.message).to.equal('Network error');
				expect(result.error?.statusCode).to.equal(500);
				expect(mockLogger.error).to.have.been.called;
			});

			it('should handle timeout errors', async () => {
				const timeoutError: any = new Error('Timeout');
				timeoutError.code = 'ECONNABORTED';
				axiosPostStub.rejects(timeoutError);

				const result = await ChatService.processChat({ message: 'test' }, webhookConfig);

				expect(result.success).to.be.false;
				expect(result.error?.message).to.equal('Pipeline processing timeout - request took too long');
				expect(result.error?.statusCode).to.equal(504);
			});

			it('should handle axios errors with response data', async () => {
				const axiosError: any = new Error('Bad Request');
				axiosError.response = {
					status: 400,
					data: { error: 'Invalid input' }
				};
				axiosPostStub.rejects(axiosError);

				const result = await ChatService.processChat({ message: 'test' }, webhookConfig);

				expect(result.error?.statusCode).to.equal(400);
				expect(result.error?.details).to.deep.equal({ error: 'Invalid input' });
			});
		});

		context('when webhook returns non-200 status', () => {
			it('should return error for 400 status', async () => {
				axiosPostStub.resolves({
					status: 400,
					data: { error: 'Bad Request' },
					headers: {}
				});

				const result = await ChatService.processChat(
					{ message: 'test' },
					webhookConfig,
					mockLogger
				);

				expect(result.success).to.be.false;
				expect(result.error?.message).to.equal('Pipeline returned an error');
				expect(result.error?.statusCode).to.equal(400);
				expect(mockLogger.error).to.have.been.called;
			});

			it('should return error for 500 status', async () => {
				axiosPostStub.resolves({
					status: 500,
					data: { error: 'Internal Error' },
					headers: {}
				});

				const result = await ChatService.processChat({ message: 'test' }, webhookConfig);

				expect(result.success).to.be.false;
				expect(result.error?.statusCode).to.equal(500);
			});
		});

		context('when webhook returns successful response', () => {
			it('should return success response with extracted pipeline output', async () => {
				axiosPostStub.resolves({
					status: 200,
					data: { answers: ['Pipeline response text'] },
					headers: { 'x-response-time': '150ms' }
				});

				const result = await ChatService.processChat({ message: 'test' }, webhookConfig);

				expect(result.success).to.be.true;
				expect(result.message).to.equal('Pipeline response text');
				expect(result.metadata?.processingTime).to.equal('150ms');
			});

			it('should parse string response data', async () => {
				const responseData = JSON.stringify({ answers: ['Parsed response'] });
				axiosPostStub.resolves({
					status: 200,
					data: responseData,
					headers: {}
				});

				const result = await ChatService.processChat({ message: 'test' }, webhookConfig);

				expect(result.success).to.be.true;
				expect(result.message).to.equal('Parsed response');
			});

			it('should handle invalid JSON string response', async () => {
				axiosPostStub.resolves({
					status: 200,
					data: 'invalid json {',
					headers: {}
				});

				const result = await ChatService.processChat(
					{ message: 'test' },
					webhookConfig,
					mockLogger
				);

				expect(result.success).to.be.false;
				expect(result.error?.message).to.equal('Invalid response format from webhook');
				expect(mockLogger.error).to.have.been.called;
			});

			it('should handle complex pipeline output structure', async () => {
				axiosPostStub.resolves({
					status: 200,
					data: {
						data: {
							objects: {
								obj1: { text: 'Object text content' }
							}
						}
					},
					headers: {}
				});

				const result = await ChatService.processChat({ message: 'test' }, webhookConfig);

				expect(result.success).to.be.true;
				expect(result.message).to.equal('Object text content');
			});
		});
	});
});
