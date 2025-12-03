/**
 * Real-time Reviews Hook
 * 
 * Subscribes to real-time updates for reviews
 */

'use client'

import { useState, useCallback } from 'react'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useRealtimeSubscription, ChangeEventType } from './useRealtimeSubscription'
import type { Database } from '@/types/supabase'

type ReviewRow = Database['public']['Tables']['reviews']['Row']

export interface ReviewUpdate {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  review: ReviewRow | null
  oldReview: ReviewRow | null
}

export interface UseRealtimeReviewsOptions {
  listingId?: string
  listingType?: ReviewRow['listing_type']
  userId?: string
  event?: ChangeEventType
  enabled?: boolean
  onInsert?: (review: ReviewRow) => void
  onUpdate?: (review: ReviewRow, oldReview: ReviewRow) => void
  onDelete?: (review: ReviewRow) => void
  onRatingChange?: (review: ReviewRow, oldRating: number) => void
}

/**
 * Hook for subscribing to real-time review updates
 * 
 * @param options - Configuration options
 * @returns Subscription state and latest updates
 * 
 * @example
 * ```tsx
 * const { isConnected, latestUpdate } = useRealtimeReviews({
 *   listingId: venueId,
 *   onInsert: (review) => {
 *     console.log('New review:', review)
 *     refreshListingRating()
 *   }
 * })
 * ```
 */
export function useRealtimeReviews(options: UseRealtimeReviewsOptions = {}) {
  const {
    listingId,
    listingType,
    userId,
    event = '*',
    enabled = true,
    onInsert,
    onUpdate,
    onDelete,
    onRatingChange,
  } = options

  const [latestUpdate, setLatestUpdate] = useState<ReviewUpdate | null>(null)
  const [updates, setUpdates] = useState<ReviewUpdate[]>([])

  // Build filter string
  const filter = useCallback(() => {
    const filters: string[] = []
    if (listingId) filters.push(`listing_id=eq.${listingId}`)
    if (listingType) filters.push(`listing_type=eq.${listingType}`)
    if (userId) filters.push(`user_id=eq.${userId}`)
    return filters.length > 0 ? filters.join(',') : undefined
  }, [listingId, listingType, userId])

  const handleData = useCallback(
    (payload: RealtimePostgresChangesPayload<ReviewRow>) => {
      const update: ReviewUpdate = {
        type: payload.eventType,
        review: payload.new as ReviewRow | null,
        oldReview: payload.old as ReviewRow | null,
      }

      setLatestUpdate(update)
      setUpdates(prev => [...prev.slice(-99), update]) // Keep last 100 updates

      // Call specific callbacks
      switch (payload.eventType) {
        case 'INSERT':
          if (onInsert && payload.new) {
            onInsert(payload.new as ReviewRow)
          }
          break
        case 'UPDATE':
          if (payload.new && payload.old) {
            const newReview = payload.new as ReviewRow
            const oldReview = payload.old as ReviewRow

            if (onUpdate) {
              onUpdate(newReview, oldReview)
            }

            // Check for rating change
            if (onRatingChange && newReview.rating !== oldReview.rating) {
              onRatingChange(newReview, oldReview.rating)
            }
          }
          break
        case 'DELETE':
          if (onDelete && payload.old) {
            onDelete(payload.old as ReviewRow)
          }
          break
      }
    },
    [onInsert, onUpdate, onDelete, onRatingChange]
  )

  const subscription = useRealtimeSubscription(
    {
      table: 'reviews',
      event,
      filter: filter(),
    },
    handleData,
    enabled
  )

  const clearUpdates = useCallback(() => {
    setUpdates([])
    setLatestUpdate(null)
  }, [])

  return {
    ...subscription,
    latestUpdate,
    updates,
    clearUpdates,
  }
}

/**
 * Hook for subscribing to reviews for a specific listing
 */
export function useRealtimeListingReviews(
  listingId: string,
  listingType: ReviewRow['listing_type'],
  options: Omit<UseRealtimeReviewsOptions, 'listingId' | 'listingType'> = {}
) {
  return useRealtimeReviews({
    ...options,
    listingId,
    listingType,
    enabled: options.enabled !== false && !!listingId,
  })
}

/**
 * Hook for subscribing to user's own reviews
 */
export function useRealtimeUserReviews(
  userId: string,
  options: Omit<UseRealtimeReviewsOptions, 'userId'> = {}
) {
  return useRealtimeReviews({
    ...options,
    userId,
    enabled: options.enabled !== false && !!userId,
  })
}

/**
 * Hook for subscribing to reviews by listing type
 */
export function useRealtimeReviewsByType(
  listingType: ReviewRow['listing_type'],
  options: Omit<UseRealtimeReviewsOptions, 'listingType'> = {}
) {
  return useRealtimeReviews({
    ...options,
    listingType,
  })
}
