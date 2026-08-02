'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const portals = [
  {
    title: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    href: '/marketplace?category=Electronics',
  },
  {
    title: 'Furniture',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    href: '/marketplace?category=Furniture',
  },
  {
    title: 'Cars',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    href: '/marketplace?category=Cars',
  },
  {
    title: 'Property',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    href: '/marketplace?category=Property',
  },
  {
    title: 'Services',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    href: '/marketplace?category=Services',
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary border-y border-border relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            >
              One Platform.{' '}
              <span className="text-foreground">
                Limitless Possibilities.
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-3 text-muted-foreground text-base"
            >
              Discover anything you need right in your neighborhood.
            </motion.p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {portals.map((portal, index) => (
            <motion.div 
              key={portal.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-card shadow-soft-lg transition-all duration-300 hover:shadow-soft-xl"
            >
              <Link href={portal.href} className="absolute inset-0 block z-20">
                <span className="sr-only">Go to {portal.title}</span>
              </Link>

              <Image
                src={portal.image}
                alt={portal.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent group-hover:via-background/10 transition-all duration-300" />
              
              <div className="absolute bottom-6 left-5 right-5 z-10">
                <h3 className="text-lg font-bold text-foreground leading-tight flex items-center gap-2 group-hover:text-foreground transition-colors duration-300">
                  {portal.title}
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
