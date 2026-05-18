'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { getListings, getUserProfile, getCategories, getConversations } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
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
  const { user } = useAuth()
  const [activeChats, setActiveChats] = useState<any[]>([])
  const [chatsLoading, setChatsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    
    const fetchChats = async () => {
      try {
        const convos = await getConversations(user.id)
        setActiveChats(convos || [])
      } catch (err) {
        console.error('Error loading chats in RightPanel:', err)
      } finally {
        setChatsLoading(false)
      }
    }

    fetchChats()

    // Real-time subscription to message updates to reload chats in dashboard
    const channel = supabase.channel('right-panel-chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchChats)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const uniqueSellers = new Set(listings.map(l => l.seller_id)).size
  const totalItems = listings.length

  const getOtherUser = (chat: any) => {
    return chat.buyer_id === user?.id ? chat.seller : chat.buyer
  }

  return (
    <aside className="w-80 h-[calc(100vh-8rem)] sticky top-24 hidden xl:flex flex-col gap-6 z-40">
      {/* Active Chats */}
      <div className="p-6 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-black/[0.03] flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h4 className="font-black text-sm uppercase tracking-wider text-muted-foreground">Active Chats</h4>
          <MessageSquare className="h-4 w-4 text-muted-foreground/50" />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-hide">
          {chatsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : activeChats.length > 0 ? (
            activeChats.map((chat) => {
              const otherUser = getOtherUser(chat)
              const otherName = otherUser?.full_name || 'User'
              const initial = otherName.charAt(0).toUpperCase()
              const hasUnread = chat.unread_count > 0

              return (
                <Link
                  key={chat.id}
                  href={`/chat?id=${chat.id}`}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 border border-transparent hover:border-border/30 transition-all duration-300 group"
                >
                  <div className="relative shrink-0 w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center font-bold text-primary text-sm group-hover:scale-105 transition-transform duration-300">
                    {initial}
                    {hasUnread && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-foreground truncate group-hover:text-primary transition-colors">
                        {otherName}
                      </span>
                      {hasUnread && (
                        <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-primary text-[8px] font-black text-white">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                      {chat.last_message?.content || 'No messages yet'}
                    </p>
                  </div>
                </Link>
              )
            })
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full min-h-[180px] text-center opacity-70">
              <div className="h-12 w-12 bg-secondary/50 rounded-full flex items-center justify-center mb-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs font-bold text-foreground">No recent messages</p>
              <p className="text-[9px] text-muted-foreground mt-1 max-w-[180px] leading-relaxed">
                When you start a conversation with a seller, your active chats will appear here.
              </p>
            </div>
          )}
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

  const displayName = profileData?.full_name || user?.name || 'Guest'

  return (
    <div className="flex-1 max-w-4xl mx-auto space-y-12 pb-20">
      {/* Top Section: Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Let's find something amazing, {displayName.split(' ')[0]} ✨
          </h1>
          <p className="mt-2 text-muted-foreground text-lg">
            Discover verified products, rare finds, and trusted local services today.
          </p>
        </div>
      </div>

      {isProfileIncomplete && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm text-destructive">Profile Verification Required</h5>
              <p className="text-xs text-muted-foreground mt-0.5">Please update your phone number and city in profile settings to display distance calculations.</p>
            </div>
          </div>
          <Button onClick={() => router.push('/dashboard?tab=settings')} size="sm" variant="destructive" className="rounded-xl font-bold shrink-0">Update Profile</Button>
        </div>
      )}

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
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const condition = searchParams.get('condition') || undefined
  const city = searchParams.get('city') || undefined
  const searchQuery = searchParams.get('q') || undefined
  
  const activeTab = category ? category.toLowerCase() : 'home'
  
  const [listings, setListings] = useState<any[]>([])
  const [profileData, setProfileData] = useState<any>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch categories to map the name to a UUID
        const dbCats = await getCategories()
        const matchedCat = dbCats.find((c: any) => c.name.toLowerCase() === category?.toLowerCase())
        const categoryUuid = matchedCat ? matchedCat.id : undefined

        const [listingsData, profile] = await Promise.all([
          getListings({ 
            limit: 20, 
            category: categoryUuid,
            minPrice,
            maxPrice,
            condition,
            city,
            search: searchQuery
          }),
          user?.id ? getUserProfile(user.id) : Promise.resolve(null)
        ])
        setListings(listingsData || [])
        setProfileData(profile)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsInitialLoad(false)
      }
    }
    if (user) {
      fetchData()
    } else if (!authLoading) {
      getCategories().then(dbCats => {
        const matchedCat = dbCats.find((c: any) => c.name.toLowerCase() === category?.toLowerCase())
        const categoryUuid = matchedCat ? matchedCat.id : undefined
        getListings({ 
          limit: 20, 
          category: categoryUuid,
          minPrice,
          maxPrice,
          condition,
          city,
          search: searchQuery
        }).then(data => {
          setListings(data || [])
          setIsInitialLoad(false)
        }).catch(() => {
          setIsInitialLoad(false)
        })
      }).catch(() => {
        setIsInitialLoad(false)
      })
    }
  }, [user, authLoading, category, minPrice, maxPrice, condition, city, searchQuery])

  if (authLoading || isInitialLoad) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
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
        <div className="flex h-screen items-center justify-center bg-white">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }>
        <MarketplaceContent />
      </Suspense>
    </div>
  )
}
