/**
 * Review Service
 * Handles all review management operations including CRUD and rating calculations
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type Review = Database['public']['Tables']['reviews']['Row']
type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
type ReviewUpdate = Database['public']['Tables']['reviews']['Update']
type Booking = Database['public']['Tables']['bookings']['Row']

export interface ReviewServiceError {
  code: string
  message: string
  details?: any
}

export interface ReviewFilters {
  page?: number
  limit?: number
  listing_type?: string
  listing_id?: string
  user_id?: string
  min_rating?: number
  max_rating?: number
  sortBy?: 'created_at' | 'rating' | 'helpful_count'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedReviews {
  data: Review[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface CreateReviewInput {
  booking_id: string
  listing_type: 'dining' | 'accommodation' | 'event' | 'transport'
  listing_id: string
  rating: number
  title: string
  comment: string
  images?: string[]
}

export interface UpdateReviewInput {
  rating?: number
  title?: string
  comment?: string
  images?: string[]
}

/**
 * Validate that user has a completed booking before allowing review
 */
async function validateBookingForReview(
  bookingId: string,
  userId: string,
  supabase: ReturnType<typeof createClient> | ReturnType<typeof createServerClient>
): Promise<{ valid: boolean; booking?: Booking; error?: ReviewServiceError }> {
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single()

  if (error || !booking) {
    return {
      valid: false,
      error: {
        code: 'BOOKING_NOT_FOUND',
        message: 'Booking not found or you do not have permission to review it',
        details: error,
      },
    }
  }

  // Check if booking is completed
  if ((booking as Booking).status !== 'completed') {
    return {
      valid: false,
      error: {
        code: 'BOOKING_NOT_COMPLETED',
        message: 'You can only review completed bookings',
      },
    }
  }

  // Check if review already exists for this booking
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', bookingId)
    .single()

  if (existingReview) {
    return {
      valid: false,
      error: {
        code: 'REVIEW_EXISTS',
        message: 'A review already exists for this booking',
      },
    }
  }

  return { valid: true, booking: booking as Booking }
}

/**
 * Create a new review (client-side)
 */
export async function createReview(
  userId: string,
  reviewData: CreateReviewInput
): Promise<{ review: Review | null; error: ReviewServiceError | null }> {
  const supabase = createClient()

  // Validate booking
  const validation = await validateBookingForReview(reviewData.booking_id, userId, supabase)
  if (!validation.valid || !validation.booking) {
    return { review: null, error: validation.error! }
  }

  // Validate rating
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    return {
      review: null,
      error: {
        code: 'INVALID_RATING',
        message: 'Rating must be between 1 and 5',
      },
    }
  }

  // Prepare review data
  const insertData: ReviewInsert = {
    user_id: userId,
    booking_id: reviewData.booking_id,
    listing_type: reviewData.listing_type,
    listing_id: reviewData.listing_id,
    rating: reviewData.rating,
    title: reviewData.title,
    comment: reviewData.comment,
    images: reviewData.images || [],
  }

  // Insert review
  const { data: review, error } = await supabase
    .from('reviews')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return {
      review: null,
      error: {
        code: 'CREATE_FAILED',
        message: 'Failed to create review',
        details: error,
      },
    }
  }

  // The database trigger will automatically update the listing's average rating

  return { review: review as Review, error: null }
}

/**
 * Get paginated reviews with filters (client-side)
 */
export async function getReviews(
  filters: ReviewFilters = {}
): Promise<{ data: PaginatedReviews | null; error: ReviewServiceError | null }> {
  const supabase = createClient()

  const {
    page = 1,
    limit = 20,
    listing_type,
    listing_id,
    user_id,
    min_rating,
    max_rating,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = filters

  let query = supabase
    .from('reviews')
    .select('*', { count: 'exact' })

  // Apply filters
  if (listing_type) {
    query = query.eq('listing_type', listing_type)
  }

  if (listing_id) {
    query = query.eq('listing_id', listing_id)
  }

  if (user_id) {
    query = query.eq('user_id', user_id)
  }

  if (min_rating !== undefined) {
    query = query.gte('rating', min_rating)
  }

  if (max_rating !== undefined) {
    query = query.lte('rating', max_rating)
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return {
      data: null,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch reviews',
        details: error,
      },
    }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    data: {
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
    error: null,
  }
}

/**
 * Get single review by ID (client-side)
 */
export async function getReview(
  reviewId: string
): Promise<{ review: Review | null; error: ReviewServiceError | null }> {
  const supabase = createClient()

  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .single()

  if (error) {
    return {
      review: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Review not found',
        details: error,
      },
    }
  }

  return { review, error: null }
}

/**
 * Update a review (client-side)
 */
export async function updateReview(
  reviewId: string,
  userId: string,
  updates: UpdateReviewInput
): Promise<{ review: Review | null; error: ReviewServiceError | null }> {
  const supabase = createClient()

  // Validate rating if provided
  if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
    return {
      review: null,
      error: {
        code: 'INVALID_RATING',
        message: 'Rating must be between 1 and 5',
      },
    }
  }

  // Prepare update data
  const updateData: ReviewUpdate = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  // Update the review (RLS ensures user owns it)
  const { data: review, error } = await supabase
    .from('reviews')
    .update(updateData as any)
    .eq('id', reviewId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    return {
      review: null,
      error: {
        code: 'UPDATE_FAILED',
        message: 'Failed to update review or you do not have permission',
        details: error,
      },
    }
  }

  // The database trigger will automatically update the listing's average rating if rating changed

  return { review, error: null }
}

/**
 * Delete a review (client-side)
 */
export async function deleteReview(
  reviewId: string,
  userId: string
): Promise<{ success: boolean; error: ReviewServiceError | null }> {
  const supabase = createClient()

  // Delete the review (RLS ensures user owns it)
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId)

  if (error) {
    return {
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: 'Failed to delete review or you do not have permission',
        details: error,
      },
    }
  }

  // The database trigger will automatically recalculate the listing's average rating

  return { success: true, error: null }
}

// ============================================================================
// SERVER-SIDE FUNCTIONS (for use in API routes)
// ============================================================================

/**
 * Create a new review (server-side)
 */
export async function createReviewServer(
  userId: string,
  reviewData: CreateReviewInput
): Promise<{ review: Review | null; error: ReviewServiceError | null }> {
  const supabase = createServerClient()

  // Validate booking
  const validation = await validateBookingForReview(reviewData.booking_id, userId, supabase)
  if (!validation.valid || !validation.booking) {
    return { review: null, error: validation.error! }
  }

  // Validate rating
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    return {
      review: null,
      error: {
        code: 'INVALID_RATING',
        message: 'Rating must be between 1 and 5',
      },
    }
  }

  // Prepare review data
  const insertData: ReviewInsert = {
    user_id: userId,
    booking_id: reviewData.booking_id,
    listing_type: reviewData.listing_type,
    listing_id: reviewData.listing_id,
    rating: reviewData.rating,
    title: reviewData.title,
    comment: reviewData.comment,
    images: reviewData.images || [],
  }

  // Insert review
  const { data: review, error } = await supabase
    .from('reviews')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return {
      review: null,
      error: {
        code: 'CREATE_FAILED',
        message: 'Failed to create review',
        details: error,
      },
    }
  }

  return { review: review as Review, error: null }
}

/**
 * Get paginated reviews with filters (server-side)
 */
export async function getReviewsServer(
  filters: ReviewFilters = {}
): Promise<{ data: PaginatedReviews | null; error: ReviewServiceError | null }> {
  const supabase = createServerClient()

  const {
    page = 1,
    limit = 20,
    listing_type,
    listing_id,
    user_id,
    min_rating,
    max_rating,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = filters

  let query = supabase
    .from('reviews')
    .select('*', { count: 'exact' })

  // Apply filters
  if (listing_type) {
    query = query.eq('listing_type', listing_type)
  }

  if (listing_id) {
    query = query.eq('listing_id', listing_id)
  }

  if (user_id) {
    query = query.eq('user_id', user_id)
  }

  if (min_rating !== undefined) {
    query = query.gte('rating', min_rating)
  }

  if (max_rating !== undefined) {
    query = query.lte('rating', max_rating)
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return {
      data: null,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch reviews',
        details: error,
      },
    }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    data: {
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
    error: null,
  }
}

/**
 * Get single review by ID (server-side)
 */
export async function getReviewServer(
  reviewId: string
): Promise<{ review: Review | null; error: ReviewServiceError | null }> {
  const supabase = createServerClient()

  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .single()

  if (error) {
    return {
      review: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Review not found',
        details: error,
      },
    }
  }

  return { review, error: null }
}

/**
 * Update a review (server-side)
 */
export async function updateReviewServer(
  reviewId: string,
  userId: string,
  updates: UpdateReviewInput
): Promise<{ review: Review | null; error: ReviewServiceError | null }> {
  const supabase = createServerClient()

  // Validate rating if provided
  if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
    return {
      review: null,
      error: {
        code: 'INVALID_RATING',
        message: 'Rating must be between 1 and 5',
      },
    }
  }

  // Prepare update data
  const updateData: ReviewUpdate = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  // Update the review (RLS ensures user owns it)
  const { data: review, error } = await supabase
    .from('reviews')
    .update(updateData as any)
    .eq('id', reviewId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    return {
      review: null,
      error: {
        code: 'UPDATE_FAILED',
        message: 'Failed to update review or you do not have permission',
        details: error,
      },
    }
  }

  return { review, error: null }
}

/**
 * Delete a review (server-side)
 */
export async function deleteReviewServer(
  reviewId: string,
  userId: string
): Promise<{ success: boolean; error: ReviewServiceError | null }> {
  const supabase = createServerClient()

  // Delete the review (RLS ensures user owns it)
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId)

  if (error) {
    return {
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: 'Failed to delete review or you do not have permission',
        details: error,
      },
    }
  }

  return { success: true, error: null }
}
