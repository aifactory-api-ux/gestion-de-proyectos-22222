import { useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth'
import { User, UserCreate, UserLogin } from '../types/models'

interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (credentials: UserLogin) => Promise<void>
  logout: () => void
  register: (data: UserCreate) => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      authApi.getMe()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('access_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (credentials: UserLogin) => {
    setLoading(true)
    setError(null)
    try {
      const token = await authApi.login(credentials)
      localStorage.setItem('access_token', token.access_token)
      const userData = await authApi.getMe()
      setUser(userData)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    setUser(null)
  }, [])

  const register = useCallback(async (data: UserCreate) => {
    setLoading(true)
    setError(null)
    try {
      await authApi.register(data)
      await login({ email: data.email, password: data.password })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [login])

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    register,
  }
}