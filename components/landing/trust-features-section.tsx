'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Users, MapPin, Lock } from 'lucide-react'
import { AnimatedBackground } from './animated-background'

const trustFeatures = [
  {
    icon: Shield,
    title: 'Verified Listings',
    description: 'Every listing is verified for quality and authenticity.',
  },
  {
    icon: Users,
    title: 'Nearby People',
    description: 'Connect only with verified members in your community.',
  },
  {
    icon: MapPin,
    title: 'Transparent Profiles',
    description: 'See reviews and ratings from real neighbors.',
  },
  {
    icon: Lock,
    title: 'Local Pickup',
    description: 'Meet in person for complete peace of mind.',
  },
]

function TrustFeatureCard({ feature, index, scrollYProgress }: any) {
  const featureProgress = useTransform(
    scrollYProgress,
    [0, Math.min(0.25 * (index + 1), 1)],
    [0, 1]
  )

  const featureScale = useTransform(featureProgress, [0, 1], [0.8, 1])
  const featureOpacity = useTransform(featureProgress, [0, 1], [0, 1])
  const featureY = useTransform(featureProgress, [0, 1], [40, 0])

  return (
    <motion.div
      style={{
        scale: featureScale,
        opacity: featureOpacity,
        y: featureY,
      }}
      className="relative group"
    >
      <div className="p-8 rounded-2xl border border-border/50 bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300">
        <div className="mb-6 p-4 rounded-xl bg-foreground/10 w-fit group-hover:bg-foreground/20 transition-colors">
          <feature.icon size={28} className="text-foreground" />
        </div>

        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  )
}

export function TrustFeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
      <AnimatedBackground variant="light" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            Local feels different
            <br />
            when you can trust it.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trust is built into every interaction on UrbanTrade.
          </p>
        </motion.div>

        {/* Features Grid with scroll animation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, i) => (
            <TrustFeatureCard key={i} feature={feature} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}
