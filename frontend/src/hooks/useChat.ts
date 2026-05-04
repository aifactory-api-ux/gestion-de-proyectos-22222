import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../api/chat'
import { ChatMessage, ChatMessageCreate } from '../types/models'

interface UseChatReturn {
  messages: ChatMessage[]
  loading: boolean
  error: string | null
  sendMessage: (message: string, projectId?: number) => Promise<void>
  isAiTyping: boolean
  chatOpen: boolean
  openChat: () => void
  closeChat: () => void
  refetch: () => void
}

export function useChat(): UseChatReturn {
  const queryClient = useQueryClient()
  const [chatOpen, setChatOpen] = useState(false)
  const [isAiTyping, setIsAiTyping] = useState(false)

  const { data: messages = [], isLoading, error, refetch } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: () => chatApi.getMessages(),
    enabled: chatOpen,
  })

  const sendMessageMutation = useMutation({
    mutationFn: (data: ChatMessageCreate) => chatApi.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] })
    },
  })

  const sendMessage = useCallback(async (message: string, projectId?: number) => {
    setIsAiTyping(true)
    try {
      await sendMessageMutation.mutateAsync({ message, project_id: projectId })
    } finally {
      setIsAiTyping(false)
    }
  }, [sendMessageMutation])

  const openChat = useCallback(() => setChatOpen(true), [])
  const closeChat = useCallback(() => setChatOpen(false), [])

  return {
    messages,
    loading: isLoading,
    error: error?.message || null,
    sendMessage,
    isAiTyping,
    chatOpen,
    openChat,
    closeChat,
    refetch,
  }
}