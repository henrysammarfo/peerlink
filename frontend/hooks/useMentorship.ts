import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

type CreateRequestPayload = { mentorId: string; message?: string }
type UpdateRequestPayload = { id: string; status: 'pending' | 'accepted' | 'rejected' }

export function useCreateMentorshipRequest() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateRequestPayload) => {
      const { data } = await api.post('/mentorship/request', payload)
      return data
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['mentorship', 'requests'] })
      client.invalidateQueries({ queryKey: ['mentorship', 'pending-count'] })
    },
  })
}

export function useUpdateMentorshipRequest() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: UpdateRequestPayload) => {
      const { data } = await api.patch(`/mentorship/${id}`, { status })
      return data
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['mentorship', 'requests'] })
    },
  })
}

export function useMyMentorshipRequests() {
  return useQuery({
    queryKey: ['mentorship', 'requests'],
    queryFn: async () => {
      const { data } = await api.get('/mentorship/user/requests')
      return data
    },
  })
}

export function usePendingRequestsCount() {
  return useQuery({
    queryKey: ['mentorship', 'pending-count'],
    queryFn: async () => {
      const { data } = await api.get('/mentorship/user/pending-count')
      return data
    },
  })
}



