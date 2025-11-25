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

        // Check for other content fields
        if (firstObject?.content) {
          return firstObject.content;
        }
        if (firstObject?.result) {
          return firstObject.result;
        }
        if (firstObject?.response) {
          return firstObject.response;
        }
        if (firstObject?.output) {
          return firstObject.output;
        }

        // If no text/content field, convert object to string for display
        // Frontend expects a string, not an object
        if (typeof firstObject === 'object') {
          return JSON.stringify(firstObject, null, 2);
        }

        // Otherwise return as string
        return String(firstObject);
      }
    }

    // Fallback: return entire response if structure doesn't match expected format
    console.warn('Unexpected response structure, returning full data');
    return typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : String(responseData);
    
  } catch (error) {
    console.error('Error extracting pipeline output:', error);
    return typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : String(responseData);
  }
}