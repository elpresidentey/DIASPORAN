/**
 * Real-time Listings Hook
 * 
 * Subscribes to real-time updates for various listing types
 * (dining venues, accommodations, events, flights, transport)
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useRealtimeSubscription, ChangeEventType } from './useRealtimeSubscription'
import type { TableName, TableRow } from '@/types/supabase'

export type ListingType = 'dining_venues' | 'accommodations' | 'events' | 'flights' | 'transport_options'

export interface ListingUpdate<T extends ListingType> {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  listing: TableRow<T> | null
  oldListing: TableRow<T> | null
}

export interface UseRealtimeListingsOptions {
  listingType: ListingType
  filter?: string
  event?: ChangeEventType
  enabled?: boolean
  onInsert?: (listing: any) => void
  onUpdate?: (listing: any, oldListing: any) => void
  onDelete?: (listing: any) => void
}

/**
 * Hook for subscribing to real-time listing updates
 * 
 * @param options - Configuration options
 * @returns Subscription state and latest updates
 * 
 * @example
 * ```tsx
 * const { isConnected, latestUpdate } = useRealtimeListings({
 *   listingType: 'dining_venues',
 *   filter: 'city=eq.Lagos',
 *   onUpdate: (listing) => {
 *     console.log('Venue updated:', listing)
 *   }
 * })
 * ```
 */
export function useRealtimeListings<T extends ListingType>(
  options: UseRealtimeListingsOptions
) {
  const {
    listingType,
    filter,
    event = '*',
    enabled = true,
    onInsert,
    onUpdate,
    onDelete,
  } = options

  const [latestUpdate, setLatestUpdate] = useState<ListingUpdate<T> | null>(null)
  const [updates, setUpdates] = useState<ListingUpdate<T>[]>([])

  const handleData = useCallback(
    (payload: RealtimePostgresChangesPayload<TableRow<T>>) => {
      const update: ListingUpdate<T> = {
        type: payload.eventType,
        listing: payload.new as TableRow<T> | null,
        oldListing: payload.old as TableRow<T> | null,
      }

      setLatestUpdate(update)
      setUpdates(prev => [...prev.slice(-99), update]) // Keep last 100 updates

      // Call specific callbacks
      switch (payload.eventType) {
        case 'INSERT':
          if (onInsert && payload.new) {
            onInsert(payload.new)
          }
          break
        case 'UPDATE':
          if (onUpdate && payload.new) {
            onUpdate(payload.new, payload.old)
          }
          break
        case 'DELETE':
          if (onDelete && payload.old) {
            onDelete(payload.old)
          }
          break
      }
    },
    [onInsert, onUpdate, onDelete]
  )

  const subscription = useRealtimeSubscription<T>(
    {
      table: listingType as T,
      event,
      filter,
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
 * Hook for subscribing to dining venue updates
 */
export function useRealtimeDiningVenues(
  options: Omit<UseRealtimeListingsOptions, 'listingType'> = {}
) {
  return useRealtimeListings({
    ...options,
    listingType: 'dining_venues',
  })
}

/**
 * Hook for subscribing to accommodation updates
 */
export function useRealtimeAccommodations(
  options: Omit<UseRealtimeListingsOptions, 'listingType'> = {}
) {
  return useRealtimeListings({
    ...options,
    listingType: 'accommodations',
  })
}

/**
 * Hook for subscribing to event updates
 */
export function useRealtimeEvents(
  options: Omit<UseRealtimeListingsOptions, 'listingType'> = {}
) {
  return useRealtimeListings({
    ...options,
    listingType: 'events',
  })
}

/**
 * Hook for subscribing to flight updates
 */
export function useRealtimeFlights(
  options: Omit<UseRealtimeListingsOptions, 'listingType'> = {}
) {
  return useRealtimeListings({
    ...options,
    listingType: 'flights',
  })
}

/**
 * Hook for subscribing to transport updates
 */
export function useRealtimeTransport(
  options: Omit<UseRealtimeListingsOptions, 'listingType'> = {}
) {
  return useRealtimeListings({
    ...options,
    listingType: 'transport_options',
  })
}
