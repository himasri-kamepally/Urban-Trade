'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { ArrowRight } from 'lucide-react'
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion'
import Image from 'next/image'

const productData = [
  {
    title: 'iPhone 15 Pro',
    price: '₹52,000',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=500&fit=crop',
    position: { top: '10%', right: '5%' },
  },
  {
    title: 'Modern Sofa',
    price: '₹18,500',
    condition: 'Excellent',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    position: { top: '45%', left: '8%' },
  },
  {
    title: 'MacBook Air',
    price: '₹65,000',
    condition: 'Good',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    position: { bottom: '15%', right: '10%' },
  },
]

export function PremiumHero() {
  const router = useRouter()
  const { requireAuth } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const { scrollY } = useScroll()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left - rect.width / 2)
      mouseY.set(e.clientY - rect.top - rect.height / 2)
    }
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-12"
    >
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[80vh] h-[80vh] rounded-full opacity-30 blur-3xl"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, #111111 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <motion.div
        className="absolute -bottom-1/2 -right-1/4 w-[80vh] h-[80vh] rounded-full opacity-20 blur-3xl"
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          background: 'radial-gradient(circle, #666666 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none grain" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-light w-fit px-4 py-2 rounded-full mb-8"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              ✨ Premium Local Commerce
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div className="space-y-4 mb-8">
            {['Your', 'Neighborhood.', 'Your Marketplace.'].map((word, i) => (
              <motion.h1
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight"
              >
                {word}
              </motion.h1>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-muted-foreground mb-10 max-w-md"
          >
            Buy, sell, and discover quality products from people around you — built for your community.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => requireAuth(() => router.push('/sell'))}
              className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Start Selling <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-8 py-3 glass-light font-bold rounded-xl hover:glass-medium transition-all hover:scale-105 active:scale-95"
            >
              Explore Marketplace
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex gap-12 mt-14 pt-8 border-t border-border"
          >
            {[
              { label: 'Active Users', value: '25K+' },
              { label: 'Listings', value: '15K+' },
              { label: 'Rating', value: '4.9★' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Floating Product Cards */}
        <motion.div
          className="hidden lg:block relative h-[600px]"
          style={{
            x: mouseX,
            y: mouseY,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        >
          {productData.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
              className="absolute glass-strong rounded-2xl p-4 w-64 overflow-hidden group"
              style={product.position as any}
            >
              {/* Floating Animation */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3 bg-secondary">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">{product.title}</h3>
                    <span className="text-xs px-2 py-1 bg-secondary rounded-lg">{product.condition}</span>
                  </div>
                  <p className="text-lg font-bold">{product.price}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-xs text-muted-foreground mb-2">Scroll to explore</p>
        <div className="w-6 h-10 mx-auto border-2 border-muted-foreground rounded-full flex items-start justify-center p-2">
          <motion.div className="w-1 h-2 bg-muted-foreground rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
