'use client'

import { motion, useMousePosition } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const sellProducts = [
  {
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&h=300&fit=crop',
    position: { top: '10%', left: '-5%' },
  },
  {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
    position: { top: '50%', right: '-8%' },
  },
  {
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
    position: { bottom: '5%', left: '5%' },
  },
]

export function PremiumSellCta() {
  const router = useRouter()
  const { requireAuth } = useAuth()

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Gradients */}
      <motion.div
        className="absolute top-1/2 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{ duration: 16, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle, #111111 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="glass-strong rounded-3xl p-12 lg:p-20 relative overflow-hidden"
        >
          {/* Floating Background Elements */}
          {sellProducts.map((product, i) => (
            <motion.div
              key={i}
              className="absolute w-48 h-48 rounded-2xl overflow-hidden opacity-0 lg:opacity-20 pointer-events-none"
              style={product.position as any}
              animate={{
                y: [0, -30, 0],
              }}
              transition={{
                duration: 5 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Image
                src={product.image}
                alt={`product-${i}`}
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>
          ))}

          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                Turn what you have
                <br />
                into what you need.
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground mb-8"
            >
              List unused items, reach nearby buyers, and make local selling effortless. Earn money from things you no longer need.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              onClick={() => requireAuth(() => router.push('/sell'))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-foreground text-background font-bold rounded-xl flex items-center gap-2 hover:bg-foreground/90 transition-all"
            >
              Start Selling <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
