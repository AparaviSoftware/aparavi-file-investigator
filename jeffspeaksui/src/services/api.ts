import { ApiResponse } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function sendMessage(message: string): Promise<ApiResponse> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to send message')
  }

  return response.json()
}