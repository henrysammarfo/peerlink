import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { useMe } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div>
      <Navbar />
      <div className="container flex gap-6 py-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          {/* @ts-expect-error Server Component using client hook via child */}
          <Overview />
        </main>
      </div>
    </div>
  )
}

'use client'
function Overview() {
  const { data: me } = useMe()
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {me?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Email: {me?.email}</div>
          <div className="text-sm text-muted-foreground">Role: {me?.role || 'member'}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Mentorship requests pending: {/* dynamic via hook could be added */}</div>
        </CardContent>
      </Card>
    </div>
  )
}



