'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { Search, MapPin, ShieldCheck, Zap, Star, Plus } from 'lucide-react'
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
    <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-32">
      {/* DotField Background */}
      <div className="absolute inset-0 overflow-hidden opacity-100 pointer-events-none">
        <DotField
          dotRadius={1.2}
          dotSpacing={22}
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
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div 
            ref={contentRef}
            className={cn(
              "transition-all duration-700 ease-out",
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="inline-flex items-center gap-3 px-1 py-1 pr-4 rounded-full bg-white/60 backdrop-blur-md border border-border/40 text-foreground font-medium text-sm mb-10 shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                <Zap className="h-4 w-4" />
              </div>
              <span>2.5M+ Active Users in India</span>
            </div>
            
            <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-7xl lg:text-8xl leading-[0.9] mb-8">
              Trade<span className="text-primary">+</span> <br/>
              <span className="text-foreground/90">Trusted.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed mb-10">
              The premium marketplace to discover amazing local deals, connect with verified sellers, and turn your unused items into instant cash.
            </p>

            {/* Premium Search Box with high Glassmorphism */}
            <div className="p-2 bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-black/5 border border-white/40 max-w-2xl">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <MapPin className="absolute left-5 h-5 w-5 text-primary" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-14 w-full bg-transparent pl-12 pr-4 text-foreground font-medium focus:outline-none placeholder:text-muted-foreground/60 border-r border-border/30"
                  />
                </div>
                <div className="relative flex-[2] flex items-center">
                  <Search className="absolute left-5 h-5 w-5 text-primary" />
                  <input
                    type="text"
                    placeholder="Search for Anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 w-full bg-transparent pl-12 pr-4 text-foreground font-medium focus:outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
                <Button type="submit" size="lg" className="rounded-2xl h-14 px-10 font-bold shadow-xl bg-primary hover:bg-primary/90 text-white transition-all hover:scale-105 active:scale-95">
                  Search
                </Button>
              </form>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex items-center gap-8 grayscale opacity-60">
              <div className="font-bold text-xl tracking-tighter">TRUSTED PARTNER</div>
              <div className="flex gap-6 items-center">
                <span className="font-black text-2xl tracking-tighter">UrbanPay</span>
                <span className="font-black text-2xl tracking-tighter">Shield+</span>
              </div>
            </div>
          </div>

          {/* Right Section: Premium Glassy Cards inspired by 'Grow+' */}
          <div className="relative hidden lg:block h-[700px]">
            {/* Main Visual Element */}
            <div className="absolute inset-0 bg-primary/5 rounded-[3rem] border border-white/40 shadow-2xl overflow-hidden backdrop-blur-md">
              {/* Large Image Background */}
              <div className="absolute inset-0 opacity-20">
                <Image src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1200&q=80" alt="Marketplace" fill className="object-cover" unoptimized/>
              </div>

              {/* Floating Portal Cards */}
              <div className="absolute top-12 left-10 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/20 w-72 animate-float" style={{ animationDelay: '0s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Verified Listing</p>
                    <p className="text-[10px] text-muted-foreground">Checked by UrbanTrade</p>
                  </div>
                </div>
                <div className="aspect-[4/3] bg-muted rounded-2xl mb-4 overflow-hidden relative border border-border/30">
                  <Image src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80" alt="iPhone" fill className="object-cover" unoptimized />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-bold">iPhone 13 Pro</h3>
                    <p className="text-primary font-black text-lg">₹45,000</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pb-1">
                    <Star className="h-3 w-3 text-orange-400 fill-orange-400" /> 4.8
                  </div>
                </div>
              </div>

              <div className="absolute bottom-12 right-10 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/20 w-72 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Nearby Pickups</p>
                    <p className="text-[10px] text-muted-foreground">Within 2km range</p>
                  </div>
                </div>
                <div className="aspect-[4/3] bg-muted rounded-2xl mb-4 overflow-hidden relative border border-border/30">
                  <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" alt="Sofa" fill className="object-cover" unoptimized />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-bold">Premium Sofa</h3>
                    <p className="text-primary font-black text-lg">₹12,500</p>
                  </div>
                  <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-lg">NEW</div>
                </div>
              </div>

              {/* Center Floating Action Bubble */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white p-6 rounded-full shadow-2xl animate-pulse cursor-pointer hover:scale-110 transition-transform">
                <Plus className="h-8 w-8" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
