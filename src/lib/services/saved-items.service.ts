/**
 * Saved Items Service
 * Handles saving, removing, and retrieving saved items across all listing types
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Database, SavedItemWithListing } from '@/types/supabase'

type SavedItem = Database['public']['Tables']['saved_items']['Row']
type ItemType = Database['public']['Tables']['saved_items']['Row']['item_type']

export interface SavedItemsServiceError {
  code: string
  message: string
  details?: any
}

/**
 * Save an item to user's saved items
 */
export async function saveItem(
  userId: string,
  itemType: ItemType,
  itemId: string,
  notes?: string
): Promise<{ savedItem: SavedItem | null; error: SavedItemsServiceError | null }> {
  const supabase = createClient() as any

  // Verify the item exists in the appropriate table
  const { exists, error: verifyError } = await verifyItemExists(itemType, itemId)

  if (verifyError || !exists) {
    return {
      savedItem: null,
      error: verifyError || {
        code: 'ITEM_NOT_FOUND',
        message: `${itemType} not found`,
      },
    }
  }

  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .maybeSingle()

  if (existing) {
    return {
      savedItem: null,
      error: {
        code: 'ALREADY_SAVED',
        message: 'Item is already saved',
      },
    }
  }

  const insertData: Database['public']['Tables']['saved_items']['Insert'] = {
    user_id: userId,
    item_type: itemType,
    item_id: itemId,
    notes: notes || null,
  }

  const result = await supabase
    .from('saved_items')
    .insert(insertData)
    .select()
    .single()

  const savedItem = result.data as SavedItem | null
  const saveError = result.error

  if (saveError) {
    return {
      savedItem: null,
      error: {
        code: 'SAVE_FAILED',
        message: 'Failed to save item',
        details: saveError,
      },
    }
  }

  return { savedItem, error: null }
}

export async function removeSavedItem(
  userId: string,
  savedItemId: string
): Promise<{ success: boolean; error: SavedItemsServiceError | null }> {
  const supabase = createClient()

  const { error } = await supabase
    .from('saved_items')
    .delete()
    .eq('id', savedItemId)
    .eq('user_id', userId)

  if (error) {
    return {
      success: false,
      error: {
        code: 'REMOVE_FAILED',
        message: 'Failed to remove saved item',
        details: error,
      },
    }
  }

  return { success: true, error: null }
}

export async function getSavedItems(
  userId: string,
  itemType?: ItemType
): Promise<{ items: SavedItemWithListing[]; error: SavedItemsServiceError | null }> {
  const supabase = createClient()

  let query = supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (itemType) {
    query = query.eq('item_type', itemType)
  }

  const { data: savedItems, error: savedError } = await query

  if (savedError) {
    return {
      items: [],
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch saved items',
        details: savedError,
      },
    }
  }

  if (!savedItems || savedItems.length === 0) {
    return { items: [], error: null }
  }

  const itemsWithListings = await Promise.all(
    savedItems.map(async (savedItem: SavedItem) => {
      const { listing, isAvailable } = await fetchListingData(
        savedItem.item_type,
        savedItem.item_id
      )

      return {
        ...savedItem,
        listing,
        is_available: isAvailable,
      } as SavedItemWithListing
    })
  )

  return { items: itemsWithListings, error: null }
}

async function verifyItemExists(
  itemType: ItemType,
  itemId: string
): Promise<{ exists: boolean; error: SavedItemsServiceError | null }> {
  const supabase = createClient()

  const tableMap: Record<ItemType, string> = {
    dining: 'dining_venues',
    accommodation: 'accommodations',
    flight: 'flights',
    event: 'events',
    transport: 'transport_options',
  }

  const tableName = tableMap[itemType]

  const { data, error } = await supabase
    .from(tableName as any)
    .select('id')
    .eq('id', itemId)
    .maybeSingle()

  if (error) {
    return {
      exists: false,
      error: {
        code: 'VERIFICATION_FAILED',
        message: `Failed to verify ${itemType}`,
        details: error,
      },
    }
  }

  return { exists: !!data, error: null }
}

async function fetchListingData(
  itemType: ItemType,
  itemId: string
): Promise<{ listing: any | null; isAvailable: boolean }> {
  const supabase = createClient()

  const tableMap: Record<ItemType, string> = {
    dining: 'dining_venues',
    accommodation: 'accommodations',
    flight: 'flights',
    event: 'events',
    transport: 'transport_options',
  }

  const tableName = tableMap[itemType]

  const { data, error } = await supabase
    .from(tableName as any)
    .select('*')
    .eq('id', itemId)
    .maybeSingle()

  if (error || !data) {
    return { listing: null, isAvailable: false }
  }

  let isAvailable = true

  if (data && 'deleted_at' in data && (data as any).deleted_at !== null) {
    isAvailable = false
  }

  if (itemType === 'event' && data && 'available_spots' in data) {
    isAvailable = (data as any).available_spots > 0
  }

  if (itemType === 'flight' && data && 'available_seats' in data) {
    isAvailable = (data as any).available_seats > 0
  }

  if (itemType === 'transport' && data && 'available_seats' in data) {
    isAvailable = (data as any).available_seats > 0
  }

  return { listing: data, isAvailable }
}

export async function saveItemServer(
  userId: string,
  itemType: ItemType,
  itemId: string,
  notes?: string
): Promise<{ savedItem: SavedItem | null; error: SavedItemsServiceError | null }> {
  const supabase = createServerClient() as any

  const { exists, error: verifyError } = await verifyItemExistsServer(itemType, itemId)

  if (verifyError || !exists) {
    return {
      savedItem: null,
      error: verifyError || {
        code: 'ITEM_NOT_FOUND',
        message: `${itemType} not found`,
      },
    }
  }

  const { data: existing } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .maybeSingle()

  if (existing) {
    return {
      savedItem: null,
      error: {
        code: 'ALREADY_SAVED',
        message: 'Item is already saved',
      },
    }
  }

  const insertData: Database['public']['Tables']['saved_items']['Insert'] = {
    user_id: userId,
    item_type: itemType,
    item_id: itemId,
    notes: notes || null,
  }

  const result = await supabase
    .from('saved_items')
    .insert(insertData)
    .select()
    .single()

  const savedItem = result.data as SavedItem | null
  const saveError = result.error

  if (saveError) {
    return {
      savedItem: null,
      error: {
        code: 'SAVE_FAILED',
        message: 'Failed to save item',
        details: saveError,
      },
    }
  }

  return { savedItem, error: null }
}

export async function removeSavedItemServer(
  userId: string,
  savedItemId: string
): Promise<{ success: boolean; error: SavedItemsServiceError | null }> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('saved_items')
    .delete()
    .eq('id', savedItemId)
    .eq('user_id', userId)

  if (error) {
    return {
      success: false,
      error: {
        code: 'REMOVE_FAILED',
        message: 'Failed to remove saved item',
        details: error,
      },
    }
  }

  return { success: true, error: null }
}

export async function getSavedItemsServer(
  userId: string,
  itemType?: ItemType
): Promise<{ items: SavedItemWithListing[]; error: SavedItemsServiceError | null }> {
  const supabase = createServerClient()

  let query = supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (itemType) {
    query = query.eq('item_type', itemType)
  }

  const { data: savedItems, error: savedError } = await query

  if (savedError) {
    return {
      items: [],
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch saved items',
        details: savedError,
      },
    }
  }

  if (!savedItems || savedItems.length === 0) {
    return { items: [], error: null }
  }

  const itemsWithListings = await Promise.all(
    savedItems.map(async (savedItem: SavedItem) => {
      const { listing, isAvailable } = await fetchListingDataServer(
        savedItem.item_type,
        savedItem.item_id
      )

      return {
        ...savedItem,
        listing,
        is_available: isAvailable,
      } as SavedItemWithListing
    })
  )

  return { items: itemsWithListings, error: null }
}

async function verifyItemExistsServer(
  itemType: ItemType,
  itemId: string
): Promise<{ exists: boolean; error: SavedItemsServiceError | null }> {
  const supabase = createServerClient()

  const tableMap: Record<ItemType, string> = {
    dining: 'dining_venues',
    accommodation: 'accommodations',
    flight: 'flights',
    event: 'events',
    transport: 'transport_options',
  }

  const tableName = tableMap[itemType]

  const { data, error } = await supabase
    .from(tableName as any)
    .select('id')
    .eq('id', itemId)
    .maybeSingle()

  if (error) {
    return {
      exists: false,
      error: {
        code: 'VERIFICATION_FAILED',
        message: `Failed to verify ${itemType}`,
        details: error,
      },
    }
  }

  return { exists: !!data, error: null }
}

async function fetchListingDataServer(
  itemType: ItemType,
  itemId: string
): Promise<{ listing: any | null; isAvailable: boolean }> {
  const supabase = createServerClient()

  const tableMap: Record<ItemType, string> = {
    dining: 'dining_venues',
    accommodation: 'accommodations',
    flight: 'flights',
    event: 'events',
    transport: 'transport_options',
  }

  const tableName = tableMap[itemType]

  const { data, error } = await supabase
    .from(tableName as any)
    .select('*')
    .eq('id', itemId)
    .maybeSingle()

  if (error || !data) {
    return { listing: null, isAvailable: false }
  }

  let isAvailable = true

  if (data && 'deleted_at' in data && (data as any).deleted_at !== null) {
    isAvailable = false
  }

  if (itemType === 'event' && data && 'available_spots' in data) {
    isAvailable = (data as any).available_spots > 0
  }

  if (itemType === 'flight' && data && 'available_seats' in data) {
    isAvailable = (data as any).available_seats > 0
  }

  if (itemType === 'transport' && data && 'available_seats' in data) {
    isAvailable = (data as any).available_seats > 0
  }

  return { listing: data, isAvailable }
}
