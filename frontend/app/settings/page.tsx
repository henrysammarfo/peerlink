'use client'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useMe } from '@/hooks/useAuth'
import api from '@/lib/axios'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'

export default function SettingsPage() {
  const { data: me, refetch } = useMe()
  const { toast } = useToast()
  const [bio, setBio] = useState(me?.bio || '')
  const [skills, setSkills] = useState(Array.isArray(me?.skills) ? me?.skills?.join(', ') : me?.skills || '')
  const [availability, setAvailability] = useState(me?.availability || '')
  const [file, setFile] = useState<File | null>(null)

  const save = async () => {
    try {
      await api.patch('/user/update', { bio, skills, availability })
      toast({ title: 'Profile updated' })
      await refetch()
    } catch (e: any) {
      toast({ title: 'Update failed', description: e?.response?.data?.message || 'Try again', variant: 'destructive' })
    }
  }

  const upload = async () => {
    if (!file) return
    const form = new FormData()
    form.append('profilePicture', file)
    try {
      await api.post('/user/upload-picture', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast({ title: 'Picture uploaded' })
      await refetch()
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e?.response?.data?.message || 'Try again', variant: 'destructive' })
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container flex gap-6 py-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label>Bio</Label>
            <Input value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Skills (comma separated)</Label>
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Availability</Label>
            <Input value={availability} onChange={(e) => setAvailability(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Profile picture</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button onClick={upload}>Upload</Button>
          </div>
          <Button onClick={save}>Save changes</Button>
        </main>
      </div>
    </div>
  )
}



