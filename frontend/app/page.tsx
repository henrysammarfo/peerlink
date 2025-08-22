import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <main className="container py-16">
        <section className="mx-auto max-w-3xl text-center">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold tracking-tight">
            <span className="gradient-text">Find Mentors, Share Skills, Learn Together</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-4 text-muted-foreground">
            PeerLink connects learners and mentors in a decentralized network to grow faster together.
          </motion.p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="/signup"><Button>Get Started</Button></Link>
            <Link href="/browse"><Button variant="secondary">Browse Mentors</Button></Link>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {[{title:'Sign up',desc:'Create your account in seconds.'},{title:'Connect',desc:'Discover mentors and learners by skills.'},{title:'Learn',desc:'Message, schedule, and grow together.'}].map((s) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border p-6">
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  )
}



