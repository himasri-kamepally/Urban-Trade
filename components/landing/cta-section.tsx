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
    <section ref={ref} className="px-4 py-20 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "relative overflow-hidden rounded-[3rem] border border-white/40 bg-white/40 backdrop-blur-2xl px-6 py-20 text-center transition-all duration-1000 sm:px-12 lg:px-24 lg:py-32 shadow-2xl shadow-black/5",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          {/* Background Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h2 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[0.9] mb-8">
              Got something to sell? <br/>
              <span className="text-primary">List it in 60 seconds.</span>
            </h2>
            
            <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
              Experience the future of local commerce. No fees, no friction, just pure speed. Join 2.5M+ sellers across India today.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleStartSelling}
                className="h-16 gap-3 rounded-2xl bg-primary px-10 text-lg font-black text-white transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
              >
                Start Selling Now
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                className="h-16 px-10 rounded-2xl text-lg font-bold hover:bg-white/50 backdrop-blur-sm transition-all"
                onClick={() => router.push('/marketplace')}
              >
                Browse Marketplace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
