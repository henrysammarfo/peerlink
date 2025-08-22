'use client'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Input } from '@/components/ui/input'
import { ProfileCard } from '@/components/ProfileCard'
import { useUsers } from '@/hooks/useUsers'
import { useState } from 'react'

export default function BrowsePage() {
  const [q, setQ] = useState('')
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('')
  const { data } = useUsers({ q, skills, location, role: 'mentor' })

  return (
    <div>
      <Navbar />
      <div className="container flex gap-6 py-6">
        <Sidebar />
        <main className="flex-1">
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Input placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.users || []).map((u: any) => (
              <ProfileCard key={u.id} user={u} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}



