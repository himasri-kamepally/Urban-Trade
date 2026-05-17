'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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

import { DashboardSidebar } from '@/components/dashboard-sidebar'

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
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
    <>
      <DashboardSidebar activeTab={activeTab} />
      
      <main className="flex-1 max-w-4xl mx-auto space-y-12 pb-20 w-full px-4 overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-hide">
        <div className="mb-8 rounded-[2rem] border border-border bg-white shadow-xl shadow-black/[0.02] p-8 mt-4 flex items-start justify-between">
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
                <h1 className="text-3xl font-black text-foreground tracking-tight">{displayProfile.name}</h1>
                {displayProfile.verified && (
                  <BadgeCheck className="h-6 w-6 text-primary" />
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground font-medium">{displayProfile.email}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-bold">
                <div className="text-muted-foreground">
                  Member since {displayProfile.memberSince}
                </div>
              </div>
            </div>
            <Link href="/sell">
              <Button className="h-12 px-6 rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20 hidden sm:flex">
                <Plus className="h-5 w-5" />
                New Listing
              </Button>
            </Link>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/chat')}
            className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-black/[0.02] border border-border text-muted-foreground hover:text-primary transition-colors shrink-0"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="rounded-[2rem] border border-border bg-white shadow-xl shadow-black/[0.02] p-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'listings' && (
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight text-foreground">My Listings</h2>
                    <span className="text-sm font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">{myListings.length} items</span>
                  </div>
                  {myListings.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
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
                    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border py-20 bg-secondary/20">
                      <Package className="h-16 w-16 text-muted-foreground/50 mb-6" />
                      <p className="text-xl font-bold text-foreground">No listings yet</p>
                      <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">Start selling today and reach buyers in your neighborhood.</p>
                      <Link href="/sell">
                        <Button className="mt-6 rounded-xl h-12 px-8 font-bold">Create Listing</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'saved' && (
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Saved Items</h2>
                    <span className="text-sm font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">{savedListings.length} items</span>
                  </div>
                  {savedListings.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
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
                    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border py-20 bg-secondary/20">
                      <Heart className="h-16 w-16 text-muted-foreground/50 mb-6" />
                      <p className="text-xl font-bold text-foreground">No saved items yet</p>
                      <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">Browse the marketplace and save items you are interested in.</p>
                      <Link href="/marketplace">
                        <Button className="mt-6 rounded-xl h-12 px-8 font-bold">Browse Items</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight text-foreground">My Profile</h2>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border py-20 bg-secondary/20">
                    <User className="h-16 w-16 text-muted-foreground/50 mb-6" />
                    <p className="text-xl font-bold text-foreground">Profile Overview</p>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">View and edit your profile settings in the settings tab.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Profile Settings</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Update your personal information and preferences.</p>
                  </div>
                  <div className="space-y-8 max-w-2xl">
                    <div className="flex items-center gap-6 p-6 rounded-2xl bg-secondary/30 border border-border/50">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
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
                          className="h-12 px-6 rounded-xl font-bold gap-2"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingAvatar}
                        >
                          <Camera className="h-5 w-5" />
                          {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground">Recommended: Square image, max 2MB.</p>
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-14 w-full rounded-2xl border border-border bg-white px-4 text-foreground font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Email</label>
                        <input
                          type="email"
                          defaultValue={displayProfile.email}
                          className="h-14 w-full rounded-2xl border border-border bg-secondary/50 px-4 text-muted-foreground font-medium focus:outline-none cursor-not-allowed"
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91"
                          className="h-14 w-full rounded-2xl border border-border bg-white px-4 text-foreground font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="h-14 w-full rounded-2xl border border-border bg-white px-4 text-foreground font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-border">
                      <Button 
                        className="h-14 px-10 rounded-2xl font-bold shadow-lg shadow-primary/20"
                        onClick={handleUpdateProfile}
                        disabled={updating}
                      >
                        {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-white selection:bg-primary/20">
        <div className="relative z-10 mx-auto max-w-[1800px] flex gap-8 p-4 lg:p-8">
          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <DashboardContent />
          </Suspense>
        </div>
      </div>
    </AuthGuard>
  )
}



