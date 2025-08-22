import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { useMe } from '@/hooks/useAuth'

export default function ProfilePage() {
  return (
    <div>
      <Navbar />
      <div className="container flex gap-6 py-6">
        <Sidebar />
        {/* @ts-expect-error Server Component with client hook via child */}
        <ProfileMe />
      </div>
    </div>
  )
}

'use client'
function ProfileMe() {
  const { data: me } = useMe()
  if (!me) return null
  return (
    <main className="flex-1 space-y-2">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <div>Name: {me.name}</div>
      <div>Email: {me.email}</div>
      <div>Skills: {Array.isArray(me.skills) ? me.skills.join(', ') : me.skills || '—'}</div>
      <div>Availability: {me.availability || '—'}</div>
    </main>
  )
}



