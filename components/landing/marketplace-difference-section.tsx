'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { AnimatedBackground } from './animated-background'

export function MarketplaceDifferenceSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })

  const textScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const secondTextScale = useTransform(scrollYProgress, [0.3, 0.6, 1], [0.8, 1, 0.8])
  const secondTextOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
      <AnimatedBackground variant="dark" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          {/* First text */}
          <motion.div style={{ scale: textScale, opacity: textOpacity }}>
            <h2 className="text-6xl lg:text-7xl font-black leading-tight mb-6">
              Not just another
              <br />
              marketplace.
            </h2>
          </motion.div>

          {/* Transition arrow */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.3, 0.4], [0, 1]) }}
            className="text-4xl"
          >
            ↓
          </motion.div>

          {/* Second text */}
          <motion.div style={{ scale: secondTextScale, opacity: secondTextOpacity }}>
            <h2 className="text-6xl lg:text-7xl font-black leading-tight text-foreground">
              Your
              <br />
              marketplace.
            </h2>

            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Built around proximity, trust, and real-world connection. No algorithm. No recommendations. Just what's near you.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
