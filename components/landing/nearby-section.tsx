'use client'

import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { ListingCard } from '@/components/listing-card'
import { listings } from '@/lib/data'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

export function NearbySection() {
  const nearbyListings = listings.slice(4, 8)
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation()
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation()

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div 
          ref={headingRef}
          className={cn(
            "flex items-end justify-between transition-all duration-700 ease-out",
            headingVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}
        >
          <div>
            <div className="flex items-center gap-2 text-accent">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Near Hyderabad, Telangana</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground lg:text-4xl">
              Items Near You
            </h2>
            <p className="mt-3 text-muted-foreground">
              Discover great deals in your city
            </p>
          </div>
          <Link
            href="/marketplace?sort=nearest"
            className="hidden items-center gap-2 text-sm font-medium text-accent transition-all duration-200 hover:text-foreground hover:gap-3 sm:flex"
          >
            View all nearby
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div 
          ref={gridRef}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {nearbyListings.map((listing, index) => (
            <div
              key={listing.id}
              className={cn(
                "transition-all duration-500 ease-out",
                gridVisible 
                  ? "opacity-100 translate-x-0" 
                  : index % 2 === 0 ? "opacity-0 -translate-x-8" : "opacity-0 translate-x-8"
              )}
              style={{ transitionDelay: gridVisible ? `${index * 100}ms` : '0ms' }}
            >
              <ListingCard
                id={listing.id}
                title={listing.title}
                price={listing.price}
                image={listing.image}
                location={listing.location}
                condition={listing.condition}
                posted={listing.posted}
                saved={listing.saved}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/marketplace?sort=nearest"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent"
          >
            View all nearby
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
