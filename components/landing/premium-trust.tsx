'use client'

import { motion } from 'framer-motion'
import { Shield, Users, MapPin, Lock } from 'lucide-react'

const trustPoints = [
  {
    icon: Shield,
    title: 'Verified Listings',
    description: 'Every listing is verified by our team to ensure authenticity and quality standards.',
  },
  {
    icon: Users,
    title: 'Real People',
    description: 'Connect with verified members in your community with real reviews and ratings.',
  },
  {
    icon: MapPin,
    title: 'Local Pickup',
    description: 'Meet locally and complete transactions in person for complete peace of mind.',
  },
  {
    icon: Lock,
    title: 'Secure Conversations',
    description: 'All messages are encrypted to protect your privacy and transaction details.',
  },
]

export function PremiumTrust() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Gradient */}
      <motion.div
        className="absolute top-1/2 -right-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        animate={{
          x: [0, 80, -80, 0],
          y: [0, -80, 80, 0],
        }}
        transition={{ duration: 22, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle, #666666 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6">
            Local trading,
            <br />
            without the uncertainty.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've built trust into every interaction. Trade with confidence knowing you're protected.
          </p>
        </motion.div>

        {/* Trust Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, i) => {
            const Icon = point.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true, margin: '-100px' }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="glass-light rounded-2xl p-8 flex flex-col items-center text-center space-y-4 group"
              >
                {/* Icon */}
                <motion.div
                  className="p-4 rounded-xl bg-foreground/10 group-hover:bg-foreground/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon size={32} className="text-foreground" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold">{point.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
