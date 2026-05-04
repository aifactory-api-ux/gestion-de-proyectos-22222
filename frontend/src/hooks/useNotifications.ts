import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../api/notifications'
import { Notification, NotificationCreate } from '../types/models'

interface NotificationFilters {
  type?: 'budget_deviation' | 'milestone' | 'forecast_change' | 'ai_message'
  read?: boolean
}

interface UseNotificationsReturn {
  notifications: Notification[]
  loading: boolean
  error: string | null
  filters: NotificationFilters
  setFilters: (filters: NotificationFilters) => void
  markAsRead: (id: number) => Promise<void>
  deleteNotification: (id: number) => Promise<void>
  unreadCount: number
  refetch: () => void
}

export function useNotifications(): UseNotificationsReturn {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<NotificationFilters>({})

  const { data: notifications = [], isLoading, error, refetch } = useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => notificationsApi.getAll(filters.type, filters.read),
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length
  }, [notifications])

  const markAsRead = useCallback(async (id: number) => {
    await markAsReadMutation.mutateAsync(id)
  }, [markAsReadMutation])

  const deleteNotification = useCallback(async (id: number) => {
    await deleteMutation.mutateAsync(id)
  }, [deleteMutation])

  return {
    notifications,
    loading: isLoading,
    error: error?.message || null,
    filters,
    setFilters,
    markAsRead,
    deleteNotification,
    unreadCount,
    refetch,
  }
}