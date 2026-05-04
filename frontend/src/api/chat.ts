import apiClient from './client'
import { ChatMessage, ChatMessageCreate } from '../types/models'

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8004'

const chatClient = apiClient
chatClient.defaults.baseURL = CHAT_API_URL

export const chatApi = {
  getMessages: async (projectId?: number): Promise<ChatMessage[]> => {
    const params = projectId ? { project_id: projectId } : {}
    const response = await chatClient.get<ChatMessage[]>('/api/chat/messages', { params })
    return response.data
  },

  sendMessage: async (data: ChatMessageCreate): Promise<ChatMessage> => {
    const response = await chatClient.post<ChatMessage>('/api/chat/messages', data)
    return response.data
  },
}