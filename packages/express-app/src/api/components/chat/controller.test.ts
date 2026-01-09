import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Request, Response } from 'express';
import { ChatService } from '@aparavi/chat-core';
import ChatController from './controller';
import { AppError } from '@middleware/error';
import { t } from '@translations/translations';

use(sinonChai);

describe('ChatController', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: sinon.SinonSpy;
	let chatServiceStub: sinon.SinonStub;

	beforeEach(() => {
		req = {
			body: {}
		};
		res = {
			json: sinon.stub()
		};
		next = sinon.spy();
		chatServiceStub = sinon.stub(ChatService, 'processChat');
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('.chat', () => {
		context('when request validation fails', () => {
			it('should call next with AppError when both message and data are missing', async () => {
				req.body = {};

				await ChatController.chat(req as any, res as any, next);

				expect(next).to.have.been.calledOnce;
				const error = next.firstCall.args[0];
				expect(error).to.be.instanceOf(AppError);
				expect(error.message).to.equal(t.errors.messageOrDataRequired);
				expect(error.status).to.equal(400);
			});

			it('should not call ChatService when validation fails', async () => {
				req.body = {};

				await ChatController.chat(req as any, res as any, next);

				expect(chatServiceStub).to.not.have.been.called;
			});
		});

		context('when request has valid message', () => {
			it('should call ChatService.processChat with correct parameters', async () => {
				req.body = { message: 'test message' };
				chatServiceStub.resolves({
					success: true,
					message: 'Response',
					timestamp: new Date().toISOString()
				});

				await ChatController.chat(req as any, res as any, next);

				expect(chatServiceStub).to.have.been.calledOnce;
				const [requestBody, webhookConfig, logger] = chatServiceStub.firstCall.args;
				expect(requestBody).to.deep.equal({ message: 'test message', data: undefined });
				expect(webhookConfig).to.have.property('baseUrl');
				expect(webhookConfig).to.have.property('authorizationKey');
				expect(webhookConfig).to.have.property('token');
				expect(webhookConfig).to.have.property('timeout');
				expect(logger).to.exist;
			});
		});

		context('when request has valid data', () => {
			it('should call ChatService with data parameter', async () => {
				const data = { key: 'value', number: 123 };
				req.body = { data };
				chatServiceStub.resolves({
					success: true,
					message: 'Response',
					timestamp: new Date().toISOString()
				});

				await ChatController.chat(req as any, res as any, next);

				const [requestBody] = chatServiceStub.firstCall.args;
				expect(requestBody.data).to.deep.equal(data);
			});
		});

		context('when ChatService returns error', () => {
			it('should call next with AppError', async () => {
				req.body = { message: 'test' };
				chatServiceStub.resolves({
					success: false,
					message: 'Service error',
					timestamp: new Date().toISOString(),
					error: {
						message: 'Pipeline processing failed',
						statusCode: 500,
						details: { error: 'Internal error' }
					}
				});

				await ChatController.chat(req as any, res as any, next);

				expect(next).to.have.been.calledOnce;
				const error = next.firstCall.args[0];
				expect(error).to.be.instanceOf(AppError);
				expect(error.message).to.equal('Pipeline processing failed');
				expect(error.status).to.equal(500);
				expect(error.details).to.deep.equal({ error: 'Internal error' });
			});

			it('should not call res.json when error occurs', async () => {
				req.body = { message: 'test' };
				chatServiceStub.resolves({
					success: false,
					message: 'Error',
					timestamp: new Date().toISOString(),
					error: {
						message: 'Error occurred',
						statusCode: 400
					}
				});

				await ChatController.chat(req as any, res as any, next);

				expect(res.json).to.not.have.been.called;
			});

			it('should handle timeout errors', async () => {
				req.body = { message: 'test' };
				chatServiceStub.resolves({
					success: false,
					message: 'Timeout',
					timestamp: new Date().toISOString(),
					error: {
						message: 'Pipeline processing timeout - request took too long',
						statusCode: 504
					}
				});

				await ChatController.chat(req as any, res as any, next);

				const error = next.firstCall.args[0];
				expect(error.status).to.equal(504);
			});
		});

		context('when ChatService returns success', () => {
			it('should send JSON response with success data', async () => {
				const successResponse = {
					success: true,
					message: 'Pipeline response text',
					timestamp: '2024-01-01T00:00:00.000Z',
					metadata: {
						processingTime: '100ms'
					}
				};
				req.body = { message: 'test' };
				chatServiceStub.resolves(successResponse);

				await ChatController.chat(req as any, res as any, next);

				expect(res.json).to.have.been.calledOnce;
				expect(res.json).to.have.been.calledWith(successResponse);
			});

			it('should not call next when successful', async () => {
				req.body = { message: 'test' };
				chatServiceStub.resolves({
					success: true,
					message: 'Success',
					timestamp: new Date().toISOString()
				});

				await ChatController.chat(req as any, res as any, next);

				expect(next).to.not.have.been.called;
			});

			it('should handle response with metadata', async () => {
				req.body = { message: 'test' };
				chatServiceStub.resolves({
					success: true,
					message: 'Response with metadata',
					timestamp: new Date().toISOString(),
					metadata: {
						processingTime: '250ms'
					}
				});

				await ChatController.chat(req as any, res as any, next);

				const response = (res.json as sinon.SinonStub).firstCall.args[0];
				expect(response.metadata).to.deep.equal({ processingTime: '250ms' });
			});
		});

		context('when request has both message and data', () => {
			it('should pass both to ChatService', async () => {
				req.body = { message: 'test message', data: { key: 'value' } };
				chatServiceStub.resolves({
					success: true,
					message: 'Response',
					timestamp: new Date().toISOString()
				});

				await ChatController.chat(req as any, res as any, next);

				const [requestBody] = chatServiceStub.firstCall.args;
				expect(requestBody.message).to.equal('test message');
				expect(requestBody.data).to.deep.equal({ key: 'value' });
			});
		});
	});
});
