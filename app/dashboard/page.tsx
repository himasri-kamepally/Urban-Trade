'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingCard } from '@/components/listing-card'
import { Button } from '@/components/ui/button'
import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/contexts/auth-context'
import { listings, userProfile, notifications } from '@/lib/data'
import {
  Package,
  Heart,
  MessageSquare,
  Bell,
  Settings,
  BadgeCheck,
  Star,
  Plus,
  ChevronRight,
} from 'lucide-react'

const tabs = [
  { id: 'listings', label: 'My Listings', icon: Package },
  { id: 'saved', label: 'Saved Items', icon: Heart },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('listings')
  const { user } = useAuth()

  const myListings = listings.slice(0, 4)
  const savedListings = listings.filter((l) => l.saved)

  // Use actual logged-in user data if available, otherwise fallback to dummy data
  const displayProfile = user ? {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    verified: true,
    rating: userProfile.rating,
    totalSales: userProfile.totalSales,
    memberSince: userProfile.memberSince,
  } : userProfile

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <div className="mb-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <Image
                src={displayProfile.avatar}
                alt={displayProfile.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-foreground">{displayProfile.name}</h1>
                  {displayProfile.verified && (
                    <BadgeCheck className="h-5 w-5 text-accent" />
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{displayProfile.email}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-medium text-foreground">{displayProfile.rating}</span>
                    <span className="text-muted-foreground">rating</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium text-foreground">{displayProfile.totalSales}</span> sales
                  </div>
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
                  const hasNotification = tab.id === 'notifications' && notifications.some((n) => !n.read)
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
                      {hasNotification && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-accent" />
                      )}
                    </button>
                  )
                })}
              </nav>
            </aside>
            
            <div className="flex-1">
              <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'bg-secondary text-foreground'
                          : 'bg-card text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
              
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
                          image={listing.image}
                          location={listing.location}
                          condition={listing.condition}
                          posted={listing.posted}
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
                    <h2 className="text-lg font-semibold text-foreground">Saved Items</h2>
                    <span className="text-sm text-muted-foreground">{savedListings.length} items</span>
                  </div>
                  {savedListings.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {savedListings.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          id={listing.id}
                          title={listing.title}
                          price={listing.price}
                          image={listing.image}
                          location={listing.location}
                          condition={listing.condition}
                          posted={listing.posted}
                          saved={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
                      <Heart className="h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-foreground">No saved items</p>
                      <p className="mt-1 text-sm text-muted-foreground">Save items to view them later</p>
                      <Link href="/marketplace">
                        <Button variant="outline" className="mt-4 rounded-xl">
                          Browse Marketplace
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'messages' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Messages</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Chen', message: 'Is the price negotiable?', time: '2 min ago', unread: true },
                      { name: 'Mike Johnson', message: 'I can pick it up tomorrow', time: '1 hour ago', unread: false },
                      { name: 'Emma Wilson', message: 'Does it come with warranty?', time: '3 hours ago', unread: false },
                    ].map((chat, index) => (
                      <Link
                        key={index}
                        href="/chat"
                        className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
                      >
                        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-secondary">
                          <Image
                            src={`https://images.unsplash.com/photo-${1494790108377 + index}-be9c29b29330?w=100&q=80`}
                            alt={chat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground">{chat.name}</p>
                            <span className="text-xs text-muted-foreground">{chat.time}</span>
                          </div>
                          <p className="mt-1 truncate text-sm text-muted-foreground">{chat.message}</p>
                        </div>
                        {chat.unread && <span className="h-2 w-2 rounded-full bg-accent" />}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                    <button className="text-sm text-accent hover:text-foreground">
                      Mark all as read
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 rounded-xl border border-border p-4 ${
                          !notification.read ? 'bg-secondary/50' : 'bg-card'
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                          {notification.type === 'message' && <MessageSquare className="h-5 w-5 text-foreground" />}
                          {notification.type === 'offer' && <Package className="h-5 w-5 text-foreground" />}
                          {notification.type === 'sale' && (
                            <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {notification.type === 'review' && <Star className="h-5 w-5 text-accent" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{notification.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Update your profile information
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Image
                        src={displayProfile.avatar}
                        alt={displayProfile.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                      <Button variant="outline" className="rounded-xl">
                        Change Photo
                      </Button>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <input
                          type="text"
                          defaultValue={displayProfile.name}
                          className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-4 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <input
                          type="email"
                          defaultValue={displayProfile.email}
                          className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-4 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">Location</label>
                        <input
                          type="text"
                          defaultValue="San Francisco, CA"
                          className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-4 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="rounded-xl">Save Changes</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      </div>
    </AuthGuard>
  )
}
