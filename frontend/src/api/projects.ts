import apiClient from './client'
import { Project, ProjectCreate, ProjectUpdate, KPI, TrendPoint } from '../types/models'

const PROJECT_API_URL = import.meta.env.VITE_PROJECT_API_URL || 'http://localhost:8002'

const projectClient = apiClient

projectClient.defaults.baseURL = PROJECT_API_URL

export const projectsApi = {
  getAll: async (status?: string): Promise<Project[]> => {
    const params = status ? { status } : {}
    const response = await projectClient.get<Project[]>('/api/projects', { params })
    return response.data
  },

  getById: async (id: number): Promise<Project> => {
    const response = await projectClient.get<Project>(`/api/projects/${id}`)
    return response.data
  },

  create: async (data: ProjectCreate): Promise<Project> => {
    const response = await projectClient.post<Project>('/api/projects', data)
    return response.data
  },

  update: async (id: number, data: ProjectUpdate): Promise<Project> => {
    const response = await projectClient.patch<Project>(`/api/projects/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await projectClient.delete(`/api/projects/${id}`)
  },

  getTrend: async (id: number): Promise<TrendPoint[]> => {
    const response = await projectClient.get<TrendPoint[]>(`/api/projects/${id}/trend`)
    return response.data
  },

  getKpis: async (): Promise<KPI> => {
    const response = await projectClient.get<KPI>('/api/kpis')
    return response.data
  },
}