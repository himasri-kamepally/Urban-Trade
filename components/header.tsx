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
import { Search, Menu, X, Bell, MessageSquare, Plus, User, LogOut, LayoutDashboard, ChevronDown, Settings } from 'lucide-react'
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
          ? "h-14 border-border/50 bg-background/90 backdrop-blur-xl shadow-lg shadow-black/5" 
          : "h-16 border-border bg-background/80 backdrop-blur-xl"
      )}
    >
      <div className={cn(
        "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 lg:px-8",
        scrolled ? "h-14" : "h-16"
      )}>
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">U</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">UrbanTrade</span>
          </Link>
          
          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/marketplace" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Browse
            </Link>
          </nav>
        </div>

        <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items..."
              className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => handleProtectedAction('/chat')}
              >
                <MessageSquare className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                    {unreadMessages}
                  </span>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => handleProtectedAction('/dashboard?tab=notifications')}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                    {unreadNotifs}
                  </span>
                )}
              </Button>
              <Button 
                className="ml-2 gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleProtectedAction('/sell')}
              >
                <Plus className="h-4 w-4" />
                Sell
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-2 flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-card">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border">
                      <Image
                        src={user?.avatar || ''}
                        alt={user?.name || 'User'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border-border bg-card">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard')}
                    className="cursor-pointer gap-2 rounded-lg focus:bg-secondary"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/chat')}
                    className="cursor-pointer gap-2 rounded-lg focus:bg-secondary"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard?tab=settings')}
                    className="cursor-pointer gap-2 rounded-lg focus:bg-secondary"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer gap-2 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleOpenLogin}
                className="rounded-xl text-sm font-medium text-foreground hover:bg-card"
              >
                Login
              </Button>
              <Button
                onClick={handleOpenSignup}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>


        <button
          className="flex items-center justify-center lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="space-y-1 px-4 py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search items..."
                className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            
            {isAuthenticated ? (
              <>
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-card p-3">
                  <Image
                    src={user?.avatar || ''}
                    alt={user?.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link
                  href="/marketplace"
                  className="block rounded-lg px-3 py-2 text-base text-foreground hover:bg-card"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleProtectedAction('/sell')
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-base text-foreground hover:bg-card"
                >
                  Sell
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleProtectedAction('/chat')
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-base text-foreground hover:bg-card"
                >
                  Messages
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleProtectedAction('/dashboard')
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-base text-foreground hover:bg-card"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-base text-destructive hover:bg-card"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/marketplace"
                  className="block rounded-lg px-3 py-2 text-base text-foreground hover:bg-card"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleProtectedAction('/sell')
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-base text-foreground hover:bg-card"
                >
                  Sell
                </button>
                <div className="mt-4 flex gap-3 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleOpenLogin()
                    }}
                    className="flex-1 rounded-xl border-border"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleOpenSignup()
                    }}
                    className="flex-1 rounded-xl"
                  >
                    Sign Up
                  </Button>
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
    <Suspense fallback={<header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-background/80 backdrop-blur-xl" />}>
      <HeaderInner />
    </Suspense>
  )
}
