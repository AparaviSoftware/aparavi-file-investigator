import { ChatRequestBody, ChatResponse, ErrorResponse } from '../types/api';
import { getFingerprint } from './fingerprint';

const BACKEND_TYPE = import.meta.env.VITE_BACKEND_TYPE || 'express';
const EXPRESS_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const LAMBDA_API_URL = import.meta.env.VITE_LAMBDA_URL || '';

/**
 * Sends a chat message to the backend API
 *
 * @param {string} message - The user's message
 *
 * @return {Promise<ChatResponse>} The API response
 *
 * @example
 *     const response = await sendChatMessage('What files do you have?');
 */
export async function sendChatMessage(message: string): Promise<ChatResponse> {
	const fingerprintData = getFingerprint();

	const requestBody: ChatRequestBody = {
		message,
		fingerprint: fingerprintData
	};

	// Build the endpoint URL based on backend type
	// Express: append /api/chat route
	// Lambda: use Function URL directly (no route needed)
	const endpoint = BACKEND_TYPE === 'lambda'
		? LAMBDA_API_URL
		: `${EXPRESS_API_URL}/api/chat`;

	console.log('[API] Sending request to:', endpoint);
	console.log('[API] Backend type:', BACKEND_TYPE);
	console.log('[API] Request body:', requestBody);

	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});

		console.log('[API] Response status:', response.status);
		console.log('[API] Response headers:', Object.fromEntries(response.headers.entries()));

		if (!response.ok) {
			const errorData: ErrorResponse = await response.json();
			console.error('[API] Error response:', errorData);
			throw new Error(errorData.message || 'Failed to send message');
		}

		const data: ChatResponse = await response.json();
		console.log('[API] Success response:', data);
		return data;
	} catch (error) {
		console.error('[API] Request failed:', error);
		if (error instanceof TypeError && error.message.includes('fetch')) {
			throw new Error('Network error: Unable to connect to backend. Check CORS settings and Lambda Function URL configuration.');
		}
		throw error;
	}
}
