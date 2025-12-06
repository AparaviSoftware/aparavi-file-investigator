import { WebhookResponse } from '../types';

/**
 * Extracts pipeline output from webhook response based on the expected structure.
 * Returns the text field from the first object if available, otherwise returns the
 * entire first object or falls back to the full response data.
 *
 * @param {WebhookResponse} responseData - The webhook response object containing pipeline output
 *
 * @return {any} Extracted text content, first object, or full response data as fallback
 *
 * @example
 *     const output = extractPipelineOutput(webhookResponse);
 */
export function extractPipelineOutput(responseData: WebhookResponse): any {
  try {
    // Check for expected structure: data.objects.{id}.text
    if (responseData?.data?.objects) {
      const objectIds = Object.keys(responseData.data.objects);

      if (objectIds.length > 0) {
        const firstObjectId = objectIds[0];
        const firstObject = responseData.data.objects[firstObjectId];

        // Return the text field if it exists
        if (firstObject?.text) {
          return firstObject.text;
        }

        // Otherwise return the entire object
        return firstObject;
      }
    }

    // Fallback: return entire response if structure doesn't match expected format
    console.warn('Unexpected response structure, returning full data');
    return responseData;
    
  } catch (error) {
    console.error('Error extracting pipeline output:', error);
    return responseData;
  }
}