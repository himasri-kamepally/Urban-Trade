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
            const count = chat.messages?.filter((m: any) => m.sender_id !== user.id && m.read !== true).length || 0
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

  const isLanding = pathname === '/'

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isLanding 
          ? scrolled
            ? "h-16 border-b bg-[#07110F]/50 backdrop-blur-2xl shadow-xl border-[#49D17D]/10"
            : "h-20 border-b border-transparent bg-transparent"
          : scrolled 
            ? "h-16 border-b border-border/50 bg-background/90 backdrop-blur-xl shadow-md" 
            : "h-20 border-b border-border bg-background/80 backdrop-blur-xl"
      )}
    >
      {/* Premium glow line on landing */}
      {isLanding && scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#49D17D]/50 to-transparent" />
      )}

      <div className={cn(
        "mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 transition-all duration-300 lg:px-8",
        scrolled ? "h-16" : "h-20"
      )}>
        {/* Left Side: Logo */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl font-black text-white shadow-sm transition-all duration-300 group-hover:scale-110 group-active:scale-95",
              isLanding 
                ? "bg-gradient-to-br from-[#49D17D] to-[#5BFF9D] text-[#07110F] shadow-[#49D17D]/30 group-hover:shadow-[#49D17D]/50" 
                : "bg-primary text-white shadow-primary/20"
            )}>
              <span className="text-xl font-bold">U</span>
            </div>
            <span className={cn(
              "text-xl font-black tracking-tight hidden md:block transition-all duration-300",
              isLanding ? "font-clash text-[#F5F7F6]" : "text-foreground"
            )}>
              UrbanTrade
            </span>
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition-all duration-300 hover:scale-105 active:scale-95",
                    isLanding ? "hover:bg-white/10" : "hover:bg-secondary"
                  )}>
                    <div className={cn("relative h-8 w-8 overflow-hidden rounded-full border-2", isLanding ? "border-[#49D17D]/30" : "border-border")}>
                      <Image
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                        alt={user?.name || 'User'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isLanding ? "text-[#9BA7A3]" : "text-muted-foreground")} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={cn(
                  "w-56 rounded-2xl shadow-xl backdrop-blur-xl border",
                  isLanding ? "border-[#49D17D]/20 bg-[#0D1B18]/80 text-[#F5F7F6]" : "border-border bg-card/80"
                )}>
                  <div className="px-4 py-3">
                    <p className={cn("text-sm font-bold", isLanding ? "text-[#F5F7F6]" : "text-foreground")}>{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className={isLanding ? "bg-white/10" : "bg-border"} />
                  <DropdownMenuItem 
                    onClick={() => router.push('/dashboard?tab=settings')} 
                    className={cn("cursor-pointer gap-2 py-2.5 rounded-lg transition-all", isLanding ? "hover:bg-[#49D17D]/10 focus:bg-[#49D17D]/10" : "hover:bg-secondary focus:bg-secondary")}
                  >
                    <Settings className="h-4 w-4" /> Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={logout} 
                    className={cn("cursor-pointer gap-2 py-2.5 rounded-lg transition-all text-destructive", isLanding ? "hover:bg-red-500/10 focus:bg-red-500/10" : "hover:bg-destructive/10 focus:bg-destructive/10")}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button 
                className={cn(
                  "rounded-full px-6 h-11 font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border-none cursor-pointer",
                  isLanding 
                    ? "bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] text-[#07110F] shadow-[#49D17D]/40 hover:shadow-[#49D17D]/60" 
                    : "bg-primary text-white hover:bg-primary/90"
                )}
                onClick={() => handleProtectedAction('/sell')}
              >
                Start Selling
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleOpenLogin}
                className={cn(
                  "text-sm font-bold transition-all duration-300 px-4 py-2.5 rounded-lg hover:scale-105 active:scale-95",
                  isLanding ? "text-[#9BA7A3] hover:text-[#F5F7F6] hover:bg-white/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                Login
              </button>
              <button
                onClick={handleOpenSignup}
                className={cn(
                  "rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 px-6 h-11 text-sm border-none cursor-pointer",
                  isLanding 
                    ? "bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] text-[#07110F] shadow-[#49D17D]/40 hover:shadow-[#49D17D]/60" 
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <button
          className={cn(
            "flex items-center justify-center lg:hidden rounded-lg p-2 transition-all duration-300 hover:scale-105 active:scale-95",
            isLanding ? "bg-white/5 text-[#F5F7F6] hover:bg-white/10" : "bg-secondary text-foreground hover:bg-secondary/80"
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Search Bar (Only visible when not scrolled or explicitly searching) */}
      {!isLanding && (
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
      )}

      {mobileMenuOpen && (
        <div className={cn(
          "absolute w-full shadow-lg border-b lg:hidden z-50 backdrop-blur-2xl transition-all duration-300",
          isLanding ? "bg-[#07110F]/95 border-[#49D17D]/10" : "bg-background/95 border-border"
        )}>
          <div className="space-y-1 px-4 py-4 max-h-[80vh] overflow-y-auto">
            {isAuthenticated ? (
              <>
                <div className={cn("mb-4 flex items-center gap-3 rounded-2xl p-4 transition-all", isLanding ? "bg-white/5 border border-[#49D17D]/10" : "bg-secondary border border-border")}>
                  <div className={cn("relative h-12 w-12 rounded-full overflow-hidden border-2", isLanding ? "border-[#49D17D]/30" : "border-primary/20")}>
                    <Image src={user?.avatar || ''} alt={user?.name || 'User'} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className={cn("font-bold", isLanding ? "text-[#F5F7F6]" : "text-foreground")}>{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link href="/marketplace" className={cn("flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200 hover:scale-105 active:scale-95", isLanding ? "text-[#F5F7F6] hover:bg-white/5" : "text-foreground hover:bg-secondary")} onClick={() => setMobileMenuOpen(false)}>
                  <SearchCheck className="h-5 w-5" /> Browse
                </Link>
                <button onClick={() => { setMobileMenuOpen(false); handleProtectedAction('/sell'); }} className={cn("flex items-center gap-3 w-full rounded-xl px-4 py-3.5 text-left text-base font-medium transition-all duration-200 hover:scale-95 active:scale-90", isLanding ? "text-[#F5F7F6] hover:bg-[#49D17D]/10" : "text-foreground hover:bg-secondary")}>
                  <Plus className="h-5 w-5" /> Sell an Item
                </button>
                <button onClick={() => { setMobileMenuOpen(false); handleProtectedAction('/dashboard?tab=saved'); }} className={cn("flex items-center gap-3 w-full rounded-xl px-4 py-3.5 text-left text-base font-medium transition-all duration-200 hover:scale-95 active:scale-90", isLanding ? "text-[#F5F7F6] hover:bg-white/5" : "text-foreground hover:bg-secondary")}>
                  <Heart className="h-5 w-5 text-destructive" /> Saved
                </button>
                <button onClick={() => { setMobileMenuOpen(false); handleProtectedAction('/chat'); }} className={cn("flex items-center gap-3 w-full rounded-xl px-4 py-3.5 text-left text-base font-medium transition-all duration-200 hover:scale-95 active:scale-90", isLanding ? "text-[#F5F7F6] hover:bg-white/5" : "text-foreground hover:bg-secondary")}>
                  <MessageSquare className="h-5 w-5 text-blue-500" /> Messages
                </button>
                <button onClick={() => { setMobileMenuOpen(false); handleProtectedAction('/dashboard'); }} className={cn("flex items-center gap-3 w-full rounded-xl px-4 py-3.5 text-left text-base font-medium transition-all duration-200 hover:scale-95 active:scale-90", isLanding ? "text-[#F5F7F6] hover:bg-white/5" : "text-foreground hover:bg-secondary")}>
                  <LayoutDashboard className="h-5 w-5" /> Dashboard
                </button>
                <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="flex items-center gap-3 w-full rounded-xl px-4 py-3.5 mt-4 text-left text-base font-bold text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-95 active:scale-90">
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/marketplace" className={cn("block rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200 hover:scale-95 active:scale-90", isLanding ? "text-[#F5F7F6] hover:bg-white/5" : "text-foreground hover:bg-secondary")} onClick={() => setMobileMenuOpen(false)}>Browse Marketplace</Link>
                <div className={cn("mt-4 flex flex-col gap-3 pt-4 border-t", isLanding ? "border-white/10" : "border-border")}>
                  <button onClick={() => { setMobileMenuOpen(false); handleOpenLogin(); }} className={cn("w-full rounded-xl h-12 font-bold border transition-all duration-300 hover:scale-105 active:scale-95", isLanding ? "border-[#49D17D]/30 text-[#F5F7F6] hover:bg-white/5" : "border-border hover:bg-secondary")}>Login</button>
                  <button onClick={() => { setMobileMenuOpen(false); handleOpenSignup(); }} className={cn("w-full rounded-xl h-12 font-bold border-none transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg", isLanding ? "bg-gradient-to-r from-[#49D17D] to-[#5BFF9D] text-[#07110F] shadow-[#49D17D]/40" : "bg-primary text-white")}>Sign Up</button>
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
