import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { AxiosError } from 'axios';
import Webhook from './webhook';
import { AppError } from '@middleware/error';
import Logger from '@utils/logger/logger';

use(sinonChai);

describe('Webhook', () => {
	let loggerErrorStub: sinon.SinonStub;

	beforeEach(() => {
		loggerErrorStub = sinon.stub(Logger, 'error');
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('.buildPayload', () => {
		context('when message is provided', () => {
			it('should return message as plain text', () => {
				const message = 'test message';

				const result = Webhook.buildPayload(message, null);

				expect(result).to.equal(message);
			});

			it('should handle empty string message', () => {
				const message = '';

				const result = Webhook.buildPayload(message, null);

				expect(result).to.equal('');
			});
		});

		context('when data is provided', () => {
			it('should return stringified data when no message', () => {
				const data = { key: 'value', nested: { prop: 'test' } };

				const result = Webhook.buildPayload(undefined, data);

				expect(result).to.equal(JSON.stringify(data));
			});

			it('should prefer message over data', () => {
				const message = 'test message';
				const data = { key: 'value' };

				const result = Webhook.buildPayload(message, data);

				expect(result).to.equal(message);
			});
		});

		context('when neither message nor data is provided', () => {
			it('should return stringified null', () => {
				const result = Webhook.buildPayload(undefined, null);

				expect(result).to.equal('null');
			});
		});
	});

	describe('.buildConfig', () => {
		it('should return valid webhook request configuration', () => {
			const config = Webhook.buildConfig();

			expect(config).to.have.property('headers');
			expect(config).to.have.property('params');
			expect(config).to.have.property('timeout');
			expect(config).to.have.property('validateStatus');
		});

		it('should include correct headers', () => {
			const config = Webhook.buildConfig();

			expect(config.headers).to.have.property('Content-Type', 'text/plain');
			expect(config.headers).to.have.property('Authorization');
		});

		it('should include token in params', () => {
			const config = Webhook.buildConfig();

			expect(config.params).to.have.property('token');
		});

		it('should have validateStatus function', () => {
			const config = Webhook.buildConfig();

			expect(config.validateStatus).to.be.a('function');
		});

		it('validateStatus should return true for status < 500', () => {
			const config = Webhook.buildConfig();

			expect(config.validateStatus(200)).to.be.true;
			expect(config.validateStatus(404)).to.be.true;
			expect(config.validateStatus(499)).to.be.true;
		});

		it('validateStatus should return false for status >= 500', () => {
			const config = Webhook.buildConfig();

			expect(config.validateStatus(500)).to.be.false;
			expect(config.validateStatus(503)).to.be.false;
		});
	});

	describe('.handleError', () => {
		context('when error is timeout (ECONNABORTED)', () => {
			it('should return timeout AppError', () => {
				const error = {
					code: 'ECONNABORTED',
					message: 'timeout of 5000ms exceeded'
				} as AxiosError;

				const result = Webhook.handleError(error);

				expect(result).to.be.instanceOf(AppError);
				expect(result.message).to.equal('Pipeline processing timeout - request took too long');
				expect(result.status).to.equal(504);
				expect(loggerErrorStub).to.have.been.calledOnce;
			});
		});

		context('when error has response', () => {
			it('should return AppError with response status and data', () => {
				const error = {
					message: 'Request failed',
					response: {
						status: 400,
						data: { error: 'Bad Request' }
					}
				} as AxiosError;

				const result = Webhook.handleError(error);

				expect(result).to.be.instanceOf(AppError);
				expect(result.message).to.equal('Pipeline processing failed');
				expect(result.status).to.equal(400);
				expect(loggerErrorStub).to.have.been.calledOnce;
			});

			it('should handle 404 errors', () => {
				const error = {
					message: 'Not found',
					response: {
						status: 404,
						data: { error: 'Resource not found' }
					}
				} as AxiosError;

				const result = Webhook.handleError(error);

				expect(result.status).to.equal(404);
			});
		});

		context('when error has no response or code', () => {
			it('should return the error as AppError', () => {
				const error = new Error('Network error') as any;

				const result = Webhook.handleError(error);

				expect(result).to.equal(error);
				expect(loggerErrorStub).to.have.been.calledOnce;
			});
		});

		it('should log error details', () => {
			const error = {
				message: 'Test error',
				response: {
					status: 500,
					data: { error: 'Internal Server Error' }
				}
			} as AxiosError;

			Webhook.handleError(error);

			expect(loggerErrorStub).to.have.been.calledWith('Chat endpoint error', {
				message: 'Test error',
				response: { error: 'Internal Server Error' },
				status: 500
			});
		});
	});

	describe('.buildSuccessResponse', () => {
		it('should return formatted success response', () => {
			const result = { data: 'test data' };
			const headers = { 'x-response-time': '123ms' };

			const response = Webhook.buildSuccessResponse(result, headers);

			expect(response).to.have.property('success', true);
			expect(response).to.have.property('message');
			expect(response).to.have.property('timestamp');
			expect(response).to.have.property('metadata');
		});

		it('should include timestamp at top level', () => {
			const result = { data: 'test' };
			const headers = { 'x-response-time': '100ms' };

			const response = Webhook.buildSuccessResponse(result, headers);

			expect(response).to.have.property('timestamp');
			expect(response.timestamp).to.be.a('string');
			expect(new Date(response.timestamp).toISOString()).to.equal(response.timestamp);
		});

		it('should include processingTime from headers', () => {
			const result = { data: 'test' };
			const headers = { 'x-response-time': '250ms' };

			const response = Webhook.buildSuccessResponse(result, headers);

			expect(response.metadata).to.have.property('processingTime', '250ms');
		});

		it('should handle missing x-response-time header', () => {
			const result = { data: 'test' };
			const headers = {};

			const response = Webhook.buildSuccessResponse(result, headers);

			expect(response.metadata?.processingTime).to.be.undefined;
		});

		it('should convert string result to message', () => {
			const result = 'This is a test message';
			const headers = {};

			const response = Webhook.buildSuccessResponse(result, headers);

			expect(response.message).to.equal('This is a test message');
		});

		it('should stringify object result to message', () => {
			const result = { data: 'test', nested: { value: 123 } };
			const headers = {};

			const response = Webhook.buildSuccessResponse(result, headers);

			expect(response.message).to.equal(JSON.stringify(result));
		});
	});
});
