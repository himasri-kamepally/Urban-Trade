'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { Search, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const { requireAuth } = useAuth()
  const router = useRouter()
  
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation()
  const { ref: searchRef, isVisible: searchVisible } = useScrollAnimation()
  const { ref: buttonsRef, isVisible: buttonsVisible } = useScrollAnimation()

  const handleSellNow = () => {
    requireAuth(() => {
      router.push('/sell')
    })
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-24 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div
            ref={headingRef}
            className={cn(
              "transition-all duration-700 ease-out",
              headingVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            )}
          >
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              Buy & Sell Locally
              <span className="block mt-2">with Confidence</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
              A premium marketplace for your city. Discover great deals, sell in minutes, and connect with verified neighbors.
            </p>
          </div>
          
          <form
            ref={searchRef}
            onSubmit={(e) => {
              e.preventDefault()
              if (searchQuery) {
                window.location.href = `/marketplace?q=${encodeURIComponent(searchQuery)}`
              }
            }}
            className={cn(
              "mx-auto mt-12 max-w-2xl transition-all duration-700 delay-150 ease-out",
              searchVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            )}
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything — iPhone, sofa, bike..."
                className="h-14 w-full rounded-xl border border-border bg-card pl-14 pr-32 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-lg bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200"
              >
                Search
              </Button>
            </div>
          </form>
          
          <div 
            ref={buttonsRef}
            className={cn(
              "mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-700 delay-300 ease-out",
              buttonsVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            )}
          >
            <Link href="/marketplace">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[160px] rounded-xl border-border bg-transparent text-foreground hover:bg-secondary transition-all duration-200"
              >
                Browse Items
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              onClick={handleSellNow}
              className="min-w-[160px] rounded-xl bg-secondary font-medium text-foreground hover:bg-secondary/80 transition-all duration-200"
            >
              Sell Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
