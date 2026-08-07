'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const categories = [
  {
    name: 'Electronics',
    count: '2,400+',
    image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=500&h=500&fit=crop',
    size: 'lg',
  },
  {
    name: 'Furniture',
    count: '1,800+',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    size: 'sm',
  },
  {
    name: 'Fashion',
    count: '3,200+',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=500&fit=crop',
    size: 'sm',
  },
  {
    name: 'Books',
    count: '980+',
    image: 'https://images.unsplash.com/photo-1507842072343-583f20270319?w=500&h=500&fit=crop',
    size: 'sm',
  },
  {
    name: 'Sports & Outdoors',
    count: '1,500+',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=500&fit=crop',
    size: 'sm',
  },
  {
    name: 'Home & Living',
    count: '2,100+',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
    size: 'lg',
  },
]

export function PremiumCategories() {
  const router = useRouter()

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Gradient */}
      <motion.div
        className="absolute -left-1/4 top-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        animate={{
          x: [0, -50, 50, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle, #666666 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6">
            Find something
            <br />
            worth keeping.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse our carefully curated categories. Each item tells a story of quality and value.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 auto-rows-max">
          {categories.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true, margin: '-100px' }}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              onClick={() => router.push(`/marketplace?category=${category.name.toLowerCase()}`)}
              className={cn(
                "glass-light rounded-2xl overflow-hidden cursor-pointer group relative",
                category.size === 'lg' ? 'md:col-span-2 md:row-span-2' : ''
              )}
            >
              {/* Image */}
              <div className={cn(
                "relative bg-secondary overflow-hidden",
                category.size === 'lg' ? 'h-96' : 'h-48'
              )}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{category.name}</h3>
                <p className="text-sm text-white/80">{category.count} items</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
