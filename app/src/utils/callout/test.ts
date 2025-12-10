import { expect } from 'chai';
import Callout from './callout';

describe('Callout', () => {
	describe('.call', () => {
		context('when promise resolves successfully', () => {
			it('should return [null, data]', async () => {
				const mockData = { message: 'success' };
				const promise = Promise.resolve(mockData);

				const [error, data] = await Callout.call(promise);

				expect(error).to.be.null;
				expect(data).to.deep.equal(mockData);
			});

			it('should handle resolved primitive values', async () => {
				const promise = Promise.resolve('test string');

				const [error, data] = await Callout.call(promise);

				expect(error).to.be.null;
				expect(data).to.equal('test string');
			});

			it('should handle resolved null values', async () => {
				const promise = Promise.resolve(null);

				const [error, data] = await Callout.call(promise);

				expect(error).to.be.null;
				expect(data).to.be.null;
			});
		});

		context('when promise rejects', () => {
			it('should return [error, undefined]', async () => {
				const mockError = new Error('Test error');
				const promise = Promise.reject(mockError);

				const [error, data] = await Callout.call(promise);

				expect(error).to.equal(mockError);
				expect(data).to.be.undefined;
			});

			it('should handle rejected string errors', async () => {
				const promise = Promise.reject('String error');

				const [error, data] = await Callout.call(promise);

				expect(error).to.equal('String error');
				expect(data).to.be.undefined;
			});

			it('should handle rejected object errors', async () => {
				const errorObject = { code: 500, message: 'Server error' };
				const promise = Promise.reject(errorObject);

				const [error, data] = await Callout.call(promise);

				expect(error).to.deep.equal(errorObject);
				expect(data).to.be.undefined;
			});
		});
	});
});
