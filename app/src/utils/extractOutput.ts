import { WebhookResponse } from '../types';

/**
 * Extract pipeline output from webhook response
 * Based on webhook docs: data.objects.{id}.text
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