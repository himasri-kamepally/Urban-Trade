'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { ListingCard } from '@/components/listing-card'
import { getListings } from '@/lib/api'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

export function FeaturedSection() {
  const [featuredListings, setFeaturedListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation()
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation()

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await getListings({ limit: 4 })
        setFeaturedListings(data)
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  return (
    <section className="border-t border-border bg-card/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div 
          ref={headingRef}
          className={cn(
            "flex items-end justify-between transition-all duration-700 ease-out",
            headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-4xl">
              Featured Listings
            </h2>
            <p className="mt-3 text-muted-foreground">
              Hand-picked items from verified sellers
            </p>
          </div>
          <Link
            href="/marketplace"
            className="hidden items-center gap-2 text-sm font-medium text-accent transition-all duration-200 hover:text-foreground hover:gap-3 sm:flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div 
          ref={gridRef}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {loading ? (
            <div className="col-span-full flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredListings.length > 0 ? (
            featuredListings.map((listing, index) => (
              <div
                key={listing.id}
                className={cn(
                  "transition-all duration-500 ease-out",
                  gridVisible 
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-0 translate-y-12 scale-95"
                )}
                style={{ transitionDelay: gridVisible ? `${index * 100}ms` : '0ms' }}
              >
                <ListingCard
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  image={listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
                  location={listing.city}
                  condition={listing.condition}
                  posted={new Date(listing.created_at).toLocaleDateString()}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No listings found. Add some in Supabase to see them here!
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent"
          >
            View all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
