'use client'

import { motion } from 'framer-motion'
import { MapPin, Heart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const trendingProducts = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    price: '₹99,999',
    condition: 'Like New',
    distance: '1.2 km away',
    seller: 'Tech Store',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Mid-Century Sofa',
    price: '₹35,000',
    condition: 'Excellent',
    distance: '0.8 km away',
    seller: 'Furniture Hub',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'MacBook Pro 14"',
    price: '₹145,000',
    condition: 'Good',
    distance: '2.1 km away',
    seller: 'Electronics Plus',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Vintage Road Bike',
    price: '₹22,000',
    condition: 'Good',
    distance: '1.5 km away',
    seller: 'Cycle Shop',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    title: 'Sony WH-1000XM5',
    price: '₹28,000',
    condition: 'Like New',
    distance: '0.6 km away',
    seller: 'Audio Store',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    title: 'Standing Desk',
    price: '₹15,000',
    condition: 'Excellent',
    distance: '1.8 km away',
    seller: 'Office Supplies',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=400&fit=crop',
  },
]

export function PremiumMarketplace() {
  const router = useRouter()

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Gradient */}
      <motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle, #111111 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6">
            Trending in your
            <br />
            neighborhood.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover what's hot right now. Most viewed and highly rated items from your area.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true, margin: '-100px' }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              onClick={() => router.push(`/product/${product.id}`)}
              className="glass-light rounded-2xl overflow-hidden group cursor-pointer flex flex-col"
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
                {/* Save Button */}
                <button className="absolute top-4 right-4 p-2 glass-medium rounded-lg hover:scale-110 transition-transform">
                  <Heart size={20} className="text-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-2xl font-extrabold">{product.price}</p>
                </div>

                {/* Meta Info */}
                <div className="space-y-2 text-sm text-muted-foreground flex-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-secondary rounded-lg text-xs font-medium">
                      {product.condition}
                    </span>
                    <span className="flex items-center gap-1">
                      ⭐ {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{product.distance}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">By {product.seller}</p>
                </div>

                {/* CTA */}
                <button className="w-full py-3 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95">
                  View Listing
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={() => router.push('/marketplace')}
            className="px-8 py-4 glass-light font-bold rounded-xl hover:glass-medium transition-all hover:scale-105 active:scale-95"
          >
            Browse All Listings →
          </button>
        </motion.div>
      </div>
    </section>
  )
}
