import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../api/projects'
import { Project, ProjectCreate, ProjectUpdate, TrendPoint } from '../types/models'

interface UseProjectsReturn {
  projects: Project[]
  loading: boolean
  error: string | null
  selectedProject: Project | null
  trendData: TrendPoint[]
  selectProject: (project: Project | null) => void
  fetchTrend: (projectId: number) => Promise<void>
  createProject: (data: ProjectCreate) => Promise<void>
  updateProject: (id: number, data: ProjectUpdate) => Promise<void>
  deleteProject: (id: number) => Promise<void>
  refetch: () => void
}

export function useProjects(): UseProjectsReturn {
  const queryClient = useQueryClient()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [trendData, setTrendData] = useState<TrendPoint[]>([])

  const { data: projects = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: ProjectCreate) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectUpdate }) => projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  const selectProject = useCallback((project: Project | null) => {
    setSelectedProject(project)
  }, [])

  const fetchTrend = useCallback(async (projectId: number) => {
    const data = await projectsApi.getTrend(projectId)
    setTrendData(data)
  }, [])

  const createProject = useCallback(async (data: ProjectCreate) => {
    await createMutation.mutateAsync(data)
  }, [createMutation])

  const updateProject = useCallback(async (id: number, data: ProjectUpdate) => {
    await updateMutation.mutateAsync({ id, data })
  }, [updateMutation])

  const deleteProject = useCallback(async (id: number) => {
    await deleteMutation.mutateAsync(id)
  }, [deleteMutation])

  return {
    projects,
    loading,
    error: error?.message || null,
    selectedProject,
    trendData,
    selectProject,
    fetchTrend,
    createProject,
    updateProject,
    deleteProject,
    refetch,
  }
}