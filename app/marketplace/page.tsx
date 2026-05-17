'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { getListings, getUserProfile } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import DotField from '@/components/DotField'
import { 
  Home, Grid, Heart, MapPin, Tag, MessageSquare, 
  ShoppingBag, Settings, ChevronRight, Loader2, Sparkles, TrendingUp, Search,
  Bell, User, Plus, Compass, LayoutGrid, Clock, Map as MapIcon, ArrowUpRight, LogOut, ChevronDown, AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { MarketplaceHeader } from '@/components/marketplace-header'

function RightPanel({ listings }: { listings: any[] }) {
  const uniqueSellers = new Set(listings.map(l => l.seller_id)).size
  const totalItems = listings.length

  return (
    <aside className="w-80 h-[calc(100vh-8rem)] sticky top-24 hidden xl:flex flex-col gap-6 z-40">
      {/* Active Chats */}
      <div className="p-6 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-black/[0.03] flex-1">
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-black text-sm uppercase tracking-wider text-muted-foreground">Active Chats</h4>
          <MessageSquare className="h-4 w-4 text-muted-foreground/50" />
        </div>
        
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center h-[200px] text-center opacity-70">
          <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground">No recent messages</p>
          <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">When you start a conversation, your active chats will appear here.</p>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="p-6 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-black/[0.03]">
        <h4 className="font-black text-sm uppercase tracking-wider text-muted-foreground mb-4">Marketplace Pulse</h4>
        <div className="space-y-4">
          <div className="bg-secondary/30 rounded-2xl p-4 border border-border/50">
             <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Items Available</p>
             <p className="text-2xl font-black text-primary">{totalItems}</p>
          </div>
          <div className="bg-secondary/30 rounded-2xl p-4 border border-border/50">
             <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Active Sellers</p>
             <p className="text-2xl font-black text-foreground">{uniqueSellers}</p>
          </div>
        </div>
      </div>

      {/* Recently Added */}
      <div className="p-6 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-black/[0.03]">
        <h4 className="font-black text-sm uppercase tracking-wider text-muted-foreground mb-4">Just Added</h4>
        <div className="space-y-3">
          {listings.slice(0, 3).map((item, i) => (
            <Link key={item.id || i} href={`/product/${item.id}`} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-secondary/50 transition-colors">
              <span className="text-sm font-bold truncate pr-2 group-hover:text-primary transition-colors">{item.title}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
          {listings.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No items yet</p>
          )}
        </div>
      </div>
    </aside>
  )
}

function MainDashboardContent({ listings, profileData, category }: { listings: any[], profileData: any, category?: string | null }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  
  const isProfileIncomplete = user && (!profileData?.phone || !profileData?.city)

  if (category && category !== 'all') {
    return (
      <div className="flex-1 max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground font-black px-4 py-2.5 flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-md shadow-black/[0.02]"
          >
            <ChevronRight className="h-5 w-5 rotate-180" /> Back
          </button>
          <h1 className="text-3xl font-black text-foreground capitalize">{category}</h1>
        </div>
        
        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border py-32 bg-secondary/20">
            <Compass className="h-16 w-16 text-muted-foreground/50 mb-6" />
            <p className="text-xl font-bold text-foreground">No listings found</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">There are currently no items available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                image={listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
                location={listing.city}
                condition={listing.condition}
                posted={new Date(listing.created_at).toLocaleDateString()}
                seller={listing.seller}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto space-y-12 pb-20">
      {/* Top Section: Greeting & Profile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Good evening, {user?.name?.split(' ')[0] || 'Guest'} 👋
          </h1>
          <p className="mt-2 text-muted-foreground text-lg">
            Discover products and services happening around your community.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/chat')}
            className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-black/[0.02] border border-border text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-black/[0.02] border border-border overflow-hidden p-1 group relative cursor-pointer hover:border-primary transition-colors focus:outline-none">
                 <div className="h-full w-full rounded-[0.75rem] overflow-hidden relative">
                   <Image src={user?.avatar || ''} alt="User" fill className="object-cover" unoptimized/>
                 </div>
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[0.75rem] m-1">
                   <ChevronDown className="text-white h-5 w-5" />
                 </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-border bg-card shadow-lg mt-2">
              <DropdownMenuItem onClick={() => router.push('/dashboard?tab=settings')} className="cursor-pointer gap-2 py-2.5 focus:bg-secondary">
                <Settings className="h-4 w-4 text-muted-foreground" /> Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={logout} className="cursor-pointer gap-2 py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      {isProfileIncomplete && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">Complete your profile</p>
              <p className="text-sm text-muted-foreground mt-1">Please add your phone number and city to get accurate distances and connect with sellers.</p>
            </div>
          </div>
          <Button onClick={() => router.push('/dashboard?tab=settings')} variant="outline" size="sm" className="shrink-0 border-destructive/20 hover:bg-destructive/10 text-destructive font-bold rounded-xl">
            Update Settings
          </Button>
        </div>
      )}

      {/* Nearby Picks Feed */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black text-foreground">Nearby Picks</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {listings.slice(0, 4).map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              price={listing.price}
              image={listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
              location={listing.city}
              condition={listing.condition}
              posted={new Date(listing.created_at).toLocaleDateString()}
              seller={listing.seller}
            />
          ))}
          {listings.length === 0 && (
            <p className="text-muted-foreground">No listings found.</p>
          )}
        </div>
      </div>

      {/* Recently Listed - Horizontal Scroll */}
      <div className="bg-white rounded-[3rem] p-10 border border-border shadow-2xl shadow-black/[0.02] overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Recently Listed</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {listings.slice(4, 10).map((listing) => (
            <Link key={listing.id} href={`/product/${listing.id}`} className="w-64 flex-shrink-0 group cursor-pointer block">
              <div className="aspect-square rounded-3xl overflow-hidden relative mb-4">
                <Image src={listing.listing_images?.[0]?.image_url || '/placeholder.svg'} alt={listing.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized/>
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-xl text-[10px] font-black uppercase text-foreground border border-border shadow-sm">
                  {listing.condition}
                </div>
              </div>
              <h3 className="font-bold truncate text-foreground group-hover:text-primary transition-colors">{listing.title}</h3>
              <p className="text-primary font-black mt-1">₹{listing.price.toLocaleString('en-IN')}</p>
            </Link>
          ))}
          {listings.length <= 4 && (
             <p className="text-muted-foreground text-sm">No recent listings</p>
          )}
        </div>
      </div>

      {/* Local Services Section */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Local Services</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Home Cleaning', price: '₹499', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80' },
            { title: 'Repair Services', price: '₹299', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&q=80' },
            { title: 'Photography', price: '₹1,499', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80' }
          ].map((service, i) => (
            <Link key={i} href={`/marketplace?category=Services`} className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-border shadow-xl cursor-pointer block">
              <Image src={service.img} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs font-bold text-white/70 uppercase">Starts from</p>
                <h4 className="text-xl font-black">{service.title}</h4>
                <p className="text-primary font-bold">{service.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function MarketplaceContent() {
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const activeTab = category ? category.toLowerCase() : 'home'
  
  const [listings, setListings] = useState<any[]>([])
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsData, profile] = await Promise.all([
          getListings({ limit: 20, category: category || undefined }),
          user?.id ? getUserProfile(user.id) : Promise.resolve(null)
        ])
        setListings(listingsData || [])
        setProfileData(profile)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      fetchData()
    } else if (!authLoading) {
      getListings({ limit: 20, category: category || undefined }).then(data => {
        setListings(data || [])
        setLoading(false)
      })
    }
  }, [user, authLoading, category])

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="relative z-10 mx-auto max-w-[1800px] flex gap-8 p-4 lg:p-8">
      <DashboardSidebar activeTab={activeTab} />
      <main className="flex-1 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-hide px-4">
        <MainDashboardContent listings={listings} profileData={profileData} category={category} />
      </main>
      <RightPanel listings={listings} />
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <div className="relative min-h-screen bg-white selection:bg-primary/20">
      <MarketplaceHeader />
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }>
        <MarketplaceContent />
      </Suspense>
    </div>
  )
}
