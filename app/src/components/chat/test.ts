import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Request, Response } from 'express';
import ChatController from './controller';
import { Callout, Webhook, PipelineOutput, Logger } from '@utils';
import { AppError } from '@middleware/error';
import { t } from '@translations/translations';

use(sinonChai);

describe('ChatController', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: sinon.SinonSpy;
	let calloutStub: sinon.SinonStub;
	let loggerInfoStub: sinon.SinonStub;

	beforeEach(() => {
		req = {
			body: {}
		};
		res = {
			json: sinon.stub()
		};
		next = sinon.spy();
		calloutStub = sinon.stub(Callout, 'call');
		loggerInfoStub = sinon.stub(Logger, 'info');
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

			it('should not log or make webhook call when validation fails', async () => {
				req.body = {};

				await ChatController.chat(req as any, res as any, next);

				expect(loggerInfoStub).to.not.have.been.called;
				expect(calloutStub).to.not.have.been.called;
			});
		});

		context('when request has valid message', () => {
			it('should log request with hasMessage true', async () => {
				req.body = { message: 'test message' };
				calloutStub.resolves([null, { status: 200, data: { data: { objects: {} } }, headers: {} }]);

				await ChatController.chat(req as any, res as any, next);

				expect(loggerInfoStub).to.have.been.calledWith('Processing chat request', {
					hasMessage: true,
					hasData: false,
					hasFingerprint: false
				});
			});

			// TODO: Fix when webhook integration is enabled
			it.skip('should build payload with message', async () => {
				const buildPayloadSpy = sinon.spy(Webhook, 'buildPayload');
				req.body = { message: 'test message' };
				calloutStub.resolves([null, { status: 200, data: { data: { objects: {} } }, headers: {} }]);

				await ChatController.chat(req as any, res as any, next);

				expect(buildPayloadSpy).to.have.been.calledWith('test message', undefined);
			});
		});

		context('when request has valid data', () => {
			it('should log request with hasData true', async () => {
				const data = { key: 'value' };
				req.body = { data };
				calloutStub.resolves([null, { status: 200, data: { data: { objects: {} } }, headers: {} }]);

				await ChatController.chat(req as any, res as any, next);

				expect(loggerInfoStub).to.have.been.calledWith('Processing chat request', {
					hasMessage: false,
					hasData: true,
					hasFingerprint: false
				});
			});

			// TODO: Fix when webhook integration is enabled
			it.skip('should build payload with data', async () => {
				const buildPayloadSpy = sinon.spy(Webhook, 'buildPayload');
				const data = { key: 'value' };
				req.body = { data };
				calloutStub.resolves([null, { status: 200, data: { data: { objects: {} } }, headers: {} }]);

				await ChatController.chat(req as any, res as any, next);

				expect(buildPayloadSpy).to.have.been.calledWith(undefined, data);
			});
		});

		context('when webhook request fails', () => {
			// TODO: Fix when webhook integration is enabled
			it.skip('should call next with handled error', async () => {
				const handleErrorSpy = sinon.spy(Webhook, 'handleError');
				const error = new Error('Network error');
				req.body = { message: 'test' };
				calloutStub.resolves([error, undefined]);

				await ChatController.chat(req as any, res as any, next);

				expect(handleErrorSpy).to.have.been.calledWith(error);
				expect(next).to.have.been.calledOnce;
			});

			// TODO: Fix when webhook integration is enabled
			it.skip('should not call response.json when error occurs', async () => {
				const error = new Error('Network error');
				req.body = { message: 'test' };
				calloutStub.resolves([error, undefined]);

				await ChatController.chat(req as any, res as any, next);

				expect(res.json).to.not.have.been.called;
			});
		});

		context('when webhook returns non-200 status', () => {
			// TODO: Fix when webhook integration is enabled
			it.skip('should call next with AppError for 400 status', async () => {
				req.body = { message: 'test' };
				const responseData = { error: 'Bad Request' };
				calloutStub.resolves([null, {
					status: 400,
					data: responseData,
					headers: {}
				}]);

				await ChatController.chat(req as any, res as any, next);

				expect(next).to.have.been.calledOnce;
				const error = next.firstCall.args[0];
				expect(error).to.be.instanceOf(AppError);
				expect(error.message).to.equal('Pipeline returned an error');
				expect(error.status).to.equal(400);
			});

			// TODO: Fix when webhook integration is enabled
			it.skip('should call next with AppError for 500 status', async () => {
				req.body = { message: 'test' };
				calloutStub.resolves([null, {
					status: 500,
					data: { error: 'Internal Server Error' },
					headers: {}
				}]);

				await ChatController.chat(req as any, res as any, next);

				const error = next.firstCall.args[0];
				expect(error.status).to.equal(500);
			});
		});

		context('when webhook returns successful response', () => {
			// TODO: Fix when webhook integration is enabled
			it.skip('should extract pipeline output and build success response', async () => {
				const extractSpy = sinon.spy(PipelineOutput, 'extract');
				const buildSuccessSpy = sinon.spy(Webhook, 'buildSuccessResponse');
				const responseData = {
					data: {
						objects: {
							'obj-123': {
								text: 'Pipeline result'
							}
						}
					}
				};
				const headers = { 'x-response-time': '100ms' };
				req.body = { message: 'test' };
				calloutStub.resolves([null, {
					status: 200,
					data: responseData,
					headers
				}]);

				await ChatController.chat(req as any, res as any, next);

				expect(extractSpy).to.have.been.calledWith(responseData);
				expect(buildSuccessSpy).to.have.been.called;
			});

			// TODO: Fix when webhook integration is enabled
			it.skip('should send JSON response with success data', async () => {
				const responseData = {
					data: {
						objects: {
							'obj-123': {
								text: 'Pipeline result'
							}
						}
					}
				};
				req.body = { message: 'test' };
				calloutStub.resolves([null, {
					status: 200,
					data: responseData,
					headers: { 'x-response-time': '100ms' }
				}]);

				await ChatController.chat(req as any, res as any, next);

				expect(res.json).to.have.been.calledOnce;
				const response = (res.json as sinon.SinonStub).firstCall.args[0];
				expect(response).to.have.property('success', true);
				expect(response).to.have.property('result');
				expect(response).to.have.property('metadata');
			});

			it('should not call next when successful', async () => {
				const responseData = {
					data: {
						objects: {
							'obj-123': {
								text: 'Pipeline result'
							}
						}
					}
				};
				req.body = { message: 'test' };
				calloutStub.resolves([null, {
					status: 200,
					data: responseData,
					headers: {}
				}]);

				await ChatController.chat(req as any, res as any, next);

				expect(next).to.not.have.been.called;
			});
		});

		context('when request has both message and data', () => {
			it('should log both as true', async () => {
				req.body = { message: 'test message', data: { key: 'value' } };
				calloutStub.resolves([null, { status: 200, data: { data: { objects: {} } }, headers: {} }]);

				await ChatController.chat(req as any, res as any, next);

				expect(loggerInfoStub).to.have.been.calledWith('Processing chat request', {
					hasMessage: true,
					hasData: true,
					hasFingerprint: false
				});
			});
		});
	});
});
