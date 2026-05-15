'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { getSavedListingIds, saveListing, unsaveListing } from '@/lib/api'

interface SavedContextType {
  savedIds: Set<string>
  toggleSaved: (id: string) => Promise<boolean>
  isSaved: (id: string) => boolean
}

const SavedContext = createContext<SavedContextType | undefined>(undefined)

export function SavedProvider({ children }: { children: ReactNode }) {
  const { user, requireAuth } = useAuth()
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (user?.id) {
      getSavedListingIds(user.id).then(ids => setSavedIds(new Set(ids)))
    } else {
      setSavedIds(new Set())
    }
  }, [user?.id])

  const toggleSaved = useCallback(async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      requireAuth(async () => {
        if (!user?.id) {
          resolve(false)
          return
        }

        const currentlySaved = savedIds.has(id)
        const newSavedState = !currentlySaved

        // Optimistic update
        setSavedIds(prev => {
          const next = new Set(prev)
          if (newSavedState) next.add(id)
          else next.delete(id)
          return next
        })

        try {
          if (newSavedState) {
            await saveListing(user.id, id)
          } else {
            await unsaveListing(user.id, id)
          }
          resolve(newSavedState)
        } catch (error) {
          console.error('Error toggling save:', error)
          // Rollback
          setSavedIds(prev => {
            const next = new Set(prev)
            if (currentlySaved) next.add(id)
            else next.delete(id)
            return next
          })
          resolve(currentlySaved)
        }
      })
    })
  }, [user?.id, requireAuth, savedIds])

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds])

  return (
    <SavedContext.Provider value={{ savedIds, toggleSaved, isSaved }}>
      {children}
    </SavedContext.Provider>
  )
}

export function useSavedListings() {
  const context = useContext(SavedContext)
  if (context === undefined) {
    throw new Error('useSavedListings must be used within a SavedProvider')
  }
  return context
}
