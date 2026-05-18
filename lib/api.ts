import { supabase } from './supabase'

export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    if (error) throw error
    return data ?? []
  } catch (err: any) {
    console.warn('getCategories failed:', err?.message)
    return []
  }
}

export async function getListings(options: {
  category?: string
  search?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  city?: string
  sortBy?: string
  limit?: number
} = {}) {
  try {
    let query = supabase
      .from('listings')
      .select('*, seller:seller_id(*), listing_images(*)')

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
    if (options.city) {
      query = query.ilike('city', `%${options.city}%`)
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
    return data ?? []
  } catch (err: any) {
    console.warn('getListings failed:', err?.message)
    return []
  }
}

export async function getListingById(id: string) {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*, seller:seller_id(*), listing_images(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  } catch (err: any) {
    console.warn('getListingById failed:', err?.message)
    return null
  }
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
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*, seller:seller_id(*), listing_images(*)')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (err: any) {
    console.warn('getUserListings failed:', err?.message)
    return []
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  } catch (err: any) {
    console.warn('getUserProfile failed:', err?.message)
    return null
  }
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
  if (error) {
    console.warn('updateProfile failed:', error.message)
    throw error
  }
  return data
}

export async function getNotifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (err: any) {
    console.warn('getNotifications failed:', err?.message)
    return []
  }
}

export async function getConversations(userId: string) {
  try {
    const { data: errorData, error } = await supabase
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
    return (errorData ?? [])
      .filter((chat: any) => chat.buyer_id !== chat.seller_id)
      .map((chat: any) => ({
        ...chat,
        last_message: chat.messages?.sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0],
        unread_count: chat.messages?.filter((m: any) => m.sender_id !== userId && m.read !== true).length,
      }))
  } catch (err: any) {
    console.warn('getConversations failed:', err?.message)
    return []
  }
}

export async function markMessagesAsRead(chatId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('chat_id', chatId)
      .neq('sender_id', userId)
    if (error) console.error('Error marking messages as read:', error)
  } catch (err: any) {
    console.warn('markMessagesAsRead failed:', err?.message)
  }
}

export async function getUnreadMessageCount(userId: string) {
  try {
    const conversations = await getConversations(userId)
    return conversations.reduce((total: number, chat: any) => total + (chat.unread_count || 0), 0)
  } catch {
    return 0
  }
}

export async function getUnreadNotificationCount(userId: string) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)
    if (error) throw error
    return count || 0
  } catch {
    return 0
  }
}

export async function saveListing(userId: string, listing_id: string) {
  try {
    const { error } = await supabase
      .from('saved_listings')
      .insert([{ user_id: userId, listing_id }])
    if (error && error.code !== '23505') throw error
  } catch (err: any) {
    console.warn('saveListing failed:', err?.message)
    throw err
  }
}

export async function getSavedListingIds(userId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_listings')
      .select('listing_id')
      .eq('user_id', userId)
    if (error) throw error
    return (data ?? []).map((item: any) => item.listing_id)
  } catch (err: any) {
    console.warn('getSavedListingIds failed:', err?.message)
    return []
  }
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
  try {
    const { data, error } = await supabase
      .from('saved_listings')
      .select(`listing:listing_id(*, seller:seller_id(*), listing_images(*))`)
      .eq('user_id', userId)
    if (error) throw error
    return (data ?? []).map((item: any) => item.listing).filter(Boolean)
  } catch (err: any) {
    console.warn('getSavedListings failed:', err?.message)
    return []
  }
}

export async function getMessages(chatId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data ?? []
  } catch (err: any) {
    console.warn('getMessages failed:', err?.message)
    return []
  }
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
  if (buyerId === sellerId) {
    throw new Error('You cannot start a chat with yourself.')
  }
  const { data: existingChat, error: findError } = await supabase
    .from('chats')
    .select('*')
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .eq('listing_id', listingId)
    .maybeSingle()
  if (findError) throw findError
  if (existingChat) return existingChat

  const { data: newChat, error: createError } = await supabase
    .from('chats')
    .insert([{ buyer_id: buyerId, seller_id: sellerId, listing_id: listingId }])
    .select()
    .single()
  if (createError) throw createError
  return newChat
}
