'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { 
  Search, MessageSquare, Heart, PlusCircle, 
  ChevronDown, Settings, LogOut, Loader2 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function MarketplaceHeader() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories')
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const fetchCounts = async () => {
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
          
          setUnreadMessages(unread)
        } catch (error) {
          console.error('Error fetching unread counts:', error)
        }
      }
      
      fetchCounts()
      
      const channel = supabase.channel('marketplace-header-counts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchCounts)
        .subscribe()
      
      return () => { supabase.removeChannel(channel) }
    }
  }, [isAuthenticated, user?.id])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory && selectedCategory !== 'All Categories') {
      params.set('category', selectedCategory)
    }
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <header className="w-full border-b border-border bg-white sticky top-0 z-50 px-4 py-4 lg:px-8">
      <div className="mx-auto max-w-[1800px] flex items-center justify-between gap-6">
        
        {/* Left Side: Logo */}
        <Link href="/marketplace" className="flex items-center gap-3 shrink-0">
          <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
            U
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground hidden sm:block">UrbanTrade</span>
        </Link>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl hidden md:flex items-center border border-border rounded-xl bg-secondary/30 overflow-hidden focus-within:border-foreground/30 focus-within:shadow-soft-lg transition-all">
          <Search className="h-5 w-5 text-muted-foreground ml-4 shrink-0" />
          <input
            type="text"
            placeholder="Search for items, services or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/60"
          />
          <button type="submit" className="bg-foreground text-background h-12 px-6 flex items-center justify-center hover:bg-foreground/90 transition-all font-bold text-sm">
            Search
          </button>
        </form>

        {/* Right Side: Navigation Action Items */}
        <div className="flex items-center gap-6 md:gap-8 shrink-0">
          
          {/* Profile Option */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center gap-1 group focus:outline-none">
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border group-hover:border-primary transition-all">
                  <Image
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                    alt={user?.name || 'User'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="text-[10px] font-black text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-wider">Profile</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-border bg-card shadow-lg mt-2">
              <div className="px-3 py-3">
                <p className="text-sm font-bold text-foreground truncate">{user?.name || 'Guest'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || 'Sign in to access your account'}</p>
              </div>
              <DropdownMenuSeparator className="bg-border" />
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

      {/* Mobile Search Bar (Only shown on small screens) */}
      <form onSubmit={handleSearch} className="flex md:hidden mt-4 items-center border border-border rounded-xl bg-secondary/30 overflow-hidden focus-within:border-primary/50 transition-all">
        <input
          type="text"
          placeholder="Search for items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/60"
        />
        <button type="submit" className="bg-primary text-white h-10 w-12 flex items-center justify-center hover:bg-primary/95 transition-all">
          <Search className="h-4 w-4" />
        </button>
      </form>
    </header>
  )
}
