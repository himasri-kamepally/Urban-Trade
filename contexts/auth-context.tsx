'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

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
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
  authModalView: 'login' | 'signup'
  setAuthModalView: (view: 'login' | 'signup') => void
  requireAuth: (callback?: () => void) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login')
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null)
  const router = useRouter()

  const mapSupabaseUser = (sbUser: SupabaseUser): User => ({
    id: sbUser.id,
    name: sbUser.user_metadata.full_name || sbUser.user_metadata.name || sbUser.email?.split('@')[0] || 'User',
    email: sbUser.email || '',
    avatar: sbUser.user_metadata.avatar_url || sbUser.user_metadata.picture || `https://ui-avatars.com/api/?name=${sbUser.email}&background=random`,
  })

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null)
      setLoading(false)
    }).catch((err) => {
      console.warn('Supabase getSession failed (project may be paused):', err?.message)
      setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    let subscription: { unsubscribe: () => void } | null = null
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ? mapSupabaseUser(session.user) : null)
        setLoading(false)
      })
      subscription = data.subscription
    } catch (err: any) {
      console.warn('Supabase onAuthStateChange failed:', err?.message)
      setLoading(false)
    }

    return () => subscription?.unsubscribe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    
    setShowAuthModal(false)
    
    if (pendingCallback) {
      pendingCallback()
      setPendingCallback(null)
    }
  }, [pendingCallback])

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) throw error
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) throw error
    
    setShowAuthModal(false)
    
    if (pendingCallback) {
      pendingCallback()
      setPendingCallback(null)
    }
  }, [pendingCallback])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }, [router])

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
        loginWithGoogle,
        logout,
        showAuthModal,
        setShowAuthModal,
        authModalView,
        setAuthModalView,
        requireAuth,
      }}
    >
      {!loading && children}
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
