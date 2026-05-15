'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { Search, MapPin, ShieldCheck, Zap, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import DotField from '@/components/DotField'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const { requireAuth } = useAuth()
  const router = useRouter()
  
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* DotField Background */}
      <div className="absolute inset-0 overflow-hidden opacity-100 pointer-events-none">
        <DotField
          dotRadius={1.5}
          dotSpacing={20}
          cursorRadius={200}
          cursorForce={0.08}
          bulgeOnly
          bulgeStrength={30}
          glowRadius={0}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="#e23744"
          gradientTo="#fb7185"
          glowColor="transparent"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div 
            ref={contentRef}
            className={cn(
              "transition-all duration-700 ease-out z-10",
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 shadow-sm">
              <Zap className="h-4 w-4" />
              <span>India's fastest growing local marketplace</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              Buy & Sell <br/>
              <span className="text-primary drop-shadow-sm">Trusted Products</span><br/>
              Near You
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Discover amazing local deals, connect with verified sellers, and turn your used items into cash. Safe, fast, and simple.
            </p>

            {/* Search Box */}
            <div className="mt-8 p-2 bg-card rounded-2xl shadow-xl shadow-black/5 border border-border/50 max-w-xl">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <MapPin className="absolute left-4 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 w-full bg-transparent pl-11 pr-4 text-foreground focus:outline-none placeholder:text-muted-foreground border-r border-border/50"
                  />
                </div>
                <div className="relative flex-[2] flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for cars, phones, furniture..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 w-full bg-transparent pl-11 pr-4 text-foreground focus:outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <Button type="submit" size="lg" className="rounded-xl h-12 px-8 font-semibold shadow-md">
                  Search
                </Button>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span>Verified Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                <span>4.8/5 Average Rating</span>
              </div>
            </div>
          </div>

          {/* Right Floating Cards */}
          <div className="relative hidden lg:block h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-3xl border border-border/50 shadow-2xl overflow-hidden backdrop-blur-sm">
              {/* Decorative elements representing marketplace items */}
              <div className="absolute top-10 right-10 bg-card p-4 rounded-2xl shadow-xl border border-border/50 w-64 animate-float" style={{ animationDelay: '0s' }}>
                <div className="aspect-video bg-muted rounded-xl mb-3 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50" />
                  <Image src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80" alt="iPhone" fill className="object-cover mix-blend-multiply" unoptimized />
                </div>
                <h3 className="font-semibold">iPhone 13 Pro</h3>
                <p className="text-primary font-bold mt-1">₹45,000</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> HSR Layout, BLR
                </div>
              </div>

              <div className="absolute bottom-20 left-10 bg-card p-4 rounded-2xl shadow-xl border border-border/50 w-64 animate-float" style={{ animationDelay: '2s' }}>
                <div className="aspect-video bg-muted rounded-xl mb-3 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50" />
                  <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" alt="Sofa" fill className="object-cover mix-blend-multiply" unoptimized />
                </div>
                <h3 className="font-semibold">Modern Sofa Set</h3>
                <p className="text-primary font-bold mt-1">₹12,500</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> Andheri West, MUM
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
