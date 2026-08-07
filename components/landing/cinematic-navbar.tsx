'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function CinematicNavbar() {
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "backdrop-blur-lg bg-background/80" : "backdrop-blur-md bg-background/40"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-black text-sm">
            U
          </div>
          <span className="font-semibold text-sm hidden sm:block">UrbanTrade</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12">
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Browse
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Safety
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm font-medium hover:text-foreground transition-colors"
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
                className="px-4 py-2 text-sm font-semibold bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-foreground/10 rounded-lg transition-all"
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
          className="md:hidden px-6 py-4 border-t border-border space-y-3"
        >
          <Link href="#" className="block px-4 py-2 text-sm font-medium hover:bg-foreground/5 rounded-lg">
            Browse
          </Link>
          <Link href="#how-it-works" className="block px-4 py-2 text-sm font-medium hover:bg-foreground/5 rounded-lg">
            How It Works
          </Link>
          <Link href="#" className="block px-4 py-2 text-sm font-medium hover:bg-foreground/5 rounded-lg">
            Safety
          </Link>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleOpenLogin}
              className="flex-1 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-foreground/5"
            >
              Login
            </button>
            <button
              onClick={handleOpenSignup}
              className="flex-1 px-4 py-2 text-sm font-semibold bg-foreground text-background rounded-lg hover:bg-foreground/90"
            >
              Sign Up
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
