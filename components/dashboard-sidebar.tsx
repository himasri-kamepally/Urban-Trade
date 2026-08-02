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
  Plus, Filter, RefreshCw, ChevronLeft, ChevronRight,
  Laptop, Sofa, Car, Building2, Shirt, Briefcase
} from 'lucide-react'

interface DashboardSidebarProps {
  activeTab: string
}

export function DashboardSidebar({ activeTab }: DashboardSidebarProps) {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [collapsed, setCollapsed] = useState(false)
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

    const channel = supabase.channel('sidebar-unread-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchUnreadCount)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const currentCategory = searchParams.get('category') || ''
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  const currentCondition = searchParams.get('condition') || ''
  const currentCity = searchParams.get('city') || ''

  const [minPrice, setMinPrice] = useState(currentMinPrice)
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice)
  const [city, setCity] = useState(currentCity)

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
    { name: 'Electronics', icon: Laptop, id: 'electronics' },
    { name: 'Furniture', icon: Sofa, id: 'furniture' },
    { name: 'Cars', icon: Car, id: 'cars' },
    { name: 'Property', icon: Building2, id: 'property' },
    { name: 'Fashion', icon: Shirt, id: 'fashion' },
    { name: 'Services', icon: Briefcase, id: 'services' },
  ]

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
    <aside className={cn(
      "h-[calc(100vh-8rem)] sticky top-24 hidden lg:flex flex-col p-5 rounded-xl bg-card border border-border shadow-soft-lg z-40 transition-all duration-300",
      collapsed ? "w-20" : "w-72"
    )}>
      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-all"
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <nav className="flex-1 space-y-5 overflow-y-auto pr-2 scrollbar-hide">
        
        {/* Navigation Section */}
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 group relative justify-center lg:justify-start",
                  activeTab === link.id 
                    ? "bg-foreground text-background" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                title={collapsed ? link.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{link.label}</span>}
                {activeTab === link.id && !collapsed && <div className="ml-auto w-2 h-2 rounded-full bg-background" />}
              </Link>
            )
          })}
        </div>

        {!collapsed && (
          <>
            {/* Categories Section */}
            <div>
              <h4 className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Categories</h4>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => updateFilters({ category: currentCategory === cat.name ? null : cat.name })}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 group text-left",
                        currentCategory === cat.name 
                          ? "bg-foreground text-background" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="text-sm font-medium">{cat.name}</span>
                      {currentCategory === cat.name && <div className="ml-auto w-2 h-2 rounded-full bg-foreground" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="border-t border-border/50 pt-4 space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Filter className="h-3 w-3" /> Filters
                </span>
                {hasActiveFilters && (
                  <button 
                    onClick={handleClearAll}
                    className="text-[9px] font-bold text-foreground hover:text-muted-foreground uppercase tracking-wider flex items-center gap-1"
                  >
                    <RefreshCw className="h-2.5 w-2.5" /> Clear
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
                          "px-3 py-1 rounded-lg text-[10px] font-bold border transition-all",
                          isActive 
                            ? "bg-foreground text-background border-foreground shadow-soft" 
                            : "bg-background border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-foreground/30"
                  />
                  <span className="text-muted-foreground text-xs">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-foreground/30"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full mt-1 py-1.5 rounded-lg border border-border bg-secondary hover:bg-muted text-[10px] font-bold text-foreground uppercase tracking-wider transition-colors cursor-pointer"
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
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-foreground/30"
                  />
                  <button 
                    type="submit"
                    className="px-3 rounded-lg bg-foreground text-background text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer hover:bg-foreground/90"
                  >
                    Go
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </nav>

      <div className={cn("mt-auto border-t border-border/50 shrink-0", collapsed ? "pt-2" : "pt-5")}>
        <Button 
          onClick={() => router.push('/sell')}
          className={cn(
            "rounded-lg bg-foreground text-background font-bold shadow-soft-lg hover:bg-foreground/90 transition-all border-none",
            collapsed ? "w-full h-11 p-0" : "w-full h-12"
          )}
        >
          {collapsed ? <Plus className="h-5 w-5" /> : (
            <>
              <Plus className="h-5 w-5" />
              Sell Item
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
