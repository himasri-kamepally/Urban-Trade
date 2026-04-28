'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { listings, formatPrice } from '@/lib/data'
import {
  Heart,
  Share2,
  MapPin,
  Clock,
  BadgeCheck,
  Star,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { requireAuth } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')

  const handleSave = () => {
    requireAuth(() => {
      setIsSaved(!isSaved)
    })
  }

  const handleChat = () => {
    requireAuth(() => {
      router.push('/chat')
    })
  }

  const handleMakeOffer = () => {
    requireAuth(() => {
      setShowOfferModal(true)
    })
  }

  const listing = listings.find((l) => l.id === params.id)
  const similarListings = listings.filter(
    (l) => l.category === listing?.category && l.id !== listing?.id
  ).slice(0, 4)

  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Listing not found</h1>
            <p className="mt-2 text-muted-foreground">The listing you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/marketplace">
              <Button className="mt-4 rounded-xl">Browse Marketplace</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <Link
            href="/marketplace"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to marketplace
          </Link>
          
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card">
                <Image
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                      {listing.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 w-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'w-4 bg-white'
                              : 'bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {listing.images.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-[4/3] w-20 overflow-hidden rounded-xl transition-all ${
                        index === currentImageIndex
                          ? 'ring-2 ring-accent'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${listing.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                    {listing.condition}
                  </span>
                  <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                    {listing.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary"
                  >
                    <Heart
                      className={`h-5 w-5 ${isSaved ? 'fill-accent text-accent' : ''}`}
                    />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <p className="mt-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                {formatPrice(listing.price)}
              </p>
              
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {listing.posted}
                </div>
              </div>
              
              <div className="mt-6 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={listing.seller.avatar}
                    alt={listing.seller.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{listing.seller.name}</span>
                      {listing.seller.verified && (
                        <BadgeCheck className="h-4 w-4 text-accent" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        {listing.seller.rating}
                      </div>
                      <span>Member since {listing.seller.memberSince}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleChat}
                  className="flex-1 gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat with Seller
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMakeOffer}
                  className="flex-1 rounded-xl border-border bg-card hover:bg-secondary"
                >
                  Make an Offer
                </Button>
              </div>
              
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">Description</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>
          
          {similarListings.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-semibold text-foreground">Similar Items</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {similarListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    image={item.image}
                    location={item.location}
                    condition={item.condition}
                    posted={item.posted}
                    saved={item.saved}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">Make an Offer</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Listed price: {formatPrice(listing.price)}
            </p>
            <div className="mt-4">
              <label className="text-sm font-medium text-foreground">Your offer</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="h-12 w-full rounded-xl border border-border bg-background pl-8 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowOfferModal(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowOfferModal(false)
                  setOfferAmount('')
                }}
                className="flex-1 rounded-xl"
              >
                Send Offer
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}
