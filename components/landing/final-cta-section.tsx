'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useRef } from 'react'
import Image from 'next/image'
import { AnimatedBackground } from './animated-background'

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { requireAuth } = useAuth()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })

  const titleScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.05])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1])

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
      <AnimatedBackground variant="dark" />

      {/* Background Image */}
      <motion.div
        style={{
          scale: imageScale,
          opacity: imageOpacity,
        }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop"
          alt="Background"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full text-center">
        <motion.div
          style={{
            scale: titleScale,
            opacity: titleOpacity,
          }}
          className="space-y-8"
        >
          <h2 className="text-5xl lg:text-7xl font-black leading-tight">
            Your neighborhood
            <br />
            is waiting.
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Buy better. Sell smarter. Stay local.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button
              onClick={() => router.push('/marketplace')}
              className="px-8 py-4 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95"
            >
              Explore Marketplace
            </button>
            <button
              onClick={() => requireAuth(() => router.push('/sell'))}
              className="px-8 py-4 border border-foreground/20 text-foreground font-semibold rounded-lg hover:bg-foreground/5 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm bg-white/10"
            >
              Start Selling
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
