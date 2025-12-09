import { ChatRequestBody, ChatResponse, ErrorResponse } from '../types/api';
import { getFingerprint } from './fingerprint';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

	const response = await fetch(`${API_BASE_URL}/api/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});

	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.message || 'Failed to send message');
	}

	const data: ChatResponse = await response.json();
	return data;
}
