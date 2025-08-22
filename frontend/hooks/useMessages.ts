'use client'

import { useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { io, Socket } from 'socket.io-client'

function useSocket(): Socket | null {
  const socket = useMemo(() => {
    if (typeof window === 'undefined') return null
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const token = localStorage.getItem('peerlink_token')
    return io(url, {
      auth: token ? { token: `Bearer ${token}` } : undefined,
      withCredentials: true,
    })
  }, [])

  useEffect(() => {
    return () => {
      socket?.disconnect()
    }
  }, [socket])

  return socket
}

export function useChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data } = await api.get('/messages/chats')
      return data
    },
  })
}

export function useMessages(userId?: string) {
  const client = useQueryClient()
  const socket = useSocket()

  useEffect(() => {
    if (!socket || !userId) return
    const handler = (payload: any) => {
      if (payload?.senderId === userId || payload?.receiverId === userId) {
        client.invalidateQueries({ queryKey: ['messages', userId] })
        client.invalidateQueries({ queryKey: ['chats'] })
      }
    }
    socket.on('message:new', handler)
    return () => {
      socket.off('message:new', handler)
    }
  }, [socket, userId, client])

  return useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data } = await api.get(`/messages/${userId}`)
      return data
    },
    enabled: !!userId,
  })
}

export function useSendMessage() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { receiverId: string; content: string }) => {
      const { data } = await api.post('/messages', payload)
      return data
    },
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ['messages', variables.receiverId] })
      client.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

export function useMarkRead() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (senderId: string) => {
      const { data } = await api.post(`/messages/${senderId}/read`)
      return data
    },
    onSuccess: (_data, senderId) => {
      client.invalidateQueries({ queryKey: ['messages', senderId] })
      client.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}



