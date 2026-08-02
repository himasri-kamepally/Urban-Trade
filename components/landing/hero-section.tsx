'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { Search, MapPin, ShieldCheck, Zap, Star, Plus, ArrowUpRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const { requireAuth } = useAuth()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-24 pb-16 bg-background">
      
      {/* Subtle animated background gradient */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-muted to-transparent rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-secondary to-transparent rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left"
          >
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border mb-6 hover:border-foreground/20 transition-all duration-300"
            >
              <span className="flex h-2 w-2 rounded-full bg-foreground animate-pulse-subtle" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Premium Local Commerce</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-[3.5rem] leading-[1.1] mb-6"
            >
              Your Neighborhood.<br/>
              <span className="relative">
                Your Marketplace.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl"
            >
              Experience seamless local trading with a premium, minimalist platform. Discover, buy, and sell verified items with trust and ease in your community.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <button 
                onClick={() => requireAuth(() => router.push('/sell'))}
                className="relative h-12 px-8 rounded-lg bg-foreground text-background text-sm font-bold shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 hover:scale-105 active:scale-95 border-none cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Start Selling 
                <ArrowUpRight className="h-4 w-4" />
              </button>
              
              <Link 
                href="/marketplace" 
                className="h-12 px-8 rounded-lg border border-border bg-secondary hover:bg-muted text-foreground text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto hover:border-foreground/30 hover:scale-105 active:scale-95"
              >
                <span>Browse Products</span>
                →
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex gap-10 mt-14 pt-8 border-t border-border"
            >
              <div className="space-y-1">
                <p className="text-2xl font-extrabold text-foreground">25K+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Users</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-extrabold text-foreground">15K+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Verified Listings</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-extrabold text-foreground">4.9★</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Community Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section: Floating Cards */}
          <div className="relative hidden lg:block h-[600px] w-full">
            
            {/* Card 1: Nearby Pickup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="absolute top-0 right-4 p-5 rounded-xl bg-card border border-border shadow-soft-xl w-80 z-30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-foreground border border-border">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Nearby Pickups</p>
                  <p className="text-xs text-muted-foreground">Within 1.5km</p>
                </div>
              </div>
              <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden relative border border-border">
                <Image 
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop" 
                  alt="Premium Sofa" 
                  fill 
                  className="object-cover hover:scale-110 transition-transform duration-300" 
                  unoptimized 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-foreground">Premium Sofa</span>
                <span className="text-foreground text-sm font-bold">₹12,500</span>
              </div>
            </motion.div>

            {/* Card 2: iPhone */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ y: -8 }}
              className="absolute top-1/3 left-0 p-4 rounded-xl bg-card border border-border shadow-soft-xl w-72 z-20 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-muted rounded-lg mb-4 overflow-hidden relative border border-border">
                <Image 
                  src="https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80&fit=crop" 
                  alt="iPhone" 
                  fill 
                  className="object-cover hover:scale-110 transition-transform duration-300" 
                  unoptimized 
                />
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2 py-1 bg-secondary text-foreground rounded-lg border border-border uppercase tracking-wider">Verified</span>
                <span className="text-xs font-bold text-foreground">₹45,000</span>
              </div>
              <h3 className="text-xs font-bold text-foreground">iPhone 15 Pro</h3>
            </motion.div>

            {/* Card 3: Live Chat */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ y: -8 }}
              className="absolute bottom-8 right-8 p-5 rounded-xl bg-card border border-border shadow-soft-xl w-80 z-40 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-8 w-8 rounded-full overflow-hidden border border-border bg-secondary">
                  <Image src="https://i.pravatar.cc/150?u=1" alt="User" fill className="object-cover" unoptimized/>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">Rahul Sharma</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Active now</p>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-foreground animate-pulse-subtle" />
              </div>
              <div className="bg-secondary p-3 rounded-lg text-xs text-muted-foreground mb-3 border border-border">
                "Is this still available for pickup today?"
              </div>
              <div className="bg-foreground p-3 rounded-lg text-xs text-background font-semibold ml-8 shadow-soft">
                "Yes, I can meet near the metro station."
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}
