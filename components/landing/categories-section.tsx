'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

const portals = [
  {
    title: 'Trade Tech',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    href: '/marketplace?category=electronics',
    color: 'bg-blue-500/10 text-blue-600',
    badge: 'Electronics',
  },
  {
    title: 'Upgrade Home',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    href: '/marketplace?category=furniture',
    color: 'bg-amber-500/10 text-amber-600',
    badge: 'Furniture',
  },
  {
    title: 'Find Rides',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    href: '/marketplace?category=vehicles',
    color: 'bg-emerald-500/10 text-emerald-600',
    badge: 'Vehicles',
  },
  {
    title: 'Local Rentals',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    href: '/marketplace?category=rentals',
    color: 'bg-purple-500/10 text-purple-600',
    badge: 'Real Estate',
  },
  {
    title: 'Hire Help',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    href: '/marketplace?category=services',
    color: 'bg-primary/10 text-primary',
    badge: 'Services',
  },
]

export function CategoriesSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-24 bg-background border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              One platform. <br className="hidden sm:block" />
              <span className="text-primary">Limitless possibilities.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              UrbanTrade is built for more than just buying and selling. It&apos;s a community-driven ecosystem where you can find anything, right around the corner.
            </p>
          </div>
        </div>

        <div 
          ref={ref}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
        >
          {portals.map((portal, index) => (
            <Link 
              key={portal.title} 
              href={portal.href}
              className={cn(
                "group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 backdrop-blur-xl transition-all duration-1000 ease-out hover:shadow-2xl hover:shadow-primary/5 block",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={portal.image}
                alt={portal.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <span className={cn("inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider mb-3", portal.color)}>
                  {portal.badge}
                </span>
                <h3 className="text-2xl font-black text-white leading-tight">
                  {portal.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
