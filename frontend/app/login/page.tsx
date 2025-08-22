'use client'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

type FormValues = { email: string; password: string }

export default function LoginPage() {
  const { mutateAsync, isPending } = useLogin()
  const { toast } = useToast()
  const router = useRouter()
  const { register, handleSubmit } = useForm<FormValues>()

  const onSubmit = async (values: FormValues) => {
    try {
      await mutateAsync(values)
      toast({ title: 'Logged in' })
      router.replace('/dashboard')
    } catch (e: any) {
      toast({ title: 'Login failed', description: e?.response?.data?.message || 'Please check credentials', variant: 'destructive' })
    }
  }

  return (
    <div>
      <Navbar />
      <main className="container max-w-md py-10">
        <h1 className="text-2xl font-semibold">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required {...register('email')} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required {...register('password')} />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">Login</Button>
        </form>
      </main>
    </div>
  )
}



