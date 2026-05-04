import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../api/projects'
import { KPI } from '../types/models'

interface UseKpisReturn {
  kpis: KPI | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useKpis(): UseKpisReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['kpis'],
    queryFn: () => projectsApi.getKpis(),
  })

  return {
    kpis: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  }
}