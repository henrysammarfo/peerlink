import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

export function useUsers(params: Record<string, string | number | boolean | undefined>) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const search = new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== '') acc[k] = String(v)
          return acc
        }, {})
      ).toString()
      const { data } = await api.get(`/users?${search}`)
      return data
    },
    keepPreviousData: true,
  })
}

export function useUserById(id?: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await api.get(`/users/${id}`)
      return data
    },
    enabled: !!id,
  })
}



