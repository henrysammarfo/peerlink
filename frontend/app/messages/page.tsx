'use client'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { useChats, useMessages, useSendMessage } from '@/hooks/useMessages'
import { useMe } from '@/hooks/useAuth'
import { ChatBubble } from '@/components/ChatBubble'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function MessagesPage() {
  const { data: chats } = useChats()
  const [active, setActive] = useState<string | undefined>(chats?.[0]?.userId)
  const { data: messages } = useMessages(active)
  const { data: me } = useMe()
  const { mutate: send, isPending } = useSendMessage()
  const [text, setText] = useState('')

  const submit = () => {
    if (!active || !text.trim()) return
    send({ receiverId: active, content: text })
    setText('')
  }

  return (
    <div>
      <Navbar />
      <div className="container flex gap-6 py-6">
        <Sidebar />
        <main className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1 rounded-xl border">
            <div className="border-b p-3 text-sm font-semibold">Chats</div>
            <div className="max-h-[70vh] overflow-auto">
              {(chats || []).map((c: any) => (
                <button key={c.userId} className={`flex w-full items-center gap-3 p-3 text-left hover:bg-accent ${active === c.userId ? 'bg-accent' : ''}`} onClick={() => setActive(c.userId)}>
                  <div className="text-sm font-medium">{c.name}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2 flex h-[75vh] flex-col rounded-xl border">
            <div className="flex-1 space-y-2 overflow-auto p-3">
              {(messages || []).map((m: any) => (
                <ChatBubble key={m.id} message={m} meId={me?.id} />
              ))}
            </div>
            <div className="border-t p-3">
              <div className="flex gap-2">
                <Input placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
                <Button onClick={submit} disabled={isPending}>Send</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}



