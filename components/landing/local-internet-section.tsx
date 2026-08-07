'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { AnimatedBackground } from './animated-background'

export function LocalInternetSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 0.8])
  const textY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 0.3])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20"
    >
      <AnimatedBackground variant="light" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left: Visual */}
          <motion.div
            style={{ scale: imageScale, opacity: imageOpacity }}
            className="hidden lg:block relative h-[600px] rounded-2xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=800&fit=crop"
              alt="The local internet"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </motion.div>

          {/* Right: Text */}
          <motion.div style={{ y: textY, opacity: textOpacity }} className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <h2 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
                The things you need
                <br />
                are already around you.
              </h2>

              <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
                UrbanTrade connects people with useful things in their own communities. No shipping delays. No strangers. Just your neighborhood.
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center">
                  <span className="text-sm font-bold">→</span>
                </div>
                <p className="text-sm text-muted-foreground">Scroll to discover how it works</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
