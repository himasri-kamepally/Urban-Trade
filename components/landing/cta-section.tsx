'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export function CTASection() {
  const { requireAuth } = useAuth()
  const router = useRouter()

  const handleStartSelling = () => {
    requireAuth(() => {
      router.push('/sell')
    })
  }

  return (
    <section className="px-4 py-24 lg:px-8 lg:py-32 bg-[#07110F] relative overflow-hidden">
      {/* Decorative Background ambient glow */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#49D17D]/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl px-6 py-20 text-center sm:px-12 lg:px-24 lg:py-28 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
        >
          {/* Subtle noise inside the card */}
          <div 
            className="absolute inset-0 opacity-[0.012] pointer-events-none rounded-[2.5rem]" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          />

          <div className="relative z-10">
            <h2 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-[#F5F7F6] sm:text-5xl lg:text-[4.6rem] leading-[1.05] font-clash mb-6">
              Turn Unused<br/>
              <span className="bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(73,209,125,0.15)]">
                Items Into Cash.
              </span>
            </h2>
            
            <p className="mx-auto mt-6 max-w-xl text-lg text-[#9BA7A3] font-inter leading-relaxed">
              Join the modern neighborhood trading network. List your first item and connect with verified buyers in under 60 seconds.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleStartSelling}
                className="relative overflow-hidden group h-14 px-8 rounded-full bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] text-[#07110F] text-md font-bold shadow-lg shadow-[#49D17D]/20 hover:shadow-[#49D17D]/40 transition-all duration-300 w-full sm:w-auto border-none cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Selling <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <span className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
