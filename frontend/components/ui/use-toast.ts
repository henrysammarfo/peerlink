// Minimal toast implementation compatible with shadcn/ui usage
import * as React from 'react'

type Toast = { id: string; title?: string; description?: string; variant?: 'default' | 'destructive' }

const ToastContext = React.createContext<{
  toasts: Toast[]
  add: (toast: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
} | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <Toaster/>')
  return { toast: (t: Omit<Toast, 'id'>) => ctx.add(t) }
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const add = (t: Omit<Toast, 'id'>) =>
    setToasts((prev) => [...prev, { ...t, id: Math.random().toString(36).slice(2) }])
  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))
  return (
    <ToastContext.Provider value={{ toasts, add, remove }}>
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md border p-4 shadow ${t.variant === 'destructive' ? 'border-destructive text-destructive-foreground bg-destructive/10' : 'bg-card text-card-foreground'}`}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm text-muted-foreground">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}



