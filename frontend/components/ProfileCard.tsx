'use client'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Props = {
  user: any
}

export function ProfileCard({ user }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card className="card-hover">
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profilePictureUrl} alt={user?.name} />
            <AvatarFallback>{user?.name?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{user?.name}</CardTitle>
            <div className="text-sm text-muted-foreground">{user?.location || '—'}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-3 text-sm">
            <span className="font-medium">Skills:</span> {Array.isArray(user?.skills) ? user.skills.join(', ') : user?.skills || '—'}
          </div>
          <div className="flex gap-2">
            <Link href={`/users/${user.id}`} className="w-full"><Button className="w-full">View Profile</Button></Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}



