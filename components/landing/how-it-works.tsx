'use client'

import { Upload, MessageSquare, Handshake } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const steps = [
  {
    icon: Upload,
    title: 'Upload Product',
    description: 'Snap a few photos and list your item in under 60 seconds with AI assistance.',
  },
  {
    icon: MessageSquare,
    title: 'Connect with Buyers',
    description: 'Chat directly in real-time with verified people in your neighborhood.',
  },
  {
    icon: Handshake,
    title: 'Meet & Trade Locally',
    description: 'Arrange a safe meetup and complete the trade instantly and securely.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-[#07110F] overflow-hidden relative border-t border-white/[0.04]">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[40%] left-[-10%] w-[350px] h-[350px] bg-[#49D17D]/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] bg-[#5BFF9D]/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight text-[#F5F7F6] sm:text-5xl font-clash"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-[#9BA7A3] text-lg font-inter max-w-lg mx-auto"
          >
            Simple, secure, and built exclusively for neighborhood community commerce.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative p-10 rounded-[2rem] border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl transition-all duration-300 hover:border-[#49D17D]/30 hover:bg-white/[0.04] shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#49D17D]/0 via-transparent to-[#49D17D]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#49D17D]/10 text-[#49D17D] border border-[#49D17D]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(73,209,125,0.2)]">
                  <Icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-[#F5F7F6] mb-4 font-clash">
                  {step.title}
                </h3>
                
                <p className="text-[#9BA7A3] leading-relaxed font-inter">
                  {step.description}
                </p>
                
                {/* Decorative Number */}
                <div className="absolute top-8 right-10 text-7xl font-extrabold text-white/[0.02] select-none pointer-events-none font-clash">
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
