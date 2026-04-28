'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
  authModalView: 'login' | 'signup'
  setAuthModalView: (view: 'login' | 'signup') => void
  requireAuth: (callback?: () => void) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login')
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null)

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    // Set dummy user data
    setUser({
      id: '1',
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    })
    
    setShowAuthModal(false)
    
    // Execute pending callback if exists
    if (pendingCallback) {
      pendingCallback()
      setPendingCallback(null)
    }
  }, [pendingCallback])

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    setUser({
      id: '1',
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    })
    
    setShowAuthModal(false)
    
    if (pendingCallback) {
      pendingCallback()
      setPendingCallback(null)
    }
  }, [pendingCallback])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const requireAuth = useCallback((callback?: () => void) => {
    if (user) {
      if (callback) callback()
      return true
    }
    
    if (callback) {
      setPendingCallback(() => callback)
    }
    setAuthModalView('login')
    setShowAuthModal(true)
    return false
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        showAuthModal,
        setShowAuthModal,
        authModalView,
        setAuthModalView,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
