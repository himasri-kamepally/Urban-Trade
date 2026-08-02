'use client'

import { UserCheck, Shield, MapPin, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const features = [
  {
    icon: UserCheck,
    title: 'Verified Profiles',
    description: 'Every seller and buyer is verified to ensure absolute trust.',
  },
  {
    icon: Shield,
    title: 'Secure Messaging',
    description: 'Encrypted peer-to-peer chat keeps your interactions private.',
  },
  {
    icon: MapPin,
    title: 'Safe Local Meetups',
    description: 'Integrated maps recommend secure community exchange zones.',
  },
  {
    icon: Zap,
    title: 'Instant Listing System',
    description: 'List your products in seconds with our simplified interface.',
  },
]

export function TrustSection() {
  return (
    <section className="py-20 lg:py-28 bg-background border-b border-border relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Built for Trust
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-muted-foreground text-base leading-relaxed"
          >
            We&apos;ve reimagined the local marketplace with safety and transparency as core principles.
          </motion.p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.12 }}
                whileHover={{ y: -4 }}
                className="group relative p-6 rounded-xl border border-border bg-card hover:bg-secondary shadow-soft-lg transition-all duration-300 hover:shadow-soft-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-foreground border border-border group-hover:bg-foreground group-hover:text-background transition-all duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="mt-4 text-base font-bold text-foreground">
                  {feature.title}
                </h3>
                
                <p className="mt-2 text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
