'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Props = {
  message: any
  meId?: string
}

export function ChatBubble({ message, meId }: Props) {
  const isMine = message.senderId === meId
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[70%] rounded-lg px-3 py-2 text-sm', isMine ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
        <div>{message.content}</div>
        <div className={cn('mt-1 text-[10px] opacity-70', isMine ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  )
}



