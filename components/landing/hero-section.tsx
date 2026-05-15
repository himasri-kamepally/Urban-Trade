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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* DotField Background */}
      <div className="absolute inset-0 overflow-hidden opacity-100 pointer-events-none">
        <DotField
          dotRadius={1}
          dotSpacing={24}
          cursorRadius={220}
          cursorForce={0.05}
          bulgeOnly
          bulgeStrength={20}
          glowRadius={0}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="#e23744"
          gradientTo="#fb7185"
          glowColor="transparent"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div 
            ref={contentRef}
            className={cn(
              "transition-all duration-1000 ease-out max-w-2xl",
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <h1 className="text-6xl font-black tracking-tight text-foreground sm:text-7xl lg:text-[6rem] leading-[0.85] mb-8">
              Buy Nearby.<br/>
              <span className="text-primary">Sell Instantly.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
              A modern local marketplace where people connect, chat, and trade directly within their community.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button 
                size="lg" 
                onClick={() => requireAuth(() => router.push('/sell'))}
                className="h-16 px-10 rounded-2xl bg-primary text-white text-lg font-black shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                Start Selling
              </Button>
              <Button 
                variant="ghost"
                size="lg"
                onClick={() => router.push('/marketplace')}
                className="h-16 px-10 rounded-2xl text-lg font-bold hover:bg-white/50 backdrop-blur-sm border border-transparent hover:border-border/50 transition-all w-full sm:w-auto"
              >
                Explore Marketplace
              </Button>
            </div>
          </div>

          {/* Right Section: Layered Floating UI */}
          <div className="relative hidden lg:block h-[600px]">
            {/* Nearby Pickup Card */}
            <div className="absolute top-0 right-12 bg-white/80 backdrop-blur-2xl p-5 rounded-[2.5rem] shadow-2xl border border-white/40 w-72 animate-float z-30" style={{ animationDelay: '0s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black">Nearby Pickups</p>
                  <p className="text-[10px] text-muted-foreground">Within 1.5km range</p>
                </div>
              </div>
              <div className="aspect-square bg-muted rounded-3xl mb-4 overflow-hidden relative">
                <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" alt="Sofa" fill className="object-cover" unoptimized />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">Premium Sofa</span>
                <span className="text-primary font-black">₹12,500</span>
              </div>
            </div>

            {/* Product Card */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/90 backdrop-blur-3xl p-4 rounded-[2rem] shadow-2xl border border-white/50 w-64 animate-float z-20" style={{ animationDelay: '1.5s' }}>
              <div className="aspect-[4/3] bg-muted rounded-2xl mb-3 overflow-hidden relative">
                <Image src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80" alt="iPhone" fill className="object-cover" unoptimized />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg">Verified</span>
                <span className="text-xs font-black text-primary">₹45,000</span>
              </div>
              <h3 className="text-sm font-bold truncate">iPhone 13 Pro</h3>
            </div>

            {/* Live Chat Popup */}
            <div className="absolute bottom-4 right-0 bg-white/95 backdrop-blur-2xl p-4 rounded-[1.5rem] shadow-2xl border border-white/60 w-64 animate-float z-40" style={{ animationDelay: '3s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-primary/10">
                  <Image src="https://i.pravatar.cc/150?u=1" alt="User" fill className="object-cover" unoptimized/>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black leading-none">Rahul Sharma</p>
                  <p className="text-[8px] text-muted-foreground">Active now</p>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="bg-secondary/50 p-2 rounded-xl text-[10px] text-foreground mb-2">
                "Is this still available for pickup today?"
              </div>
              <div className="bg-primary p-2 rounded-xl text-[10px] text-white text-right ml-8">
                "Yes, I can meet near the metro station."
              </div>
            </div>

            {/* Background Decorative Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse" />
          </div>

        </div>
      </div>
    </section>

        </div>
      </div>
    </section>
  )
}
