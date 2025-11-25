export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isError?: boolean
  isLoading?: boolean
  animate?: boolean  // Flag to indicate if message should have typewriter effect
}

export interface ApiResponse {
  success: boolean
  result: string
  metadata?: {
    timestamp: string
    processingTime?: string
  }
}