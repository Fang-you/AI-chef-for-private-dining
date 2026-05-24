import { ref, onMounted } from 'vue'
import type { Message, ChatRequest } from '../types/chat'
import { chatApi } from '../api/chat'

const THREAD_ID_KEY = 'chef_thread_id'

function getThreadId(): string {
  let threadId = localStorage.getItem(THREAD_ID_KEY)
  if (!threadId) {
    threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(THREAD_ID_KEY, threadId)
  }
  return threadId
}

export function useChat() {
  const messages = ref<Message[]>([])
  const isStreaming = ref(false)
  const error = ref<string | null>(null)
  const threadId = ref(getThreadId())

  async function loadHistory() {
    try {
      const response = await chatApi.getMessages(threadId.value)
      messages.value = response.messages
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }

  async function sendMessage(content: string, imageUrl?: string) {
    if (!content.trim() && !imageUrl) return

    isStreaming.value = true
    error.value = null

    const userMessage: Message = { role: 'user', content, image_url: imageUrl }
    messages.value.push(userMessage)

    const aiMessage: Message = { role: 'assistant', content: '' }
    messages.value.push(aiMessage)

    try {
      const requestBody: ChatRequest = { message: content, thread_id: threadId.value }
      if (imageUrl) requestBody.image_url = imageUrl

      const response = await fetch('/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Response body is null')

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        aiMessage.content += chunk
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '发送失败'
      messages.value.pop()
    } finally {
      isStreaming.value = false
    }
  }

  async function newSession() {
    try {
      await chatApi.clearMessages(threadId.value)
    } catch (err) {
      console.error('Failed to clear messages:', err)
    }

    const newThreadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(THREAD_ID_KEY, newThreadId)
    threadId.value = newThreadId
    messages.value = []
    error.value = null
  }

  onMounted(() => { loadHistory() })

  return { messages, isStreaming, error, sendMessage, newSession }
}
