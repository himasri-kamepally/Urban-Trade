'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export function CTASection() {
  const { requireAuth } = useAuth()
  const router = useRouter()

  const handleStartSelling = () => {
    requireAuth(() => {
      router.push('/sell')
    })
  }

  return (
    <section className="px-4 py-20 lg:px-8 lg:py-28 bg-secondary relative overflow-hidden">
      <div className="mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center sm:px-12 lg:px-20 lg:py-24 shadow-soft-xl"
        >
          <div className="relative z-10">
            <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight mb-5">
              Turn Unused Items<br/>
              <span className="text-foreground">
                Into Cash.
              </span>
            </h2>
            
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
              Join the modern neighborhood marketplace. List your item and connect with verified buyers in seconds.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={handleStartSelling}
                className="h-12 px-8 rounded-lg bg-foreground text-background text-sm font-bold shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 w-full sm:w-auto border-none cursor-pointer hover:bg-foreground/90"
              >
                <span className="flex items-center gap-2">
                  Start Selling <ArrowUpRight className="h-4 w-4" />
                </span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
