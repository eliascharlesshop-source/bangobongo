'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient, type ApiError } from '@/lib/api-client'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('API call failed:', err)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

// Specialized hooks
export function useProducts(params?: { category?: string; page?: number; limit?: number }) {
  return useApi(
    () => apiClient.products.list(params),
    [params?.category, params?.page, params?.limit]
  )
}

export function useProduct(id: string) {
  return useApi(
    () => apiClient.products.get(id),
    [id]
  )
}

export function useMusic(params?: { page?: number; limit?: number; published?: boolean }) {
  return useApi(
    () => apiClient.music.list(params),
    [params?.page, params?.limit, params?.published]
  )
}

export const useGear = (params?: { category?: string; page?: number; limit?: number }) => {
  // Gear data is managed locally on the page, return empty state
  // This triggers the fallback to sample data in the component
  return {
    data: null,
    loading: false,
    error: null,
    refetch: () => Promise.resolve()
  }
}

export const useTours = (params?: { upcoming?: boolean; page?: number; limit?: number }) => {
  return useApi(
    () => apiClient.tours.list(params),
    [params?.upcoming, params?.page, params?.limit]
  )
}

export function useCart(token?: string) {
  return useApi(
    () => token ? apiClient.cart.get(token) : Promise.reject(new Error('No token')),
    [token]
  )
}

export function useLicenseTiers() {
  return useApi(
    () => apiClient.licenses.getTiers(),
    []
  )
}

// Mutation hook for actions that modify data
export function useMutation<T, P>(
  mutationFn: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutationFn(params)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Mutation failed:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [mutationFn])

  return {
    mutate,
    loading,
    error,
    reset: () => setError(null)
  }
}
