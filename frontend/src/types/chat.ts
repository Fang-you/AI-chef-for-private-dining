export interface Message {
  role: 'user' | 'assistant'
  content: string
  image_url?: string
}

export interface ChatRequest {
  message: string
  image_url?: string
  thread_id: string
}

export interface ChatHistoryResponse {
  messages: Message[]
}

export interface OSSPresignResponse {
  uploadUrl: string
  contentType: string
  accessUrl: string
}
