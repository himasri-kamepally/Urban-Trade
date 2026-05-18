'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { getListingById, getListings, getOrCreateChat } from '@/lib/api'
import { formatPrice } from '@/lib/data'
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
  Loader2,
  Phone,
} from 'lucide-react'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, requireAuth } = useAuth()
  const [listing, setListing] = useState<any>(null)
  const [similarListings, setSimilarListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingChat, setCreatingChat] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return
      setLoading(true)
      try {
        const data = await getListingById(params.id as string)
        if (data) {
          setListing(data)
          // Fetch similar listings
          const similar = await getListings({ category: data.category_id, limit: 5 })
          setSimilarListings(similar.filter((l: any) => l.id !== data.id).slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const handleSave = () => {
    requireAuth(() => {
      setIsSaved(!isSaved)
    })
  }

  const handleChat = () => {
    requireAuth(async () => {
      if (!user?.id || !listing) return
      
      if (user.id === listing.seller_id) {
        alert("You cannot start a chat with yourself on your own listing.")
        return
      }
      
      setCreatingChat(true)
      try {
        const chat = await getOrCreateChat(user.id, listing.seller_id, listing.id)
        router.push(`/chat?id=${chat.id}`)
      } catch (error) {
        console.error('Error creating chat:', error)
        alert('Failed to start chat. Please try again.')
      } finally {
        setCreatingChat(false)
      }
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

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

  const images = listing.listing_images?.length > 0 
    ? listing.listing_images.map((img: any) => img.image_url)
    : ['/placeholder.svg']

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card">
                <Image
                  src={images[currentImageIndex]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
                
                {images.length > 1 && (
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
                      {images.map((_: any, index: number) => (
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
                  {listing.city}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(listing.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="mt-6 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-secondary">
                    <Image
                      src={listing.seller?.avatar_url || `https://ui-avatars.com/api/?name=${listing.seller?.full_name || 'User'}&background=random`}
                      alt={listing.seller?.full_name || 'User'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{listing.seller?.full_name || 'User'}</span>
                      <BadgeCheck className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Member since {new Date(listing.seller?.created_at || Date.now()).getFullYear()}</span>
                    </div>
                  </div>
                </div>
                {listing.seller?.phone && (
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Phone className="h-4 w-4 text-accent" />
                      Contact Seller: {listing.seller.phone}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {user?.id === listing.seller_id ? (
                  <Button
                    disabled
                    className="flex-1 gap-2 rounded-xl bg-secondary text-muted-foreground cursor-not-allowed"
                  >
                    This is Your Listing
                  </Button>
                ) : (
                  <Button
                    onClick={handleChat}
                    className="flex-1 gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={creatingChat}
                  >
                    {creatingChat ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                    Chat with Seller
                  </Button>
                )}
                {listing.seller?.phone && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`tel:${listing.seller.phone}`)}
                    className="flex-1 gap-2 rounded-xl border-border bg-card hover:bg-secondary"
                  >
                    <Phone className="h-4 w-4" />
                    Call Seller
                  </Button>
                )}
              </div>
              
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">Description</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
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
                    image={item.listing_images?.[0]?.image_url || '/placeholder.svg'}
                    location={item.city}
                    condition={item.condition}
                    posted={new Date(item.created_at).toLocaleDateString()}
                    seller={item.seller}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

