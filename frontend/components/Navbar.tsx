'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useMe, useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const { data: me } = useMe()
  const { mutate: logout, isPending } = useLogout()

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={cn('text-sm font-medium hover:text-primary', pathname === href && 'text-primary')}
    >
      {label}
    </Link>
  )

  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold">
          <span className="gradient-text">PeerLink</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLink('/browse', 'Browse')}
          {navLink('/messages', 'Messages')}
          {navLink('/dashboard', 'Dashboard')}
        </nav>
        <div className="flex items-center gap-3">
          {!me ? (
            <>
              <Link href="/login"><Button variant="ghost">Login</Button></Link>
              <Link href="/signup"><Button>Sign Up</Button></Link>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">Hi, {me.name}</span>
              <Link href="/settings"><Button variant="secondary">Settings</Button></Link>
              <Button variant="ghost" onClick={() => logout()} disabled={isPending}>Logout</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}



