import apiClient from './client'
import { User, UserCreate, UserLogin, Token } from '../types/models'

export const authApi = {
  register: async (data: UserCreate): Promise<User> => {
    const response = await apiClient.post<User>('/api/auth/register', data)
    return response.data
  },

  login: async (data: UserLogin): Promise<Token> => {
    const response = await apiClient.post<Token>('/api/auth/login', data)
    return response.data
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/me')
    return response.data
  },
}