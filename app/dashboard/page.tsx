'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/contexts/auth-context'
import { getUserListings, getUserProfile, deleteListing, updateProfile, getNotifications, getSavedListings } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import {
  Package,
  Heart,
  MessageSquare,
  Bell,
  Settings,
  BadgeCheck,
  Plus,
  Loader2,
  Camera,
} from 'lucide-react'

const tabs = [
  { id: 'listings', label: 'My Listings', icon: Package },
  { id: 'saved', label: 'Saved Items', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function DashboardContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'listings'
  
  const [activeTab, setActiveTab] = useState(initialTab)
  const { user } = useAuth()
  const [myListings, setMyListings] = useState<any[]>([])
  const [savedListings, setSavedListings] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const fetchDashboardData = async () => {
    if (!user?.id) return
    
    setLoading(true)
    try {
      const [listingsData, savedData, profile, notifs] = await Promise.all([
        getUserListings(user.id),
        getSavedListings(user.id),
        getUserProfile(user.id),
        getNotifications(user.id)
      ])
      setMyListings(listingsData)
      setSavedListings(savedData)
      setProfileData(profile)
      setNotifications(notifs)
      setFullName(profile?.full_name || user?.name || '')
      setCity(profile?.city || 'Hyderabad, TS')
      setPhone(profile?.phone || '')
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user?.id])

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to remove this listing?')) return
    
    try {
      await deleteListing(listingId)
      setMyListings(prev => prev.filter(l => l.id !== listingId))
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Failed to delete listing.')
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return

    setUploadingAvatar(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images') 
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath)

      await updateProfile(user.id, { avatar_url: publicUrl })
      setProfileData({ ...profileData, avatar_url: publicUrl })
      alert('Profile picture updated!')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload profile picture.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user?.id) return
    setUpdating(true)
    try {
      await updateProfile(user.id, {
        full_name: fullName,
        city: city,
        phone: phone
      })
      setProfileData({ ...profileData, full_name: fullName, city: city, phone: phone })
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile.')
    } finally {
      setUpdating(false)
    }
  }

  const displayProfile = {
    name: profileData?.full_name || user?.name || 'User',
    email: profileData?.email || user?.email || '',
    avatar: profileData?.avatar_url || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`,
    verified: true,
    memberSince: profileData?.created_at ? new Date(profileData.created_at).getFullYear().toString() : '2026',
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border">
            <Image
              src={displayProfile.avatar}
              alt={displayProfile.name}
              fill
              className="object-cover"
              unoptimized
            />
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">{displayProfile.name}</h1>
              {displayProfile.verified && (
                <BadgeCheck className="h-5 w-5 text-accent" />
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{displayProfile.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <div className="text-muted-foreground">
                Member since {displayProfile.memberSince}
              </div>
            </div>
          </div>
          <Link href="/sell">
            <Button className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              New Listing
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-card hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </aside>
        
        <div className="flex-1">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'listings' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">My Listings</h2>
                    <span className="text-sm text-muted-foreground">{myListings.length} items</span>
                  </div>
                  {myListings.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {myListings.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          id={listing.id}
                          title={listing.title}
                          price={listing.price}
                          image={listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
                          location={listing.city}
                          condition={listing.condition}
                          posted={new Date(listing.created_at).toLocaleDateString()}
                          onDelete={() => handleDeleteListing(listing.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
                      <Package className="h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-foreground">No listings yet</p>
                      <p className="mt-1 text-sm text-muted-foreground">Start selling today!</p>
                      <Link href="/sell">
                        <Button className="mt-4 rounded-xl">Create Listing</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'saved' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Saved Items</h2>
                    <p className="text-sm text-muted-foreground">{savedListings.length} items</p>
                  </div>
                  {savedListings.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {savedListings.map((listing) => (
                        <ListingCard 
                          key={listing.id} 
                          {...listing} 
                          image={listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
                          posted={new Date(listing.created_at).toLocaleDateString()}
                          saved={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
                      <Heart className="h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-foreground">No saved items yet</p>
                      <p className="mt-1 text-sm text-muted-foreground">Browse and save items to see them here</p>
                      <Link href="/marketplace">
                        <Button className="mt-4 rounded-xl">Browse Items</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
                  </div>
                  {notifications.length > 0 ? (
                    <div className="space-y-4">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-accent/30">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                            <Bell className="h-5 w-5 text-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-foreground">{notif.title}</p>
                              <span className="text-[10px] text-muted-foreground">{new Date(notif.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{notif.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
                      <Bell className="h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-foreground">No notifications yet</p>
                    </div>
                  )}
                </div>
              )}
              

              
              {activeTab === 'settings' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Update your information</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-border bg-secondary">
                        <Image
                          src={displayProfile.avatar}
                          alt={displayProfile.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleAvatarUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          className="gap-2 rounded-xl"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingAvatar}
                        >
                          <Camera className="h-4 w-4" />
                          {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-4 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <input
                          type="email"
                          defaultValue={displayProfile.email}
                          className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-4 text-muted-foreground focus:outline-none"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Phone Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter phone number"
                          className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-4 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Location (City)</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-4 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        className="rounded-xl px-8"
                        onClick={handleUpdateProfile}
                        disabled={updating}
                      >
                        {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}


export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <DashboardContent />
          </Suspense>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}



