'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/auth-context'
import { useScrollHeader } from '@/hooks/use-scroll-animation'
import { Search, Menu, X, Bell, MessageSquare, Plus, User, LogOut, LayoutDashboard, ChevronDown, Settings, Heart, MapPin, SearchCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

function HeaderInner() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, setShowAuthModal, setAuthModalView, requireAuth } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const scrolled = useScrollHeader()

  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifs, setUnreadNotifs] = useState(0)

  useEffect(() => {
    if (pathname === '/chat') {
      setUnreadMessages(0)
    }
    if (pathname === '/dashboard' && searchParams.get('tab') === 'notifications') {
      setUnreadNotifs(0)
    }
  }, [pathname, searchParams])

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
            const count = chat.messages?.filter((m: any) => m.sender_id !== user.id && !m.read).length || 0
            unread += count
          })
          
          setUnreadMessages(unread)

          const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('read', false)
          
          setUnreadNotifs(count || 0)
        } catch (error) {
          console.error('Error fetching counts:', error)
        }
      }
      fetchCounts()
      
      const channel = supabase.channel('header-counts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchCounts)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchCounts)
        .subscribe()
      
      return () => { supabase.removeChannel(channel) }
    }
  }, [isAuthenticated, user?.id])

  const handleProtectedAction = (path: string) => {
    requireAuth(() => {
      router.push(path)
    })
  }

  const handleOpenLogin = () => {
    setAuthModalView('login')
    setShowAuthModal(true)
  }

  const handleOpenSignup = () => {
    setAuthModalView('signup')
    setShowAuthModal(true)
  }

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled 
          ? "h-16 border-border/50 bg-background/90 backdrop-blur-xl shadow-md" 
          : "h-20 border-border bg-background/80 backdrop-blur-xl"
      )}
    >
      <div className={cn(
        "mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 transition-all duration-300 lg:px-8",
        scrolled ? "h-16" : "h-20"
      )}>
        {/* Left Side: Logo */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20">
              <span className="text-xl font-bold">U</span>
            </div>
            <span className="text-xl font-black tracking-tight hidden md:block">UrbanTrade</span>
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition-all hover:bg-secondary">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border">
                      <Image
                        src={user?.avatar || ''}
                        alt={user?.name || 'User'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border-border bg-card shadow-lg">
                  <div className="px-3 py-3">
                    <p className="text-sm font-bold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={() => router.push('/dashboard?tab=settings')} className="cursor-pointer gap-2 py-2.5 focus:bg-secondary">
                    <Settings className="h-4 w-4 text-muted-foreground" /> Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer gap-2 py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                className="rounded-xl bg-primary text-white hover:bg-primary/90 px-6 font-bold shadow-md ml-2"
                onClick={() => handleProtectedAction('/sell')}
              >
                Start Selling
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleOpenLogin}
                className="text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-transparent transition-all"
              >
                Login
              </Button>
              <Button
                onClick={handleOpenSignup}
                className="rounded-xl bg-primary text-white hover:bg-primary/90 px-6 font-bold shadow-md border border-white/10"
              >
                Start Selling
              </Button>
            </>
          )}
        </div>

        <button
          className="flex items-center justify-center lg:hidden bg-secondary rounded-lg p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Search Bar (Only visible when not scrolled or explicitly searching) */}
      <div className="lg:hidden px-4 pb-3 border-b border-border bg-background">
         <form 
            className="flex w-full items-center shadow-sm rounded-xl border border-border bg-card overflow-hidden"
            onSubmit={(e) => { e.preventDefault() }}
          >
            <input
              type="text"
              placeholder="Search UrbanTrade..."
              className="h-10 flex-1 bg-transparent px-4 text-sm text-foreground focus:outline-none"
            />
            <button type="submit" className="flex h-10 w-12 items-center justify-center bg-primary text-white">
              <Search className="h-4 w-4" />
            </button>
          </form>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-border bg-background lg:hidden absolute w-full shadow-lg">
          <div className="space-y-1 px-4 py-4 max-h-[80vh] overflow-y-auto">
            {isAuthenticated ? (
              <>
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-secondary p-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image src={user?.avatar || ''} alt={user?.name || 'User'} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link href="/marketplace" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary" onClick={() => setMobileMenuOpen(false)}>
                  <SearchCheck className="h-5 w-5 text-muted-foreground"/> Browse
                </Link>
                <button onClick={() => { setMobileMenuOpen(false); handleProtectedAction('/sell'); }} className="flex items-center gap-3 w-full rounded-lg px-3 py-3 text-left text-base font-medium text-foreground hover:bg-secondary">
                  <Plus className="h-5 w-5 text-accent"/> Sell an Item
                </button>
                <button onClick={() => { setMobileMenuOpen(false); handleProtectedAction('/dashboard?tab=saved'); }} className="flex items-center gap-3 w-full rounded-lg px-3 py-3 text-left text-base font-medium text-foreground hover:bg-secondary">
                  <Heart className="h-5 w-5 text-destructive"/> Saved
                </button>
                <button onClick={() => { setMobileMenuOpen(false); handleProtectedAction('/chat'); }} className="flex items-center gap-3 w-full rounded-lg px-3 py-3 text-left text-base font-medium text-foreground hover:bg-secondary">
                  <MessageSquare className="h-5 w-5 text-blue-500"/> Messages
                </button>
                <button onClick={() => { setMobileMenuOpen(false); handleProtectedAction('/dashboard'); }} className="flex items-center gap-3 w-full rounded-lg px-3 py-3 text-left text-base font-medium text-foreground hover:bg-secondary">
                  <LayoutDashboard className="h-5 w-5 text-primary"/> Dashboard
                </button>
                <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="flex items-center gap-3 w-full rounded-lg px-3 py-3 mt-4 text-left text-base font-bold text-destructive hover:bg-destructive/10">
                  <LogOut className="h-5 w-5"/> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/marketplace" className="block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary" onClick={() => setMobileMenuOpen(false)}>Browse Marketplace</Link>
                <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => { setMobileMenuOpen(false); handleOpenLogin(); }} className="w-full rounded-xl h-12 font-bold border-border">Login</Button>
                  <Button onClick={() => { setMobileMenuOpen(false); handleOpenSignup(); }} className="w-full rounded-xl h-12 font-bold">Sign Up</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={<header className="sticky top-0 z-50 h-20 w-full border-b border-border bg-background/80 backdrop-blur-xl" />}>
      <HeaderInner />
    </Suspense>
  )
}
