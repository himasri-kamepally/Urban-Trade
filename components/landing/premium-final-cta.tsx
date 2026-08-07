'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { ArrowRight } from 'lucide-react'

export function PremiumFinalCta() {
  const router = useRouter()
  const { requireAuth } = useAuth()

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Animated Gradient Blobs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        animate={{
          x: [0, 150, -150, 0],
          y: [0, -150, 150, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle, #111111 0%, transparent 70%)' }}
      />

      <motion.div
        className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl"
        animate={{
          x: [0, -150, 150, 0],
          y: [0, 150, -150, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, delay: 1 }}
        style={{ background: 'radial-gradient(circle, #666666 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12"
        >
          <h2 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Your neighborhood
            <br />
            is full of
            <br />
            possibilities.
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Discover. Connect. Trade locally. Join thousands of people already trading smarter.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push('/marketplace')}
            className="px-8 py-4 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Explore Marketplace <ArrowRight size={20} />
          </button>
          <button
            onClick={() => requireAuth(() => router.push('/sell'))}
            className="px-8 py-4 glass-light font-bold rounded-xl hover:glass-medium transition-all hover:scale-105 active:scale-95"
          >
            Start Selling
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-border"
        >
          <p className="text-muted-foreground text-sm mb-6">Trusted by people in your area</p>
          <div className="flex justify-center gap-6 flex-wrap">
            {[
              { label: '25K+', value: 'Active Users' },
              { label: '15K+', value: 'Listings' },
              { label: '98%', value: 'Positive Reviews' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold">{stat.label}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
