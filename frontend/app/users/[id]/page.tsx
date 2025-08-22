'use client'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { useUserById } from '@/hooks/useUsers'
import { Button } from '@/components/ui/button'
import { useCreateMentorshipRequest } from '@/hooks/useMentorship'
import { useToast } from '@/components/ui/use-toast'

export default function UserProfilePage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)
  const { data: user } = useUserById(id)
  const { mutateAsync, isPending } = useCreateMentorshipRequest()
  const { toast } = useToast()

  const request = async () => {
    try {
      await mutateAsync({ mentorId: id })
      toast({ title: 'Request sent' })
    } catch (e: any) {
      toast({ title: 'Failed to send request', description: e?.response?.data?.message || 'Try again', variant: 'destructive' })
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container flex gap-6 py-6">
        <Sidebar />
        <main className="flex-1 space-y-4">
          <h1 className="text-2xl font-semibold">{user?.name}</h1>
          <div className="text-muted-foreground">{user?.bio}</div>
          <div><span className="font-medium">Skills:</span> {Array.isArray(user?.skills) ? user.skills.join(', ') : user?.skills || '—'}</div>
          <div><span className="font-medium">Availability:</span> {user?.availability || '—'}</div>
          <Button onClick={request} disabled={isPending}>Request Mentorship</Button>
        </main>
      </div>
    </div>
  )
}



