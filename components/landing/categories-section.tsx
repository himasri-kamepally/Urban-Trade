'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

const portals = [
  {
    title: 'Buy & Shop Locally',
    description: 'Discover millions of pre-owned and new products in your city.',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80',
    href: '/marketplace',
  },
  {
    title: 'Sell & Earn Cash',
    description: 'List your items in seconds and connect with verified buyers.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    href: '/sell',
  },
  {
    title: 'Find Local Services',
    description: 'Hire professionals, find jobs, or rent properties nearby.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    href: '/marketplace?category=services',
  },
]

export function CategoriesSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div 
          ref={ref}
          className="grid gap-6 md:grid-cols-3"
        >
          {portals.map((portal, index) => (
            <Link 
              key={portal.title} 
              href={portal.href}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 backdrop-blur-xl transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-primary/5 block",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative bg-muted">
                <Image
                  src={portal.image}
                  alt={portal.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {portal.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {portal.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
