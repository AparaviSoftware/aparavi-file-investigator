import { WebhookResponse } from '@types';

export default class PipelineOutput {
	/**
	 * Extracts pipeline output from webhook response based on the expected structure.
	 * Priority order:
	 * 1. First element from answers array if present
	 * 2. Text field from the first object in data.objects
	 * 3. Full response data as fallback
	 *
	 * @param {WebhookResponse} responseData - The webhook response object containing pipeline output
	 *
	 * @return {any} Extracted text content, first object, or full response data as fallback
	 *
	 * @example
	 *     const output = PipelineOutput.extract(webhookResponse);
	 */
	static extract(responseData: WebhookResponse): any {
		// Check for answers array first (highest priority)
		if (responseData?.answers && Array.isArray(responseData.answers) && responseData.answers.length > 0) {
			return responseData.answers[0];
		}

		// Check for expected structure: data.objects.{id}.text
		if (!responseData?.data?.objects) {
			return responseData;
		}

		const objectIds = Object.keys(responseData.data.objects);

		if (objectIds.length === 0) {
			return responseData;
		}

		const firstObjectId = objectIds[0];
		const firstObject = responseData.data.objects[firstObjectId];

		// Return the text field if it exists, otherwise return the entire object
		return firstObject?.text || firstObject;
	}
}
