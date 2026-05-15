'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { getListings } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import DotField from '@/components/DotField'
import { 
  Home, Grid, Heart, MapPin, Tag, MessageSquare, 
  ShoppingBag, Settings, ChevronRight, Loader2, Sparkles, TrendingUp, Search,
  Bell, User, Plus, Compass, LayoutGrid, Clock, Map as MapIcon, ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

function DashboardSidebar({ activeTab }: { activeTab: string }) {
  const { user } = useAuth()
  const router = useRouter()
  
  const links = [
    { icon: Home, label: 'Home', id: 'home', href: '/marketplace' },
    { icon: Compass, label: 'Explore', id: 'explore', href: '/marketplace' },
    { icon: MessageSquare, label: 'Messages', id: 'messages', href: '/chat' },
    { icon: Heart, label: 'Saved Items', id: 'saved', href: '/dashboard?tab=saved' },
    { icon: Tag, label: 'My Listings', id: 'listings', href: '/dashboard?tab=listings' },
    { icon: LayoutGrid, label: 'Categories', id: 'categories', href: '/marketplace?category=all' },
    { icon: User, label: 'Profile', id: 'profile', href: '/dashboard?tab=profile' },
    { icon: Settings, label: 'Settings', id: 'settings', href: '/dashboard?tab=settings' },
  ]

  return (
    <aside className="w-72 h-[calc(100vh-2rem)] sticky top-4 hidden lg:flex flex-col p-6 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-black/[0.03] z-40">
      <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => router.push('/')}>
        <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
          U
        </div>
        <span className="text-xl font-black tracking-tight text-foreground">UrbanTrade</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-hide">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
              activeTab === link.id 
                ? "bg-primary/5 text-primary font-bold" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <link.icon className={cn("h-5 w-5 transition-colors", activeTab === link.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
            <span className="text-sm">{link.label}</span>
            {activeTab === link.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border/50">
        <Button 
          onClick={() => router.push('/sell')}
          className="w-full h-14 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
        >
          <Plus className="h-5 w-5" />
          Sell Item
        </Button>
      </div>
    </aside>
  )
}

function RightPanel() {
  return (
    <aside className="w-80 h-[calc(100vh-2rem)] sticky top-4 hidden xl:flex flex-col gap-6 z-40">
      {/* Active Chats */}
      <div className="p-6 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-black/[0.03]">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-black text-sm uppercase tracking-wider text-muted-foreground">Active Chats</h4>
          <span className="h-5 w-5 rounded-full bg-primary text-[10px] flex items-center justify-center text-white font-bold">2</span>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Rahul Sharma', msg: 'Is the sofa available?', time: '2m', avatar: '1' },
            { name: 'Priya Patel', msg: 'Can we meet at 5pm?', time: '1h', avatar: '2' }
          ].map((chat, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer group">
              <div className="relative h-10 w-10 rounded-full overflow-hidden bg-secondary">
                <Image src={`https://i.pravatar.cc/150?u=${chat.avatar}`} alt={chat.name} fill className="object-cover" unoptimized/>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{chat.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{chat.msg}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{chat.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Map Preview */}
      <div className="p-6 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-black/[0.03] flex-1 relative overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 grayscale opacity-40 group-hover:opacity-60 transition-opacity">
          <Image src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80" alt="Map" fill className="object-cover" unoptimized />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-sm uppercase tracking-wider text-muted-foreground">Nearby Activity</h4>
            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-lg border border-border">
              <MapIcon className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-border animate-bounce-slow">
            <p className="text-[10px] font-bold">3 new items listed within 500m</p>
          </div>
        </div>
      </div>

      {/* Trending Nearby */}
      <div className="p-6 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-black/[0.03]">
        <h4 className="font-black text-sm uppercase tracking-wider text-muted-foreground mb-4">Trending</h4>
        <div className="space-y-3">
          {['MacBook Air M2', 'IKEA Desk', 'Gym Weights'].map((item, i) => (
            <div key={i} className="flex items-center justify-between group cursor-pointer">
              <span className="text-sm font-bold group-hover:text-primary transition-colors">{item}</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function MainDashboardContent({ listings }: { listings: any[] }) {
  const { user } = useAuth()
  
  const categories = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Furniture', icon: '🛋️' },
    { name: 'Vehicles', icon: '🚗' },
    { name: 'Rentals', icon: '🏠' },
    { name: 'Fashion', icon: '👗' },
    { name: 'Services', icon: '🛠️' },
  ]

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
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-black/[0.02] border border-border">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-black/[0.02] border border-border overflow-hidden p-1">
             <div className="h-full w-full rounded-[0.75rem] overflow-hidden relative">
               <Image src={user?.avatar || ''} alt="User" fill className="object-cover" unoptimized/>
             </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button key={cat.name} className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-border hover:bg-secondary/20 hover:shadow-xl hover:shadow-black/[0.02] transition-all duration-300 group">
            <span className="text-lg group-hover:scale-125 transition-transform">{cat.icon}</span>
            <span className="text-sm font-bold text-foreground">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Nearby Picks Feed */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black text-foreground">Nearby Picks</h2>
          </div>
          <button className="text-sm font-black text-primary hover:underline">View all</button>
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
            />
          ))}
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
            <div key={listing.id} className="w-64 flex-shrink-0 group cursor-pointer">
              <div className="aspect-square rounded-3xl overflow-hidden relative mb-4">
                <Image src={listing.listing_images?.[0]?.image_url || '/placeholder.svg'} alt={listing.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized/>
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-xl text-[10px] font-black uppercase text-foreground border border-border shadow-sm">
                  {listing.condition}
                </div>
              </div>
              <h3 className="font-bold truncate text-foreground">{listing.title}</h3>
              <p className="text-primary font-black mt-1">₹{listing.price.toLocaleString('en-IN')}</p>
            </div>
          ))}
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
            { title: 'Home Cleaning', price: '₹499', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?w=500&q=80' },
            { title: 'Repair Services', price: '₹299', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&q=80' },
            { title: 'Photography', price: '₹1,499', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&q=80' }
          ].map((service, i) => (
            <div key={i} className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-border shadow-xl cursor-pointer">
              <Image src={service.img} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs font-bold text-white/70 uppercase">Starts from</p>
                <h4 className="text-xl font-black">{service.title}</h4>
                <p className="text-primary font-bold">{service.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings({ limit: 20 })
        setListings(data || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white selection:bg-primary/20">
      <div className="relative z-10 mx-auto max-w-[1800px] flex gap-8 p-4 lg:p-8">
        <DashboardSidebar activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-hide px-4">
          <MainDashboardContent listings={listings} />
        </main>
        <RightPanel />
      </div>
    </div>
  )
}

