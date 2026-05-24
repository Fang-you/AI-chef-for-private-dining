import type { ChatHistoryResponse, OSSPresignResponse } from '../types/chat'

export const chatApi = {
  async getMessages(threadId: string): Promise<ChatHistoryResponse> {
    const response = await fetch(`/api/v1/chat/messages?thread_id=${threadId}`)
    if (!response.ok) throw new Error('Failed to fetch messages')
    return response.json()
  },

  async clearMessages(threadId: string): Promise<void> {
    const response = await fetch(`/api/v1/chat/messages?thread_id=${threadId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to clear messages')
  },

  async getPresignUrl(filename: string): Promise<OSSPresignResponse> {
    const response = await fetch(`/api/v1/oss/presign?filename=${encodeURIComponent(filename)}`)
    if (!response.ok) throw new Error('Failed to get presign URL')
    return response.json()
  },

  async uploadToOSS(uploadUrl: string, file: File, contentType: string): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': contentType }
    })
    if (!response.ok) throw new Error('Failed to upload image')
  }
}
