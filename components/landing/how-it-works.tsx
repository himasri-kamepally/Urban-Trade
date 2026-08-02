'use client'

import { Upload, MessageSquare, Handshake } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const steps = [
  {
    icon: Upload,
    title: 'Upload Product',
    description: 'Snap a few photos and list your item in under 60 seconds.',
  },
  {
    icon: MessageSquare,
    title: 'Connect with Buyers',
    description: 'Chat directly in real-time with verified people in your neighborhood.',
  },
  {
    icon: Handshake,
    title: 'Meet & Trade Locally',
    description: 'Arrange a safe meetup and complete the trade instantly.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-background overflow-hidden relative border-t border-border">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto"
          >
            Simple, secure, and built exclusively for neighborhood commerce.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="group relative p-8 rounded-xl border border-border bg-card hover:bg-secondary shadow-soft-lg transition-all duration-300 hover:shadow-soft-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-secondary text-foreground border border-border group-hover:bg-foreground group-hover:text-background transition-all duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                
                <div className="absolute top-6 right-6 text-5xl font-extrabold text-muted opacity-5 select-none pointer-events-none">
                  0{index + 1}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
