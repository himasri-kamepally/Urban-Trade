'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/contexts/auth-context'
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  Search,
  Send,
  DollarSign,
  ChevronLeft,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react'

export default function ChatPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [conversations, setConversations] = useState<any[]>([])
  const [activeChat, setActiveChat] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversations = useCallback(async () => {
    if (!user?.id) return
    try {
      const data = await getConversations(user.id)
      setConversations(data)
      
      const chatId = searchParams.get('id')
      if (chatId) {
        const active = data.find((c: any) => c.id === chatId)
        if (active) {
          setActiveChat(active)
          setShowMobileChat(true)
        }
      } else if (data.length > 0 && !activeChat) {
        // Don't auto-select on mobile to show list
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, searchParams, activeChat])

  useEffect(() => {
    if (!user?.id) return
    fetchConversations()

    // Real-time updates to chats list when any message is added or updated
    const channel = supabase.channel('chat-list-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchConversations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, fetchConversations])

  useEffect(() => {
    async function fetchChatMessages() {
      if (!activeChat?.id) return
      setMessagesLoading(true)
      try {
        const data = await getMessages(activeChat.id)
        setMessages(data)
        
        // Mark messages as read when viewing
        if (user?.id) {
          await markMessagesAsRead(activeChat.id, user.id)
          // Optimistically clear the unread count in the conversations list immediately
          setConversations(prev => prev.map(c => c.id === activeChat.id ? { ...c, unread_count: 0 } : c))
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setMessagesLoading(false)
      }
    }
    
    fetchChatMessages()

    // Enable Realtime for instant messages
    if (!activeChat?.id) return

    const channel = supabase
      .channel(`chat:${activeChat.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${activeChat.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Avoid duplicates if we already have it from a refresh
            if (prev.find(m => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
          
          // Mark message as read instantly if we are actively viewing this chat
          if (payload.new.sender_id !== user?.id && user?.id) {
            markMessagesAsRead(activeChat.id, user.id).catch(err => 
              console.error('Error marking real-time message as read:', err)
            )
            // Keep the selected chat unread count at 0 optimistically
            setConversations(prev => prev.map(c => c.id === activeChat.id ? { ...c, unread_count: 0 } : c))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeChat?.id, user?.id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChat?.id || !user?.id) return
    
    const content = newMessage
    setNewMessage('')
    
    try {
      const sent = await sendMessage(activeChat.id, user.id, content)
      setMessages(prev => [...prev, sent])
    } catch (error: any) {
      console.error('Error sending message:', error)
      alert(`Failed to send message: ${error.message || 'Unknown error'}`)
    }
  }

  const handleSendOffer = async () => {
    if (!offerAmount || !activeChat?.id || !user?.id) return
    
    const content = `Offer: ₹${Number(offerAmount).toLocaleString()}`
    setShowOfferModal(false)
    setOfferAmount('')
    
    try {
      const sent = await sendMessage(activeChat.id, user.id, content)
      setMessages(prev => [...prev, sent])
    } catch (error) {
      console.error('Error sending offer:', error)
      alert('Failed to send offer.')
    }
  }

  const getOtherUser = (chat: any) => {
    return chat.buyer_id === user?.id ? chat.seller : chat.buyer
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
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
            <div className="border-b border-border p-4 space-y-4">
              <button 
                onClick={() => router.push('/marketplace')}
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.length > 0 ? (
                conversations.map((chat) => {
                  const otherUser = getOtherUser(chat)
                  return (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setActiveChat(chat)
                        setShowMobileChat(true)
                        router.push(`/chat?id=${chat.id}`, { scroll: false })
                      }}
                      className={`flex w-full items-center gap-4 border-b border-border p-4 transition-colors hover:bg-card ${
                        activeChat?.id === chat.id ? 'bg-card' : ''
                      }`}
                    >
                      <div className="relative h-12 w-12 shrink-0">
                        <Image
                          src={otherUser?.avatar_url || `https://ui-avatars.com/api/?name=${otherUser?.full_name || 'User'}&background=random`}
                          alt={otherUser?.full_name || 'User'}
                          fill
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate">{otherUser?.full_name || 'User'}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(chat.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {chat.listing?.title}
                        </p>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {chat.last_message?.content || 'No messages yet'}
                        </p>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground">No conversations yet.</p>
                </div>
              )}
            </div>
          </div>
        </aside>
        
        <main
          className={`absolute inset-y-0 right-0 z-40 w-full flex-1 flex-col bg-background transition-transform md:static md:flex md:translate-x-0 ${
            showMobileChat ? 'flex translate-x-0' : 'hidden translate-x-full md:flex'
          }`}
          style={{ top: '64px' }}
        >
          {activeChat ? (
            <>
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-card md:hidden"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="relative h-10 w-10">
                    <Image
                      src={getOtherUser(activeChat)?.avatar_url || `https://ui-avatars.com/api/?name=${getOtherUser(activeChat)?.full_name || 'User'}&background=random`}
                      alt={getOtherUser(activeChat)?.full_name || 'User'}
                      fill
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{getOtherUser(activeChat)?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {activeChat.listing && (
                <Link
                  href={`/product/${activeChat.listing.id}`}
                  className="flex items-center gap-4 border-b border-border bg-card/50 p-4 transition-colors hover:bg-card"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={activeChat.listing.listing_images?.[0]?.image_url || '/placeholder.svg'}
                      alt={activeChat.listing.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-foreground">{activeChat.listing.title}</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {formatPrice(activeChat.listing.price)}
                    </p>
                  </div>
                </Link>
              )}
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto max-w-2xl space-y-4">
                  {messagesLoading && messages.length === 0 ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      {messages.map((msg: any) => {
                        const isMe = msg.sender_id === user?.id
                        return (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex w-full flex-col",
                              isMe ? "items-end" : "items-start"
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                isMe 
                                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                                  : "bg-card border border-border text-foreground rounded-tl-none"
                              )}
                            >
                              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                              <div className={cn(
                                "mt-1 flex items-center gap-2 text-[10px]",
                                isMe ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"
                              )}>
                                <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {isMe && (
                                  <span className="font-medium">
                                    {msg.read ? 'Read' : 'Delivered'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-border p-4">
                <form onSubmit={handleSendMessage} className="mx-auto max-w-2xl">
                  <div className="flex items-end gap-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (user?.id === activeChat?.listing?.seller_id) {
                            alert("Sorry, you are the seller of this item. Only buyers can make offers.")
                          } else {
                            setShowOfferModal(true)
                          }
                        }}
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
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-secondary p-6">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-foreground">Your Messages</h2>
              <p className="mt-2 text-muted-foreground max-w-xs">
                Select a conversation to start chatting with buyers and sellers.
              </p>
            </div>
          )}
        </main>
      </div>
      
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">Make an Offer</h2>
            {activeChat?.listing && (
              <p className="mt-2 text-sm text-muted-foreground">
                Listed price: {formatPrice(activeChat.listing.price)}
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
