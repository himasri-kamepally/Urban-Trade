'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { AnimatedBackground } from './animated-background'

const stages = [
  {
    number: '01',
    title: 'List',
    description: 'Add items in seconds',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop',
  },
  {
    number: '02',
    title: 'Connect',
    description: 'Chat with interested buyers',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=600&h=600&fit=crop',
  },
  {
    number: '03',
    title: 'Trade',
    description: 'Meet locally and exchange',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop',
  },
]

function StageCard({ stage, index, scrollYProgress }: any) {
  const stageProgress = useTransform(
    scrollYProgress,
    [0.2 * index, 0.2 * (index + 1)],
    [0, 1]
  )

  const imageScale = useTransform(stageProgress, [0, 1], [0.8, 1])
  const imageOpacity = useTransform(stageProgress, [0, 0.3, 1], [0, 1, 1])
  const textY = useTransform(stageProgress, [0, 1], [40, 0])
  const textOpacity = useTransform(stageProgress, [0, 1], [0, 1])

  return (
    <motion.div
      className={cn(
        "grid lg:grid-cols-2 gap-12 items-center",
        index % 2 === 1 && "lg:flex lg:flex-row-reverse"
      )}
    >
      {/* Image */}
      <motion.div
        style={{
          scale: imageScale,
          opacity: imageOpacity,
        }}
        className="relative h-96 rounded-2xl overflow-hidden"
      >
        <Image
          src={stage.image}
          alt={stage.title}
          fill
          className="object-cover"
          unoptimized
        />
      </motion.div>

      {/* Text */}
      <motion.div
        style={{
          y: textY,
          opacity: textOpacity,
        }}
      >
        <div className="text-sm font-bold text-muted-foreground mb-4">{stage.number}</div>
        <h3 className="text-5xl font-black mb-4">{stage.title}</h3>
        <p className="text-lg text-muted-foreground">{stage.description}</p>
      </motion.div>
    </motion.div>
  )
}

export function HowItWorksVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
      <AnimatedBackground variant="light" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            From listing
            <br />
            to local pickup.
          </h2>
        </motion.div>

        {/* Stages */}
        <div className="space-y-24">
          {stages.map((stage, i) => (
            <StageCard key={i} stage={stage} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
