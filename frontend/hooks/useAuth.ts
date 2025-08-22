import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

type LoginPayload = { email: string; password: string }
type SignupPayload = { name: string; email: string; password: string }

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/user/me')
      return data
    },
    staleTime: 1000 * 60,
  })
}

export function useLogin() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post('/auth/login', payload)
      if (typeof window !== 'undefined' && data?.accessToken) {
        localStorage.setItem('peerlink_token', data.accessToken)
        // Set a lightweight indicator cookie for middleware-based protection
        document.cookie = `logged_in=true; path=/; max-age=${60 * 60 * 24 * 7}`
      }
      return data
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useSignup() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const { data } = await api.post('/auth/signup', payload)
      if (typeof window !== 'undefined' && data?.accessToken) {
        localStorage.setItem('peerlink_token', data.accessToken)
        document.cookie = `logged_in=true; path=/; max-age=${60 * 60 * 24 * 7}`
      }
      return data
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['me'] }),
  })
}

export function useLogout() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('peerlink_token')
        // Unset indicator cookie
        document.cookie = 'logged_in=; path=/; max-age=0'
      }
    },
    onSuccess: async () => {
      await client.resetQueries()
    },
  })
}


