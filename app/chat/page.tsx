'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { AuthGuard } from '@/components/auth-guard'
import { conversations, messages as initialMessages, listings, formatPrice } from '@/lib/data'
import {
  Search,
  Send,
  DollarSign,
  ChevronLeft,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
} from 'lucide-react'

export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')

  const listing = listings.find((l) => l.title === activeConversation.listing)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    const message = {
      id: String(messages.length + 1),
      senderId: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages([...messages, message])
    setNewMessage('')
  }

  const handleSendOffer = () => {
    if (!offerAmount) return
    
    const message = {
      id: String(messages.length + 1),
      senderId: 'me',
      text: `I would like to make an offer of $${Number(offerAmount).toLocaleString()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOffer: true,
    }
    setMessages([...messages, message])
    setOfferAmount('')
    setShowOfferModal(false)
  }

  return (
    <AuthGuard>
      <div className="flex h-screen flex-col">
        <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`absolute inset-y-0 left-0 z-40 w-full border-r border-border bg-background transition-transform md:static md:w-80 md:translate-x-0 lg:w-96 ${
            showMobileChat ? '-translate-x-full' : 'translate-x-0'
          }`}
          style={{ top: '64px' }}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-border p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setActiveConversation(conversation)
                    setShowMobileChat(true)
                  }}
                  className={`flex w-full items-center gap-4 border-b border-border p-4 transition-colors hover:bg-card ${
                    activeConversation.id === conversation.id ? 'bg-card' : ''
                  }`}
                >
                  <div className="relative">
                    <Image
                      src={conversation.user.avatar}
                      alt={conversation.user.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    {conversation.user.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{conversation.user.name}</p>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {conversation.listing}
                    </p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                      {conversation.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>
        
        <main
          className={`absolute inset-y-0 right-0 z-40 w-full flex-1 flex-col bg-background transition-transform md:static md:flex md:translate-x-0 ${
            showMobileChat ? 'flex translate-x-0' : 'hidden translate-x-full md:flex'
          }`}
          style={{ top: '64px' }}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileChat(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-card md:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <Image
                src={activeConversation.user.avatar}
                alt={activeConversation.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium text-foreground">{activeConversation.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {activeConversation.user.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground sm:flex">
                <Phone className="h-5 w-5" />
              </button>
              <button className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground sm:flex">
                <Video className="h-5 w-5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {listing && (
            <Link
              href={`/product/${listing.id}`}
              className="flex items-center gap-4 border-b border-border bg-card/50 p-4 transition-colors hover:bg-card"
            >
              <Image
                src={listing.image}
                alt={listing.title}
                width={64}
                height={64}
                className="rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground">{listing.title}</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  ${listing.price.toLocaleString()}
                </p>
              </div>
            </Link>
          )}
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mx-auto max-w-2xl space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      message.senderId === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`mt-1 text-right text-xs ${
                        message.senderId === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-border p-4">
            <form onSubmit={handleSendMessage} className="mx-auto max-w-2xl">
              <div className="flex items-end gap-3">
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                  >
                    <DollarSign className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="h-12 w-full rounded-xl border border-border bg-card px-4 pr-12 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
      
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">Make an Offer</h2>
            {listing && (
              <p className="mt-2 text-sm text-muted-foreground">
                Listed price: {formatPrice(listing.price)}
              </p>
            )}
            <div className="mt-4">
              <label className="text-sm font-medium text-foreground">Your offer</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="h-12 w-full rounded-xl border border-border bg-background pl-8 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowOfferModal(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendOffer}
                disabled={!offerAmount}
                className="flex-1 rounded-xl"
              >
                Send Offer
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  )
}
