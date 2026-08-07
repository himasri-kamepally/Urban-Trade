'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Plus, MessageSquare, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Plus,
    number: '01',
    title: 'List Your Item',
    description: 'Take a few photos, write a description, and set your price. Done in minutes.',
  },
  {
    icon: MessageSquare,
    number: '02',
    title: 'Connect with Buyers',
    description: 'Get messages from interested buyers in your neighborhood instantly.',
  },
  {
    icon: CheckCircle,
    number: '03',
    title: 'Meet & Complete',
    description: 'Meet locally at a safe place and complete the transaction face-to-face.',
  },
]

export function PremiumHowItWorks() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section ref={containerRef} className="relative py-24 px-6 overflow-hidden">
      {/* Background Gradient */}
      <motion.div
        className="absolute top-0 -left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        animate={{
          x: [0, -100, 100, 0],
          y: [0, 100, -100, 0],
        }}
        transition={{ duration: 24, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle, #111111 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-20 text-center"
        >
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6">
            From listing to pickup.
            <br />
            Simple.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to start buying or selling with UrbanTrade.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-1 bg-gradient-to-b from-foreground to-transparent"
            style={{
              height: '100%',
              scaleY: lineScale,
              transformOrigin: 'top',
            }}
          />

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="flex gap-8 lg:gap-12 items-start lg:items-center"
                >
                  {/* Timeline Dot & Icon */}
                  <motion.div
                    className="flex-shrink-0 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="relative z-10">
                      <div className="w-20 h-20 rounded-full glass-medium flex items-center justify-center">
                        <Icon size={40} className="text-foreground" />
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-foreground"
                        initial={{ scale: 1, opacity: 1 }}
                        whileInView={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 2, delay: i * 0.3 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className="flex-1 pt-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 + 0.1 }}
                    viewport={{ once: true, margin: '-100px' }}
                  >
                    <div className="glass-light rounded-2xl p-8">
                      <div className="flex items-baseline gap-4 mb-4">
                        <span className="text-4xl font-extrabold text-foreground/20">{step.number}</span>
                        <h3 className="text-2xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
