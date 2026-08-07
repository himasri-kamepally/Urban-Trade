'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function PremiumNavbar() {
  const router = useRouter()
  const { isAuthenticated, setShowAuthModal, setAuthModalView, requireAuth } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleOpenLogin = () => {
    setAuthModalView('login')
    setShowAuthModal(true)
  }

  const handleOpenSignup = () => {
    setAuthModalView('signup')
    setShowAuthModal(true)
  }

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 mx-auto max-w-7xl px-6 py-4 transition-all duration-500 rounded-b-3xl",
        scrolled
          ? "glass-medium top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)]"
          : "glass-light top-0 w-full"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-foreground text-background flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
            U
          </div>
          <span className="font-bold text-lg hidden sm:block">UrbanTrade</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Browse
          </Link>
          <div className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Categories
          </div>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
          <button
            onClick={() => requireAuth(() => router.push('/sell'))}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sell
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={handleOpenLogin}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleOpenSignup}
                className="px-5 py-2.5 text-sm font-bold bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden mt-4 pt-4 border-t border-border space-y-3"
        >
          <Link href="/marketplace" className="block px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg">
            Browse
          </Link>
          <div className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg cursor-pointer">
            Categories
          </div>
          <Link href="#how-it-works" className="block px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg">
            How It Works
          </Link>
          <button
            onClick={() => {
              requireAuth(() => router.push('/sell'))
              setMobileOpen(false)
            }}
            className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg"
          >
            Sell
          </button>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleOpenLogin}
              className="flex-1 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary"
            >
              Login
            </button>
            <button
              onClick={handleOpenSignup}
              className="flex-1 px-4 py-2 text-sm font-bold bg-foreground text-background rounded-lg hover:bg-foreground/90"
            >
              Sign Up
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
