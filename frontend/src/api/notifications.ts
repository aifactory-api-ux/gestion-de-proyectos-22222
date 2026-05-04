import apiClient from './client'
import { Notification, NotificationCreate } from '../types/models'

const NOTIFICATION_API_URL = import.meta.env.VITE_NOTIFICATION_API_URL || 'http://localhost:8003'

const notificationClient = apiClient
notificationClient.defaults.baseURL = NOTIFICATION_API_URL

export const notificationsApi = {
  getAll: async (type?: string, read?: boolean): Promise<Notification[]> => {
    const params: Record<string, string | boolean> = {}
    if (type) params.type = type
    if (read !== undefined) params.read = read
    const response = await notificationClient.get<Notification[]>('/api/notifications', { params })
    return response.data
  },

  create: async (data: NotificationCreate): Promise<Notification> => {
    const response = await notificationClient.post<Notification>('/api/notifications', data)
    return response.data
  },

  markAsRead: async (id: number): Promise<Notification> => {
    const response = await notificationClient.patch<Notification>(`/api/notifications/${id}/read`)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await notificationClient.delete(`/api/notifications/${id}`)
  },
}