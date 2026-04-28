'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const { requireAuth } = useAuth()
  const router = useRouter()

  const handleStartSelling = () => {
    requireAuth(() => {
      router.push('/sell')
    })
  }

  return (
    <section ref={ref} className="px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "rounded-3xl border border-border bg-card px-6 py-16 text-center transition-all duration-700 sm:px-12 lg:px-24 lg:py-20",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <span className="text-muted-foreground">Got something to sell?</span>{' '}
            <span className="text-foreground">List it in 60 seconds.</span>
          </h2>
          
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            No fees. No friction. Just elegant local commerce.
          </p>
          
          <div className="mt-10">
            <Button
              size="lg"
              onClick={handleStartSelling}
              className="h-12 gap-2 rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
            >
              Start Selling
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
