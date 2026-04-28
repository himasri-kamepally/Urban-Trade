'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, setShowAuthModal, setAuthModalView } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthModalView('login')
      setShowAuthModal(true)
    }
  }, [isAuthenticated, setShowAuthModal, setAuthModalView])

  // Still render the page but the modal will show on top
  // This allows users to see the page content while prompted to login
  return <>{children}</>
}
