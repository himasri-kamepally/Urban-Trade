'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'Browse items from your neighbors.',
    icon: '🔍',
  },
  {
    number: '02',
    title: 'Connect',
    description: 'Message sellers directly.',
    icon: '💬',
  },
  {
    number: '03',
    title: 'Trade',
    description: 'Meet locally and complete the exchange.',
    icon: '🤝',
  },
  {
    number: '04',
    title: 'Done.',
    description: 'Simple, human, and local.',
    icon: '✓',
  },
]

function StepCard({ step, index, scrollYProgress }: any) {
  const startProgress = index / steps.length
  const endProgress = (index + 1) / steps.length

  const stepOpacity = useTransform(
    scrollYProgress,
    [startProgress - 0.1, startProgress, endProgress, endProgress + 0.1],
    [0, 1, 1, 0]
  )

  const stepScale = useTransform(
    scrollYProgress,
    [startProgress - 0.1, startProgress, endProgress, endProgress + 0.1],
    [0.8, 1, 1, 0.8]
  )

  const stepY = useTransform(
    scrollYProgress,
    [startProgress - 0.1, startProgress, endProgress, endProgress + 0.1],
    [50, 0, 0, -50]
  )

  return (
    <motion.div
      style={{
        opacity: stepOpacity,
        scale: stepScale,
        y: stepY,
      }}
      className="flex items-center gap-8"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center text-4xl">
          {step.icon}
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="text-sm font-bold text-muted-foreground mb-2">{step.number}</div>
        <h3 className="text-4xl font-black mb-2">{step.title}</h3>
        <p className="text-lg text-muted-foreground">{step.description}</p>
      </div>
    </motion.div>
  )
}

export function PinnedStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section ref={sectionRef} className="relative min-h-[400vh] bg-background">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-muted" />

        {/* Steps Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
          <div className="space-y-8">
            {steps.map((step, i) => (
              <StepCard key={i} step={step} index={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
