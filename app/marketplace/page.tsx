'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { getListings, getCategories } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import { 
  Home, Grid, Heart, MapPin, Tag, MessageSquare, 
  ShoppingBag, Settings, ChevronRight, Loader2, Sparkles, TrendingUp
} from 'lucide-react'

// Placeholder banner images (using unsplash for demo)
const banners = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
  "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1200&q=80",
]

function FeedDashboard({ listings }: { listings: any[] }) {
  // Split listings into different "sections" for the feed effect
  const recommended = listings.slice(0, 4)
  const nearby = listings.slice(4, 8)
  const trending = listings.slice(8, 12)

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Banner Carousel */}
      <div className="relative aspect-[3/1] md:aspect-[4/1] overflow-hidden rounded-2xl">
        <Image src={banners[0]} alt="Sale Banner" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8 lg:p-12">
          <div className="text-white max-w-lg animate-fade-in">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4">Summer Mega Sale</h2>
            <p className="text-lg opacity-90 mb-6">Up to 70% off on electronics, furniture, and vehicles. Hand-picked deals in your city.</p>
            <Button className="bg-accent text-white hover:bg-accent/90 rounded-xl px-8 h-12 text-lg font-bold">
              Explore Deals
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <div>
        <h3 className="text-xl font-bold mb-4">Explore Popular Categories</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {['Electronics', 'Vehicles', 'Furniture', 'Fashion', 'Real Estate', 'Services'].map((cat, i) => (
            <Link key={cat} href={`/marketplace?category=${cat.toLowerCase()}`} className="flex-shrink-0 flex flex-col items-center gap-2 group">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-transparent group-hover:border-primary transition-colors overflow-hidden">
                <span className="font-bold text-muted-foreground group-hover:text-primary transition-colors text-xl">
                  {cat.charAt(0)}
                </span>
              </div>
              <span className="text-xs font-semibold text-center">{cat}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Products */}
      {recommended.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="text-xl font-bold">Recommended for You</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {recommended.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                image={listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
                location={listing.city}
                condition={listing.condition}
                posted={new Date(listing.created_at).toLocaleDateString()}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trending Deals */}
      {trending.length > 0 && (
        <div className="bg-secondary/50 rounded-2xl p-6 lg:p-8 -mx-4 lg:mx-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <h3 className="text-xl font-bold">Trending Deals</h3>
            </div>
            <Link href="/marketplace?sort=trending" className="text-primary font-semibold text-sm hover:underline">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {trending.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                image={listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
                location={listing.city}
                condition={listing.condition}
                posted={new Date(listing.created_at).toLocaleDateString()}
              />
            ))}
          </div>
        </div>
      )}

      {/* Nearby Items */}
      {nearby.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-bold">Items Near You</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {nearby.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                image={listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
                location={listing.city}
                condition={listing.condition}
                posted={new Date(listing.created_at).toLocaleDateString()}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MarketplaceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [dbListings, setDbListings] = useState<any[]>([])
  
  const searchQuery = searchParams.get('search') || searchParams.get('q') || ''
  const selectedCategory = searchParams.get('category') || 'all'
  const isSearchMode = searchQuery !== '' || selectedCategory !== 'all'

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        const data = await getListings({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery,
          limit: isSearchMode ? 50 : 20 // Fetch more if searching, less if just feed
        })
        setDbListings(data || [])
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [searchQuery, selectedCategory, isSearchMode])

  const sidebarLinks = [
    { icon: Home, label: 'Home Feed', href: '/marketplace', active: !isSearchMode },
    { icon: Grid, label: 'Categories', href: '/marketplace?category=all' },
    { icon: Heart, label: 'Saved Items', href: '/dashboard?tab=saved' },
    { icon: MapPin, label: 'Nearby Deals', href: '/marketplace?near=me' },
    { icon: Tag, label: 'My Listings', href: '/dashboard?tab=listings' },
    { icon: MessageSquare, label: 'Messages', href: '/chat' },
    { icon: ShoppingBag, label: 'My Orders', href: '/dashboard?tab=orders' },
    { icon: Settings, label: 'Settings', href: '/dashboard?tab=settings' },
  ]

  return (
    <div className="flex-1 bg-muted/30">
      <div className="mx-auto flex max-w-[1600px] w-full">
        
        {/* Left Sidebar - Amazon Style */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-border bg-background min-h-[calc(100vh-80px)] p-6 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-secondary/50 border border-border/50">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                <Image src={user.avatar} alt="Avatar" width={40} height={40} className="object-cover" unoptimized/>
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}

          <nav className="space-y-1 mb-8">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">Dashboard</h4>
            {sidebarLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${link.active ? 'bg-primary/10 text-primary font-bold' : 'text-foreground hover:bg-secondary'}`}
              >
                <link.icon className={`h-5 w-5 ${link.active ? 'text-primary' : 'text-muted-foreground'}`} />
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className="space-y-1">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">Quick Links</h4>
            <Link href="/sell" className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-sm font-medium text-foreground hover:bg-secondary group">
              Post an Ad <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            </Link>
            <Link href="/help" className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-sm font-medium text-foreground hover:bg-secondary group">
              Help Center <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 w-full max-w-full overflow-hidden min-h-[calc(100vh-80px)]">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : isSearchMode ? (
            // Search Results View
            <div>
              <div className="mb-6 flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                <div>
                  <h1 className="text-xl font-bold">Search Results</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {dbListings.length} items found {searchQuery && `for "${searchQuery}"`}
                  </p>
                </div>
              </div>
              
              {dbListings.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                  {dbListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      image={listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
                      location={listing.city}
                      condition={listing.condition}
                      posted={new Date(listing.created_at).toLocaleDateString()}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border text-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-xl font-bold text-foreground">No matches found</p>
                  <p className="mt-2 text-muted-foreground max-w-md">
                    We couldn't find any items matching your search. Try using broader terms or different categories.
                  </p>
                  <Button variant="outline" onClick={() => router.push('/marketplace')} className="mt-6 rounded-xl font-semibold">
                    Back to Feed
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Feed Dashboard View
            <FeedDashboard listings={dbListings} />
          )}
        </main>

      </div>
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <MarketplaceContent />
      </Suspense>
      {/* Remove footer from Dashboard for more app-like feel, or keep it depending on preference. Keeping it for now. */}
      <Footer />
    </div>
  )
}

