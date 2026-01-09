import { expect } from 'chai';
import PipelineOutput from './pipelineOutput';
import { WebhookResponse } from '../types';

describe('PipelineOutput', () => {
	describe('.extract', () => {
		context('when response has answers array', () => {
			it('should return the first answer', () => {
				const response: WebhookResponse = {
					answers: ['First answer', 'Second answer']
				};

				const result = PipelineOutput.extract(response);

				expect(result).to.equal('First answer');
			});

			it('should prioritize answers over data.objects', () => {
				const response: WebhookResponse = {
					answers: ['Answer from array'],
					data: {
						objects: {
							obj1: { text: 'Text from object' }
						}
					}
				};

				const result = PipelineOutput.extract(response);

				expect(result).to.equal('Answer from array');
			});

			it('should handle empty answers array and fall back to data.objects', () => {
				const response: WebhookResponse = {
					answers: [],
					data: {
						objects: {
							obj1: { text: 'Fallback text' }
						}
					}
				};

				const result = PipelineOutput.extract(response);

				expect(result).to.equal('Fallback text');
			});
		});

		context('when response has data.objects', () => {
			it('should return text from first object if present', () => {
				const response: WebhookResponse = {
					data: {
						objects: {
							obj1: { text: 'Object text content' }
						}
					}
				};

				const result = PipelineOutput.extract(response);

				expect(result).to.equal('Object text content');
			});

			it('should return entire first object if text field is missing', () => {
				const response: WebhookResponse = {
					data: {
						objects: {
							obj1: { content: 'Other content', id: 123 }
						}
					}
				};

				const result = PipelineOutput.extract(response);

				expect(result).to.deep.equal({ content: 'Other content', id: 123 });
			});

			it('should handle multiple objects and return first one', () => {
				const response: WebhookResponse = {
					data: {
						objects: {
							obj1: { text: 'First object' },
							obj2: { text: 'Second object' }
						}
					}
				};

				const result = PipelineOutput.extract(response);

				expect(result).to.equal('First object');
			});

			it('should return full response if objects is empty', () => {
				const response: WebhookResponse = {
					data: {
						objects: {}
					}
				};

				const result = PipelineOutput.extract(response);

				expect(result).to.deep.equal(response);
			});
		});

		context('when response has no expected structure', () => {
			it('should return the full response if no answers or data.objects', () => {
				const response: WebhookResponse = {
					someField: 'some value',
					anotherField: 123
				};

				const result = PipelineOutput.extract(response);

				expect(result).to.deep.equal(response);
			});

			it('should return the response if data exists but no objects', () => {
				const response: WebhookResponse = {
					data: {
						someOtherField: 'value'
					}
				};

				const result = PipelineOutput.extract(response);

				expect(result).to.deep.equal(response);
			});

			it('should handle null/undefined responses', () => {
				const result1 = PipelineOutput.extract(null as any);
				const result2 = PipelineOutput.extract(undefined as any);

				expect(result1).to.be.null;
				expect(result2).to.be.undefined;
			});
		});
	});
});
