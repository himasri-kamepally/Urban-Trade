'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useRef } from 'react'
import Image from 'next/image'
import { AnimatedBackground } from './animated-background'

export function CinematicHero() {
  const router = useRouter()
  const { requireAuth } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const titleScale = useTransform(scrollY, [0, 300], [1, 0.8])
  const titleY = useTransform(scrollY, [0, 300], [0, -50])
  const imageScale = useTransform(scrollY, [0, 400], [1, 1.2])
  const imageOpacity = useTransform(scrollY, [200, 400], [1, 0.3])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20"
    >
      <AnimatedBackground variant="hero" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left: Text */}
          <motion.div
            style={{
              opacity: titleOpacity,
              scale: titleScale,
              y: titleY,
            }}
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="inline-flex w-fit gap-2 items-center px-4 py-2 rounded-full border border-border/50 mb-8 backdrop-blur-sm bg-white/20"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
                Local Commerce, Reimagined
              </span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4 mb-8">
              {['Your neighborhood.', 'Connected differently.'].map((line, i) => (
                <motion.h1
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  className="text-6xl lg:text-7xl font-black leading-tight tracking-tight"
                >
                  {line}
                </motion.h1>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed"
            >
              UrbanTrade makes buying and selling nearby simpler, safer, and more human.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button
                onClick={() => router.push('/marketplace')}
                className="px-8 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95"
              >
                Explore UrbanTrade
              </button>
              <button
                onClick={() => requireAuth(() => router.push('/sell'))}
                className="px-8 py-3 border border-foreground/20 text-foreground font-semibold rounded-lg hover:bg-foreground/5 transition-all hover:scale-105 active:scale-95"
              >
                Start Selling
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            style={{
              scale: imageScale,
              opacity: imageOpacity,
            }}
            className="hidden lg:block relative h-[600px]"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop"
                alt="Local neighborhood community"
                fill
                className="object-cover"
                unoptimized
                priority
              />
              {/* Subtle glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-xs text-muted-foreground mb-2">Scroll</p>
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <motion.div className="w-1 h-2 bg-muted-foreground/30 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
