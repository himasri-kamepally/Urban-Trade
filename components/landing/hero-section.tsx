'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { Search, MapPin, ShieldCheck, Zap, Star, Plus, ArrowUpRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import DotField from '@/components/DotField'
import { motion } from 'framer-motion'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { requireAuth } = useAuth()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-28 pb-16 bg-[#07110F]">
      
      {/* Ambient Radial Glow - Enhanced */}
      <div className="absolute top-[10%] right-[-8%] w-[700px] h-[700px] bg-gradient-radial from-[#49D17D]/8 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[5%] left-[-5%] w-[600px] h-[600px] bg-gradient-radial from-[#5BFF9D]/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#49D17D]/3 rounded-full blur-[200px] pointer-events-none opacity-40" />

      {/* Enhanced Animated DotField Background with better visibility */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.45] pointer-events-none">
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

      {/* Animated Noise Texture - More prominent */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none animate-noise" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%235BFF9D'/%3E%3C/svg%3E")`
        }}
      />

      {/* Floating Particle System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#49D17D] rounded-full"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-30" />

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
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-[#49D17D]/20 backdrop-blur-md mb-6 group hover:border-[#49D17D]/50 hover:bg-white/[0.05] transition-all duration-300"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#49D17D] animate-pulse" />
              <span className="text-[11px] font-bold text-[#9BA7A3] uppercase tracking-widest">Next-Gen Local Commerce</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl font-extrabold tracking-tight text-[#F5F7F6] sm:text-6xl lg:text-[4.8rem] leading-[1.05] font-clash mb-6 relative"
            >
              Your Neighborhood.<br/>
              <span className="relative">
                <span className="bg-gradient-to-r from-[#49D17D] via-[#5BFF9D] to-[#49D17D] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(73,209,125,0.4)]">
                  Your Marketplace.
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#49D17D]/0 via-[#49D17D]/20 to-[#49D17D]/0 blur-2xl -z-10 animate-pulse-slow" />
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-[#9BA7A3] font-inter leading-relaxed mb-10 max-w-xl"
            >
              Experience local trading elevated. Connect with your community to discover, buy, and sell verified items on a secure, glassmorphism-designed social ecosystem.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <button 
                onClick={() => requireAuth(() => router.push('/sell'))}
                className="relative overflow-hidden group h-14 px-8 rounded-full bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] text-[#07110F] text-md font-bold shadow-lg shadow-[#49D17D]/30 hover:shadow-[#49D17D]/60 transition-all duration-300 w-full sm:w-auto border-none cursor-pointer hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Start Selling 
                  <motion.span 
                    className="transition-transform duration-300"
                    whileHover={{ x: 2, y: -2 }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.span>
                </span>
                <motion.span 
                  className="absolute inset-0 bg-white/20" 
                  initial={{ translate: '0 100%' }}
                  whileHover={{ translate: '0 0' }}
                  transition={{ duration: 0.3 }}
                />
                {/* Glowing pulse effect */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]" />
              </button>
              
              <Link 
                href="/marketplace" 
                className="h-14 px-8 rounded-full border border-[#49D17D]/30 bg-[#49D17D]/5 hover:bg-[#49D17D]/10 text-[#F5F7F6] text-md font-semibold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto backdrop-blur-md hover:border-[#49D17D]/60 hover:scale-105 active:scale-95 group"
              >
                <span>Browse Products</span>
                <motion.span 
                  whileHover={{ x: 4 }}
                  className="transition-transform"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>

            {/* Stats - Premium Layout */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex gap-8 mt-14 pt-8 border-t border-white/[0.08]"
            >
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-[#49D17D]">25K+</p>
                <p className="text-xs text-[#9BA7A3] uppercase tracking-wider font-semibold">Active Users</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-[#5BFF9D]">15K+</p>
                <p className="text-xs text-[#9BA7A3] uppercase tracking-wider font-semibold">Verified Listings</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-[#49D17D]">4.9★</p>
                <p className="text-xs text-[#9BA7A3] uppercase tracking-wider font-semibold">Community Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section: Premium Floating Glassmorphism Cards */}
          <div className="lg:col-span-5 relative hidden lg:block h-[680px] w-full perspective">
            
            {/* Floating glow orbs around cards */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-[#49D17D]/10 rounded-full" />
              <div className="absolute bottom-1/4 right-1/3 w-96 h-96 border border-[#5BFF9D]/5 rounded-full" />
            </motion.div>

            {/* Card 1: Nearby Pickup - Premium Floating */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 60, x: -40 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.23, 1, 0.320, 1] }}
              whileHover={{ y: -12, scale: 1.05, transition: { duration: 0.3 } }}
              className="absolute top-0 right-8 backdrop-blur-2xl p-5 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[#49D17D]/20 w-80 z-30 transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              }}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#49D17D]/0 via-transparent to-[#49D17D]/10 shadow-[inset_0_1px_0_rgba(91,255,157,0.2)]" />
              <div className="absolute -inset-0.5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#49D17D]/20 to-[#5BFF9D]/20 blur-lg transition-opacity duration-500 -z-10" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#49D17D]/20 to-[#49D17D]/5 flex items-center justify-center text-[#49D17D] border border-[#49D17D]/30">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#F5F7F6]">Nearby Pickups</p>
                    <p className="text-xs text-[#9BA7A3]">Within 1.5km range</p>
                  </div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl mb-4 overflow-hidden relative border border-white/[0.1] group/img">
                  <Image 
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop" 
                    alt="Premium Sofa" 
                    fill 
                    className="object-cover transition-all duration-500 group-hover/img:scale-110 brightness-90 contrast-110" 
                    unoptimized 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#F5F7F6]">Premium Sofa</span>
                  <span className="text-[#49D17D] text-sm font-extrabold">₹12,500</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: iPhone Product - Medium Floating */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 80, x: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.23, 1, 0.320, 1] }}
              whileHover={{ y: -12, scale: 1.05, transition: { duration: 0.3 } }}
              className="absolute top-1/3 left-4 backdrop-blur-2xl p-4 rounded-[2.2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[#5BFF9D]/15 w-72 z-20 transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 100%)',
              }}
            >
              <div className="absolute inset-0 rounded-[2.2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#5BFF9D]/0 via-transparent to-[#5BFF9D]/5 shadow-[inset_0_1px_0_rgba(91,255,157,0.15)]" />
              <div className="absolute -inset-0.5 rounded-[2.2rem] opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#5BFF9D]/15 to-[#49D17D]/10 blur-lg transition-opacity duration-500 -z-10" />
              
              <div className="relative z-10">
                <div className="aspect-[4/3] bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-xl mb-4 overflow-hidden relative border border-white/[0.1] group/img2">
                  <Image 
                    src="https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80&fit=crop" 
                    alt="iPhone" 
                    fill 
                    className="object-cover transition-all duration-500 group-hover/img2:scale-110 brightness-95 contrast-125" 
                    unoptimized 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/img2:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-3 py-1 bg-[#49D17D]/15 text-[#49D17D] rounded-full border border-[#49D17D]/30 uppercase tracking-wider">Verified</span>
                  <span className="text-xs font-extrabold text-[#5BFF9D]">₹45,000</span>
                </div>
                <h3 className="text-xs font-bold text-[#F5F7F6]">iPhone 15 Pro</h3>
              </div>
            </motion.div>

            {/* Card 3: Live Chat Popup - Premium */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 100, x: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.23, 1, 0.320, 1] }}
              whileHover={{ y: -12, scale: 1.05, transition: { duration: 0.3 } }}
              className="absolute bottom-8 right-6 backdrop-blur-2xl p-5 rounded-[2.2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[#49D17D]/15 w-80 z-40 transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              }}
            >
              <div className="absolute inset-0 rounded-[2.2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#49D17D]/0 via-transparent to-[#49D17D]/8 shadow-[inset_0_1px_0_rgba(73,209,125,0.2)]" />
              <div className="absolute -inset-0.5 rounded-[2.2rem] opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#49D17D]/15 to-[#5BFF9D]/10 blur-lg transition-opacity duration-500 -z-10" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-[#49D17D]/30 bg-white/5">
                    <Image src="https://i.pravatar.cc/150?u=1" alt="User" fill className="object-cover" unoptimized/>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#F5F7F6]">Rahul Sharma</p>
                    <p className="text-xs text-[#9BA7A3] mt-0.5">Active now</p>
                  </div>
                  <span className="flex h-2 w-2 rounded-full bg-[#49D17D] animate-pulse" />
                </div>
                <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-3 rounded-xl text-xs text-[#9BA7A3] mb-3 border border-white/[0.06]">
                  "Is this still available for pickup today?"
                </div>
                <div className="bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] p-3 rounded-xl text-xs text-[#07110F] font-semibold ml-8 shadow-lg shadow-[#49D17D]/40">
                  "Yes, I can meet near the metro station."
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}
