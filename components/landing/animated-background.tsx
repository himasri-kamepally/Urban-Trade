'use client'

import { motion } from 'framer-motion'

interface AnimatedBackgroundProps {
  variant?: 'hero' | 'light' | 'dark' | 'glass'
}

export function AnimatedBackground({ variant = 'hero' }: AnimatedBackgroundProps) {
  const variants = {
    hero: {
      background: 'linear-gradient(135deg, #FAFAF8 0%, #F5F5F3 25%, #EFEFED 50%, #F5F5F3 75%, #FAFAF8 100%)',
      orbs: [
        {
          color: 'rgba(17, 17, 17, 0.08)',
          size: 800,
          top: '-20%',
          left: '-10%',
        },
        {
          color: 'rgba(102, 102, 102, 0.06)',
          size: 600,
          top: '50%',
          right: '-15%',
        },
        {
          color: 'rgba(17, 17, 17, 0.05)',
          size: 700,
          bottom: '-20%',
          left: '30%',
        },
      ],
    },
    light: {
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F3 100%)',
      orbs: [
        {
          color: 'rgba(102, 102, 102, 0.04)',
          size: 600,
          top: '10%',
          right: '-20%',
        },
      ],
    },
    dark: {
      background: 'linear-gradient(135deg, #F5F5F3 0%, #EFEFED 100%)',
      orbs: [
        {
          color: 'rgba(17, 17, 17, 0.06)',
          size: 700,
          bottom: '-30%',
          left: '-10%',
        },
      ],
    },
    glass: {
      background: 'linear-gradient(135deg, #FAFAF8 0%, #FFFFFF 100%)',
      orbs: [
        {
          color: 'rgba(17, 17, 17, 0.04)',
          size: 500,
          top: '20%',
          left: '-15%',
        },
      ],
    },
  }

  const config = variants[variant]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{ background: config.background }}
      />

      {/* Animated orbs */}
      {config.orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' result='noise'/%3E%3C/filter%3E%3Crect width='256' height='256' fill='white' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
