export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isError?: boolean
  isLoading?: boolean
}

export interface ApiResponse {
  success: boolean
  result: string
  metadata?: {
    timestamp: string
    processingTime?: string
  }
}