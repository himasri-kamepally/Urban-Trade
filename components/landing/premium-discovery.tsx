'use client'

import { motion } from 'framer-motion'
import { MapPin, Star } from 'lucide-react'
import Image from 'next/image'

const nearbyProducts = [
  {
    title: 'Vintage Camera',
    price: '₹8,500',
    distance: '0.5 km away',
    seller: 'Sarah M.',
    image: 'https://images.unsplash.com/photo-1614008375890-cb53b6c5f8f5?w=400&h=400&fit=crop',
  },
  {
    title: 'Mountain Bike',
    price: '₹12,000',
    distance: '1.2 km away',
    seller: 'John D.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    title: 'Gaming Console',
    price: '₹28,000',
    distance: '0.8 km away',
    seller: 'Alex T.',
    image: 'https://images.unsplash.com/photo-1486867865049-a3a87f9f7c1e?w=400&h=400&fit=crop',
  },
]

export function PremiumDiscovery() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Gradient */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle, #111111 0%, transparent 70%)' }}
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
            Everything you need.
            <br />
            Right around you.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover high-quality items from your neighbors. Shop locally, support your community, and find exactly what you're looking for.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {nearbyProducts.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-light rounded-2xl overflow-hidden group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative w-full h-64 bg-secondary overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                  <p className="text-2xl font-extrabold text-foreground">{product.price}</p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{product.distance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="fill-current" />
                    <span>{product.seller}</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
