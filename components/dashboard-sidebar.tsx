'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { 
  Home, MessageSquare, Heart, Tag, 
  Plus, Sparkles, Filter, RefreshCw, ChevronDown
} from 'lucide-react'

interface DashboardSidebarProps {
  activeTab: string
}

export function DashboardSidebar({ activeTab }: DashboardSidebarProps) {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user?.id) return

    const fetchUnreadCount = async () => {
      try {
        const { data: convos } = await supabase
          .from('chats')
          .select(`
            id,
            messages(sender_id, read)
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)

        let unread = 0
        convos?.forEach(chat => {
          const count = chat.messages?.filter((m: any) => m.sender_id !== user.id && m.read !== true).length || 0
          unread += count
        })
        setUnreadCount(unread)
      } catch (err) {
        console.error('Error fetching unread messages count:', err)
      }
    }

    fetchUnreadCount()

    // Subscribe to new messages or status changes in real-time
    const channel = supabase.channel('sidebar-unread-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchUnreadCount)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  // Read current query parameters
  const currentCategory = searchParams.get('category') || ''
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  const currentCondition = searchParams.get('condition') || ''
  const currentCity = searchParams.get('city') || ''

  // Filter input states
  const [minPrice, setMinPrice] = useState(currentMinPrice)
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice)
  const [city, setCity] = useState(currentCity)

  // Sync inputs with URL parameters
  useEffect(() => {
    setMinPrice(currentMinPrice)
    setMaxPrice(currentMaxPrice)
    setCity(currentCity)
  }, [currentMinPrice, currentMaxPrice, currentCity])

  const links = [
    { icon: Home, label: 'Home', id: 'home', href: '/marketplace' },
    { icon: MessageSquare, label: 'Messages', id: 'messages', href: '/chat' },
    { icon: Heart, label: 'Saved Items', id: 'saved', href: '/dashboard?tab=saved' },
    { icon: Tag, label: 'My Listings', id: 'listings', href: '/dashboard?tab=listings' },
  ]

  const categories = [
    { name: 'Electronics', icon: '💻', id: 'electronics' },
    { name: 'Furniture', icon: '🛋️', id: 'furniture' },
    { name: 'Cars', icon: '🚗', id: 'cars' },
    { name: 'Property', icon: '🏠', id: 'property' },
    { name: 'Fashion', icon: '👗', id: 'fashion' },
    { name: 'Services', icon: '🛠️', id: 'services' },
    { name: 'Daily Needs', icon: '🍎', id: 'daily-needs' },
  ]

  // Helper to push updated search params
  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.push(`/marketplace?${params.toString()}`)
  }

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ minPrice, maxPrice })
  }

  const handleApplyCity = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ city })
  }

  const handleToggleCondition = (cond: string) => {
    const nextCond = currentCondition === cond ? null : cond
    updateFilters({ condition: nextCond })
  }

  const handleClearAll = () => {
    setMinPrice('')
    setMaxPrice('')
    setCity('')
    router.push('/marketplace')
  }

  const hasActiveFilters = currentCategory || currentMinPrice || currentMaxPrice || currentCondition || currentCity

  return (
    <aside className="w-72 h-[calc(100vh-8rem)] sticky top-24 hidden lg:flex flex-col p-6 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-black/[0.03] z-40">
      <nav className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
        
        {/* Navigation Section */}
        <div className="space-y-1">
          {links.map((link) => {
            const isMessages = link.id === 'messages'
            const showBadge = isMessages && unreadCount > 0 && activeTab !== 'messages'
            
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                  activeTab === link.id 
                    ? "bg-primary/5 text-primary font-bold" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <link.icon className={cn("h-5 w-5 transition-colors", activeTab === link.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="text-sm">{link.label}</span>
                
                {showBadge && (
                  <span className="ml-auto flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-md shadow-primary/20 animate-pulse">
                    {unreadCount}
                  </span>
                )}
                
                {activeTab === link.id && !showBadge && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            )
          })}
        </div>

        {/* Categories Section */}
        <div>
          <h4 className="px-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-3">Categories</h4>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilters({ category: currentCategory === cat.name ? null : cat.name })}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300 group text-left",
                  currentCategory === cat.name 
                    ? "bg-primary/5 text-primary font-bold" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm">{cat.name}</span>
                {currentCategory === cat.name && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Divider & Header */}
        <div className="border-t border-border/50 pt-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Filter className="h-3 w-3" /> Filters
            </span>
            {hasActiveFilters && (
              <button 
                onClick={handleClearAll}
                className="text-[9px] font-black text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
              >
                <RefreshCw className="h-2.5 w-2.5" /> Clear All
              </button>
            )}
          </div>

          {/* Condition Filter */}
          <div className="space-y-2 px-2">
            <label className="text-xs font-bold text-foreground">Condition</label>
            <div className="flex flex-wrap gap-1.5">
              {['New', 'Like New', 'Good', 'Fair'].map((cond) => {
                const isActive = currentCondition === cond
                return (
                  <button
                    key={cond}
                    onClick={() => handleToggleCondition(cond)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all",
                      isActive 
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/10" 
                        : "bg-white border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {cond}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <form onSubmit={handleApplyPrice} className="space-y-2 px-2">
            <label className="text-xs font-bold text-foreground">Price Range (₹)</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-secondary/30 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/40"
              />
              <span className="text-muted-foreground text-xs">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-secondary/30 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/40"
              />
            </div>
            <button 
              type="submit"
              className="w-full mt-1 py-1.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-[10px] font-black text-foreground uppercase tracking-wider transition-colors cursor-pointer"
            >
              Apply Price
            </button>
          </form>

          {/* Location Filter */}
          <form onSubmit={handleApplyCity} className="space-y-2 px-2">
            <label className="text-xs font-bold text-foreground">City</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-secondary/30 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/40"
              />
              <button 
                type="submit"
                className="px-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer hover:bg-primary/90"
              >
                Go
              </button>
            </div>
          </form>
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-border/50 shrink-0">
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
