/**
 * Admin Service
 * Handles administrative operations including listing management and media uploads
 */

import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type DiningVenue = Database['public']['Tables']['dining_venues']['Row']
type Accommodation = Database['public']['Tables']['accommodations']['Row']
type Event = Database['public']['Tables']['events']['Row']

export type ListingType = 'dining_venues' | 'accommodations' | 'events' | 'transport_options'

export interface CreateListingInput {
  type: ListingType
  data: Record<string, any>
}

export interface UpdateListingInput {
  type: ListingType
  id: string
  data: Record<string, any>
}

export interface DeleteListingInput {
  type: ListingType
  id: string
}

export interface AdminListingFilters {
  includeDeleted?: boolean
  page?: number
  limit?: number
  city?: string
  country?: string
}

export interface MediaUploadResult {
  url: string
  path: string
}

/**
 * Check if a user has admin privileges
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createServerClient()

  const { data: profile, error } = await supabase
    .from('users_profiles')
    .select('preferences')
    .eq('id', userId)
    .single() as { data: { preferences: any } | null; error: any }

  if (error || !profile) {
    return false
  }

  const preferences = profile.preferences as Record<string, any> | null
  return preferences?.is_admin === true
}

/**
 * Create a new listing with admin attribution
 */
export async function createListing(
  userId: string,
  input: CreateListingInput
): Promise<{ data: any; error: any }> {
  const supabase = createServerClient()

  // Verify admin status
  const adminStatus = await isAdmin(userId)
  if (!adminStatus) {
    return {
      data: null,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    }
  }

  // Add created_by field
  const listingData = {
    ...input.data,
    created_by: userId,
  }

  const { data, error } = await supabase
    .from(input.type as any)
    .insert(listingData as any)
    .select()
    .single()

  return { data, error }
}

/**
 * Update an existing listing
 */
export async function updateListing(
  userId: string,
  input: UpdateListingInput
): Promise<{ data: any; error: any }> {
  const supabase = createServerClient()

  // Verify admin status
  const adminStatus = await isAdmin(userId)
  if (!adminStatus) {
    return {
      data: null,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    }
  }

  const updateListingQuery: any = supabase.from(input.type as any)
  const { data, error } = await updateListingQuery
    .update(input.data)
    .eq('id', input.id)
    .select()
    .single()

  return { data, error }
}

/**
 * Soft delete a listing
 * Sets deleted_at timestamp and cancels future bookings
 */
export async function softDeleteListing(
  userId: string,
  input: DeleteListingInput
): Promise<{ data: any; error: any }> {
  const supabase = createServerClient()

  // Verify admin status
  const adminStatus = await isAdmin(userId)
  if (!adminStatus) {
    return {
      data: null,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    }
  }

  // Soft delete the listing
  const queryBuilder: any = supabase.from(input.type)
  const { data, error } = await queryBuilder
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', input.id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  // Cancel future bookings for this listing
  const bookingType = getBookingType(input.type)
  if (bookingType) {
    const bookingQuery: any = supabase.from('bookings')
    await bookingQuery
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('booking_type', bookingType)
      .eq('reference_id', input.id)
      .gte('start_date', new Date().toISOString())
      .in('status', ['pending', 'confirmed'])
  }

  return { data, error: null }
}

/**
 * Get listings with admin privileges (includes soft-deleted items)
 */
export async function getAdminListings(
  userId: string,
  type: ListingType,
  filters: AdminListingFilters = {}
): Promise<{ data: any[]; error: any; pagination?: any }> {
  const supabase = createServerClient()

  // Verify admin status
  const adminStatus = await isAdmin(userId)
  if (!adminStatus) {
    return {
      data: [],
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    }
  }

  const page = filters.page || 1
  const limit = filters.limit || 20
  const offset = (page - 1) * limit

  let query = supabase.from(type).select('*', { count: 'exact' })

  // Include or exclude deleted items
  if (!filters.includeDeleted) {
    query = query.is('deleted_at', null)
  }

  // Apply filters
  if (filters.city) {
    query = query.eq('city', filters.city)
  }
  if (filters.country) {
    query = query.eq('country', filters.country)
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    return { data: [], error }
  }

  return {
    data: data || [],
    error: null,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  }
}

/**
 * Upload media file to Supabase Storage
 */
export async function uploadMedia(
  userId: string,
  file: File,
  folder: string
): Promise<{ data: MediaUploadResult | null; error: any }> {
  const supabase = createServerClient()

  // Verify admin status
  const adminStatus = await isAdmin(userId)
  if (!adminStatus) {
    return {
      data: null,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    }
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  // Upload to listing-images bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    return { data: null, error: uploadError }
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('listing-images').getPublicUrl(fileName)

  return {
    data: {
      url: publicUrl,
      path: fileName,
    },
    error: null,
  }
}

/**
 * Delete media file from Supabase Storage
 */
export async function deleteMedia(
  userId: string,
  path: string
): Promise<{ error: any }> {
  const supabase = createServerClient()

  // Verify admin status
  const adminStatus = await isAdmin(userId)
  if (!adminStatus) {
    return {
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    }
  }

  const { error } = await supabase.storage.from('listing-images').remove([path])

  return { error }
}

/**
 * Helper function to map listing type to booking type
 */
function getBookingType(listingType: ListingType): string | null {
  const mapping: Record<ListingType, string> = {
    dining_venues: 'dining',
    accommodations: 'accommodation',
    events: 'event',
    transport_options: 'transport',
  }
  return mapping[listingType] || null
}

/**
 * Restore a soft-deleted listing
 */
export async function restoreListing(
  userId: string,
  input: DeleteListingInput
): Promise<{ data: any; error: any }> {
  const supabase = createServerClient()

  // Verify admin status
  const adminStatus = await isAdmin(userId)
  if (!adminStatus) {
    return {
      data: null,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    }
  }

  const restoreQuery: any = supabase.from(input.type)
  const { data, error } = await restoreQuery
    .update({ deleted_at: null })
    .eq('id', input.id)
    .select()
    .single()

  return { data, error }
}

/**
 * Get listing by ID with admin privileges (includes soft-deleted)
 */
export async function getAdminListing(
  userId: string,
  type: ListingType,
  id: string
): Promise<{ data: any; error: any }> {
  const supabase = createServerClient()

  // Verify admin status
  const adminStatus = await isAdmin(userId)
  if (!adminStatus) {
    return {
      data: null,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    }
  }

  const { data, error } = await supabase.from(type).select('*').eq('id', id).single()

  return { data, error }
}
