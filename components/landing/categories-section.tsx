'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const portals = [
  {
    title: 'Trade Tech',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    href: '/marketplace?category=electronics',
    color: 'bg-emerald-500/10 text-[#49D17D] border-[#49D17D]/20',
    badge: 'Electronics',
  },
  {
    title: 'Upgrade Home',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    href: '/marketplace?category=furniture',
    color: 'bg-emerald-500/10 text-[#49D17D] border-[#49D17D]/20',
    badge: 'Furniture',
  },
  {
    title: 'Find Rides',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    href: '/marketplace?category=vehicles',
    color: 'bg-emerald-500/10 text-[#49D17D] border-[#49D17D]/20',
    badge: 'Vehicles',
  },
  {
    title: 'Local Rentals',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    href: '/marketplace?category=rentals',
    color: 'bg-emerald-500/10 text-[#49D17D] border-[#49D17D]/20',
    badge: 'Real Estate',
  },
  {
    title: 'Hire Help',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    href: '/marketplace?category=services',
    color: 'bg-emerald-500/10 text-[#49D17D] border-[#49D17D]/20',
    badge: 'Services',
  },
]

export function CategoriesSection() {
  return (
    <section className="py-24 bg-[#07110F] border-y border-white/[0.04] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-[#49D17D]/4 rounded-full blur-[130px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-extrabold tracking-tight text-[#F5F7F6] sm:text-5xl font-clash"
            >
              One Platform. <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(73,209,125,0.15)]">
                Limitless Possibilities.
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-[#9BA7A3] text-lg font-inter"
            >
              UrbanTrade is built for more than just buying and selling. It&apos;s a premium community-driven ecosystem where you can discover anything, right around the corner.
            </motion.p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {portals.map((portal, index) => (
            <motion.div 
              key={portal.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-[#49D17D]/30"
            >
              <Link href={portal.href} className="absolute inset-0 block z-20">
                <span className="sr-only">Go to {portal.title}</span>
              </Link>

              <Image
                src={portal.image}
                alt={portal.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                unoptimized
              />
              {/* Premium dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110F]/90 via-[#07110F]/30 to-transparent transition-all duration-300 group-hover:via-[#07110F]/20" />
              
              <div className="absolute bottom-8 left-6 right-6 z-10">
                <span className={cn("inline-flex px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider mb-3 border backdrop-blur-md", portal.color)}>
                  {portal.badge}
                </span>
                <h3 className="text-xl font-extrabold text-[#F5F7F6] leading-tight font-clash flex items-center gap-1.5 group-hover:text-[#49D17D] transition-colors duration-300">
                  {portal.title}
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 -translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0" />
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
