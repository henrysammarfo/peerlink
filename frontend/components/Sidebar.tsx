'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MessagesSquare, LayoutDashboard, Users2, Settings } from 'lucide-react'

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/browse', label: 'Browse Mentors', icon: Users2 },
  { href: '/messages', label: 'Messages', icon: MessagesSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-background md:block">
      <div className="p-4 text-sm font-semibold text-muted-foreground">Navigation</div>
      <nav className="space-y-1 p-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
            pathname === href && 'bg-accent text-accent-foreground'
          )}>
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}



