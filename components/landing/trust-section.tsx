'use client'

import { UserCheck, Shield, MapPin, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const features = [
  {
    icon: UserCheck,
    title: 'Verified Profiles',
    description: 'Every seller and buyer is verified through official channels to ensure absolute trust.',
  },
  {
    icon: Shield,
    title: 'Secure Messaging',
    description: 'Encrypted peer-to-peer chat keeps your contact details and interactions completely private.',
  },
  {
    icon: MapPin,
    title: 'Safe Local Meetups',
    description: 'Integrated maps recommend secure community exchange zones for offline trade.',
  },
  {
    icon: Zap,
    title: 'Instant Listing System',
    description: 'AI-assisted listing technology parses your uploads to publish your products in seconds.',
  },
]

export function TrustSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#07110F] border-b border-white/[0.04] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[30%] left-[-5%] w-[400px] h-[400px] bg-[#49D17D]/3 rounded-full blur-[110px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight text-[#F5F7F6] sm:text-5xl font-clash"
          >
            Built for Trust
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-[#9BA7A3] text-lg font-inter leading-relaxed"
          >
            We&apos;ve reimagined the local marketplace experience with safety, transparency, and speed as core fundamentals. No friction, just trusted trade.
          </motion.p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-[2rem] border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl transition-all duration-300 hover:border-[#49D17D]/30 hover:bg-white/[0.04] shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]"
              >
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#49D17D]/0 to-[#49D17D]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#49D17D]/10 text-[#49D17D] border border-[#49D17D]/20 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#49D17D] group-hover:to-[#5BFF9D] group-hover:text-[#07110F] group-hover:scale-110 shadow-sm group-hover:shadow-[0_0_15px_rgba(73,209,125,0.3)]">
                  <Icon className="h-7 w-7" />
                </div>
                
                <h3 className="mt-6 text-xl font-bold text-[#F5F7F6] font-clash">
                  {feature.title}
                </h3>
                
                <p className="mt-4 text-[#9BA7A3] font-inter leading-relaxed text-sm">
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
