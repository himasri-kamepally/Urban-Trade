import { supabase } from './supabase'

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data
}

export async function getListings(options: { 
  category?: string, 
  search?: string, 
  condition?: string,
  minPrice?: number,
  maxPrice?: number,
  sortBy?: string,
  limit?: number 
} = {}) {
  let query = supabase
    .from('listings')
    .select('*, listing_images(*)')

  if (options.category && options.category !== 'all') {
    query = query.eq('category_id', options.category)
  }

  if (options.search) {
    query = query.ilike('title', `%${options.search}%`)
  }

  if (options.condition && options.condition !== 'All') {
    query = query.eq('condition', options.condition)
  }

  if (options.minPrice) {
    query = query.gte('price', options.minPrice)
  }

  if (options.maxPrice) {
    query = query.lte('price', options.maxPrice)
  }

  if (options.sortBy) {
    switch (options.sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true })
        break
      case 'price-high':
        query = query.order('price', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }
  } else {
    query = query.order('created_at', { ascending: false })
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  
  if (error) throw error
  return data
}


export async function getListingById(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:seller_id(*)')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createListing(listingData: any) {
  const { data, error } = await supabase
    .from('listings')
    .insert([listingData])
    .select()
  
  if (error) throw error
  return data
}

export async function getUserListings(userId: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_images(*)')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function deleteListing(listingId: string) {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
  
  if (error) throw error
}

export async function updateProfile(userId: string, profileData: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      buyer:buyer_id(*),
      seller:seller_id(*),
      listing:listing_id(*, listing_images(*)),
      messages(content, created_at, sender_id, read)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  // Add a simple last_message helper
  return data.map((chat: any) => ({
    ...chat,
    last_message: chat.messages?.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0],
    unread_count: chat.messages?.filter((m: any) => m.sender_id !== userId && !m.read).length
  }))
}

export async function markMessagesAsRead(chatId: string, userId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('chat_id', chatId)
    .neq('sender_id', userId)
    .eq('read', false)
  
  if (error) {
    console.error('Error marking messages as read:', error)
    throw error
  }
}

export async function getUnreadMessageCount(userId: string) {
  // Simplification: count chats with messages not from user
  const conversations = await getConversations(userId)
  return conversations.length // For now just return number of conversations
}

export async function getUnreadNotificationCount(userId: string) {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)
  
  if (error) throw error
  return count || 0
}

export async function saveListing(userId: string, listingId: string) {
  const { error } = await supabase
    .from('saved_listings')
    .insert([{ user_id: userId, listing_id: listingId }])
  
  if (error) throw error
}

export async function unsaveListing(userId: string, listingId: string) {
  const { error } = await supabase
    .from('saved_listings')
    .delete()
    .eq('user_id', userId)
    .eq('listing_id', listingId)
  
  if (error) throw error
}

export async function getSavedListings(userId: string) {
  const { data, error } = await supabase
    .from('saved_listings')
    .select(`
      listing:listing_id(*, listing_images(*), profiles(*))
    `)
    .eq('user_id', userId)
  
  if (error) throw error
  return data.map((item: any) => item.listing)
}

export async function getMessages(chatId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export async function sendMessage(chatId: string, senderId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ chat_id: chatId, sender_id: senderId, content }])
    .select()
  
  if (error) {
    console.error('Supabase error sending message:', error)
    throw error
  }
  
  if (!data || data.length === 0) {
    throw new Error('Message was sent but could not be retrieved. Check your RLS select policies.')
  }
  
  return data[0]
}

export async function getOrCreateChat(buyerId: string, sellerId: string, listingId: string) {
  // Try to find existing chat
  const { data: existingChat, error: findError } = await supabase
    .from('chats')
    .select('*')
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .eq('listing_id', listingId)
    .maybeSingle()
  
  if (findError) throw findError
  if (existingChat) return existingChat

  // Create new chat
  const { data: newChat, error: createError } = await supabase
    .from('chats')
    .insert([{ buyer_id: buyerId, seller_id: sellerId, listing_id: listingId }])
    .select()
    .single()
  
  if (createError) throw createError
  return newChat
}




