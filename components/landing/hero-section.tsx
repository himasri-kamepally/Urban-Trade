'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { Search, MapPin, ShieldCheck, Zap, Star, Plus, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import DotField from '@/components/DotField'
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
    <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-28 pb-16 bg-[#07110F]">
      
      {/* Subtle Noise Overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Subtle ReactBits DotField Background */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.3] pointer-events-none">
        <DotField
          dotRadius={1.8}
          dotSpacing={22}
          cursorRadius={280}
          cursorForce={0.06}
          bulgeOnly
          bulgeStrength={25}
          glowRadius={0}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="#5BFF9D"
          gradientTo="#49D17D"
          glowColor="transparent"
        />
      </div>

      {/* Ambient Radial Glow behind Cards & Typography */}
      <div className="absolute top-[20%] right-[-5%] w-[550px] h-[550px] bg-[#49D17D]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-[#5BFF9D]/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Startup Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[#49D17D] animate-pulse" />
              <span className="text-[11px] font-bold text-[#9BA7A3] uppercase tracking-wider">Next-Gen Local Commerce</span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-[#F5F7F6] sm:text-6xl lg:text-[4.8rem] leading-[1.05] font-clash mb-6 relative">
              Your Neighborhood.<br/>
              <span className="bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(73,209,125,0.15)]">
                Your Marketplace.
              </span>
            </h1>
            
            <p className="text-lg text-[#9BA7A3] font-inter leading-relaxed mb-10 max-w-xl">
              Experience local trading elevated. Connect with your community to discover, buy, and sell verified items on a secure, glassmorphism-designed social ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button 
                size="lg" 
                onClick={() => requireAuth(() => router.push('/sell'))}
                className="relative overflow-hidden group h-14 px-8 rounded-full bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] text-[#07110F] text-md font-bold shadow-lg shadow-[#49D17D]/20 hover:shadow-[#49D17D]/40 transition-all duration-300 w-full sm:w-auto border-none cursor-pointer"
              >
                {/* Magnetic-like slide text effect */}
                <span className="relative z-10 flex items-center gap-2">
                  Start Selling <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <span className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
              
              <Link 
                href="/marketplace" 
                className="h-14 px-8 rounded-full border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15] text-[#F5F7F6] text-md font-semibold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto backdrop-blur-md"
              >
                Browse Products
              </Link>
            </div>
          </motion.div>

          {/* Right Section: Layered Floating Glassmorphism UI */}
          <div className="lg:col-span-5 relative hidden lg:block h-[580px] w-full">
            
            {/* Card 1: Nearby Pickup Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="absolute top-0 right-8 bg-white/[0.03] backdrop-blur-xl p-5 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/[0.08] w-72 z-30 transition-all duration-300 hover:border-[#49D17D]/30 group"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#49D17D]/0 to-[#49D17D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-[#49D17D]/10 flex items-center justify-center text-[#49D17D]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#F5F7F6]">Nearby Pickups</p>
                  <p className="text-[10px] text-[#9BA7A3]">Within 1.5km range</p>
                </div>
              </div>
              <div className="aspect-square bg-white/[0.02] rounded-2xl mb-4 overflow-hidden relative border border-white/[0.05]">
                <Image 
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" 
                  alt="Sofa" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  unoptimized 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#F5F7F6]">Premium Sofa</span>
                <span className="text-[#49D17D] text-sm font-extrabold">₹12,500</span>
              </div>
            </motion.div>

            {/* Card 2: Product Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/[0.03] backdrop-blur-xl p-4 rounded-[1.75rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/[0.08] w-64 z-20 transition-all duration-300 hover:border-[#5BFF9D]/30 group"
            >
              <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-[#5BFF9D]/0 to-[#5BFF9D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="aspect-[4/3] bg-white/[0.02] rounded-xl mb-3 overflow-hidden relative border border-white/[0.05]">
                <Image 
                  src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80" 
                  alt="iPhone" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  unoptimized 
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#49D17D]/10 text-[#49D17D] rounded border border-[#49D17D]/25">Verified</span>
                <span className="text-xs font-extrabold text-[#49D17D]">₹45,000</span>
              </div>
              <h3 className="text-xs font-bold text-[#F5F7F6] truncate">iPhone 13 Pro</h3>
            </motion.div>

            {/* Card 3: Live Chat Popup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="absolute bottom-6 right-2 bg-white/[0.04] backdrop-blur-xl p-4 rounded-[1.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/[0.08] w-64 z-40 transition-all duration-300 hover:border-[#49D17D]/30 group"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/10 bg-white/5">
                  <Image src="https://i.pravatar.cc/150?u=1" alt="User" fill className="object-cover" unoptimized/>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-bold text-[#F5F7F6] leading-none">Rahul Sharma</p>
                  <p className="text-[8px] text-[#9BA7A3] mt-0.5">Active now</p>
                </div>
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#49D17D]" />
              </div>
              <div className="bg-white/5 p-2 rounded-xl text-[10px] text-[#9BA7A3] mb-2 border border-white/[0.04]">
                "Is this still available for pickup today?"
              </div>
              <div className="bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] p-2 rounded-xl text-[10px] text-[#07110F] font-semibold text-right ml-8 shadow-md">
                "Yes, I can meet near the metro station."
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}
