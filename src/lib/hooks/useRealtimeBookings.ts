/**
 * Real-time Bookings Hook
 * 
 * Subscribes to real-time updates for user bookings
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useRealtimeSubscription, ChangeEventType } from './useRealtimeSubscription'
import type { Database } from '@/types/supabase'

type BookingRow = Database['public']['Tables']['bookings']['Row']

export interface BookingUpdate {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  booking: BookingRow | null
  oldBooking: BookingRow | null
}

export interface UseRealtimeBookingsOptions {
  userId?: string
  bookingType?: BookingRow['booking_type']
  status?: BookingRow['status']
  event?: ChangeEventType
  enabled?: boolean
  onInsert?: (booking: BookingRow) => void
  onUpdate?: (booking: BookingRow, oldBooking: BookingRow) => void
  onDelete?: (booking: BookingRow) => void
  onStatusChange?: (booking: BookingRow, oldStatus: BookingRow['status']) => void
}

/**
 * Hook for subscribing to real-time booking updates
 * 
 * @param options - Configuration options
 * @returns Subscription state and latest updates
 * 
 * @example
 * ```tsx
 * const { isConnected, latestUpdate } = useRealtimeBookings({
 *   userId: user.id,
 *   onStatusChange: (booking, oldStatus) => {
 *     if (booking.status === 'confirmed') {
 *       showNotification('Booking confirmed!')
 *     }
 *   }
 * })
 * ```
 */
export function useRealtimeBookings(options: UseRealtimeBookingsOptions = {}) {
  const {
    userId,
    bookingType,
    status,
    event = '*',
    enabled = true,
    onInsert,
    onUpdate,
    onDelete,
    onStatusChange,
  } = options

  const [latestUpdate, setLatestUpdate] = useState<BookingUpdate | null>(null)
  const [updates, setUpdates] = useState<BookingUpdate[]>([])

  // Build filter string
  const filter = useCallback(() => {
    const filters: string[] = []
    if (userId) filters.push(`user_id=eq.${userId}`)
    if (bookingType) filters.push(`booking_type=eq.${bookingType}`)
    if (status) filters.push(`status=eq.${status}`)
    return filters.length > 0 ? filters.join(',') : undefined
  }, [userId, bookingType, status])

  const handleData = useCallback(
    (payload: RealtimePostgresChangesPayload<BookingRow>) => {
      const update: BookingUpdate = {
        type: payload.eventType,
        booking: payload.new as BookingRow | null,
        oldBooking: payload.old as BookingRow | null,
      }

      setLatestUpdate(update)
      setUpdates(prev => [...prev.slice(-99), update]) // Keep last 100 updates

      // Call specific callbacks
      switch (payload.eventType) {
        case 'INSERT':
          if (onInsert && payload.new) {
            onInsert(payload.new as BookingRow)
          }
          break
        case 'UPDATE':
          if (payload.new && payload.old) {
            const newBooking = payload.new as BookingRow
            const oldBooking = payload.old as BookingRow

            if (onUpdate) {
              onUpdate(newBooking, oldBooking)
            }

            // Check for status change
            if (onStatusChange && newBooking.status !== oldBooking.status) {
              onStatusChange(newBooking, oldBooking.status)
            }
          }
          break
        case 'DELETE':
          if (onDelete && payload.old) {
            onDelete(payload.old as BookingRow)
          }
          break
      }
    },
    [onInsert, onUpdate, onDelete, onStatusChange]
  )

  const subscription = useRealtimeSubscription(
    {
      table: 'bookings',
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
 * Hook for subscribing to user's own bookings
 * Automatically filters by current user
 */
export function useRealtimeUserBookings(
  userId: string,
  options: Omit<UseRealtimeBookingsOptions, 'userId'> = {}
) {
  return useRealtimeBookings({
    ...options,
    userId,
    enabled: options.enabled !== false && !!userId,
  })
}

/**
 * Hook for subscribing to bookings by type
 */
export function useRealtimeBookingsByType(
  bookingType: BookingRow['booking_type'],
  options: Omit<UseRealtimeBookingsOptions, 'bookingType'> = {}
) {
  return useRealtimeBookings({
    ...options,
    bookingType,
  })
}

/**
 * Hook for subscribing to bookings by status
 */
export function useRealtimeBookingsByStatus(
  status: BookingRow['status'],
  options: Omit<UseRealtimeBookingsOptions, 'status'> = {}
) {
  return useRealtimeBookings({
    ...options,
    status,
  })
}
