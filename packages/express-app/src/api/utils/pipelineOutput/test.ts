import { expect } from 'chai';
import PipelineOutput from './pipelineOutput';
import { WebhookResponse } from '@types';

describe('PipelineOutput', () => {
	describe('.extract', () => {
		context('when response has answers array', () => {
			it('should extract first element from answers array', () => {
				const responseData: WebhookResponse = {
					answers: ['First answer', 'Second answer', 'Third answer']
				};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.equal('First answer');
			});

			it('should prioritize answers array over data.objects', () => {
				const responseData: WebhookResponse = {
					answers: ['Answer from array'],
					data: {
						objects: {
							'obj-123': {
								text: 'Text from objects'
							}
						}
					}
				};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.equal('Answer from array');
			});

			it('should handle empty answers array', () => {
				const responseData: WebhookResponse = {
					answers: [],
					data: {
						objects: {
							'obj-123': {
								text: 'Fallback text'
							}
						}
					}
				};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.equal('Fallback text');
			});
		});

		context('when response has expected structure with text field', () => {
			it('should extract text from first object', () => {
				const responseData: WebhookResponse = {
					data: {
						objects: {
							'obj-123': {
								text: 'Extracted text content',
								metadata: { timestamp: '2024-01-01' }
							}
						}
					}
				};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.equal('Extracted text content');
			});

			it('should extract text from first object when multiple objects exist', () => {
				const responseData: WebhookResponse = {
					data: {
						objects: {
							'obj-123': {
								text: 'First object text'
							},
							'obj-456': {
								text: 'Second object text'
							}
						}
					}
				};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.equal('First object text');
			});
		});

		context('when response has objects but no text field', () => {
			it('should return the entire first object', () => {
				const firstObject = {
					content: 'Some content',
					metadata: { id: '123' }
				};
				const responseData: WebhookResponse = {
					data: {
						objects: {
							'obj-123': firstObject
						}
					}
				};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.deep.equal(firstObject);
			});
		});

		context('when response has no objects', () => {
			it('should return full response when objects is empty', () => {
				const responseData: WebhookResponse = {
					data: {
						objects: {}
					}
				};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.deep.equal(responseData);
			});

			it('should return full response when objects is missing', () => {
				const responseData: any = {
					data: {}
				};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.deep.equal(responseData);
			});

			it('should return full response when data is missing', () => {
				const responseData: any = {};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.deep.equal(responseData);
			});

			it('should return full response when response is null', () => {
				const responseData: any = null;

				const result = PipelineOutput.extract(responseData);

				expect(result).to.be.null;
			});
		});

		context('when text field is null or empty', () => {
			it('should return the object when text is null', () => {
				const firstObject = {
					text: null,
					content: 'fallback content'
				};
				const responseData: WebhookResponse = {
					data: {
						objects: {
							'obj-123': firstObject
						}
					}
				};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.deep.equal(firstObject);
			});

			it('should return the object when text is empty string', () => {
				const firstObject = {
					text: '',
					content: 'fallback content'
				};
				const responseData: WebhookResponse = {
					data: {
						objects: {
							'obj-123': firstObject
						}
					}
				};

				const result = PipelineOutput.extract(responseData);

				expect(result).to.deep.equal(firstObject);
			});
		});
	});
});
