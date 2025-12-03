/**
 * Base Real-time Subscription Hook
 * 
 * Provides core functionality for managing Supabase real-time subscriptions
 * with automatic reconnection and cleanup.
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { Database, TableName, TableRow } from '@/types/supabase'

export type ChangeEventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

export interface SubscriptionConfig<T extends TableName> {
  table: T
  event?: ChangeEventType
  filter?: string
  schema?: string
}

export interface SubscriptionState {
  isConnected: boolean
  isConnecting: boolean
  error: Error | null
  reconnectAttempts: number
}

/**
 * Base hook for managing real-time subscriptions
 * 
 * @param config - Subscription configuration
 * @param onData - Callback when data changes
 * @param enabled - Whether subscription is enabled
 * @returns Subscription state and control functions
 */
export function useRealtimeSubscription<T extends TableName>(
  config: SubscriptionConfig<T>,
  onData: (payload: RealtimePostgresChangesPayload<TableRow<T>>) => void,
  enabled: boolean = true
) {
  const [state, setState] = useState<SubscriptionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempts: 0,
  })

  const channelRef = useRef<RealtimeChannel | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const supabaseRef = useRef(createClient())

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (channelRef.current) {
      supabaseRef.current.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!enabled) return

    setState(prev => ({ ...prev, isConnecting: true, error: null }))

    try {
      const supabase = supabaseRef.current
      const { table, event = '*', filter, schema = 'public' } = config

      // Create channel with unique name
      const channelName = `${table}_${event}_${filter || 'all'}_${Date.now()}`
      const channel = supabase.channel(channelName)

      // Configure postgres changes subscription
      let subscription = channel.on(
        'postgres_changes' as any,
        {
          event,
          schema,
          table,
          filter,
        } as any,
        (payload: RealtimePostgresChangesPayload<TableRow<T>>) => {
          onData(payload)
        }
      )

      // Subscribe and handle connection state
      subscription.subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          setState(prev => ({
            ...prev,
            isConnected: true,
            isConnecting: false,
            error: null,
            reconnectAttempts: 0,
          }))
        } else if (status === 'CHANNEL_ERROR') {
          setState(prev => ({
            ...prev,
            isConnected: false,
            isConnecting: false,
            error: err || new Error('Channel error'),
          }))

          // Attempt reconnection with exponential backoff
          const backoffDelay = Math.min(1000 * Math.pow(2, state.reconnectAttempts), 30000)
          reconnectTimeoutRef.current = setTimeout(() => {
            setState(prev => ({ ...prev, reconnectAttempts: prev.reconnectAttempts + 1 }))
            cleanup()
            connect()
          }, backoffDelay)
        } else if (status === 'CLOSED') {
          setState(prev => ({
            ...prev,
            isConnected: false,
            isConnecting: false,
          }))
        }
      })

      channelRef.current = channel
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      }))
    }
  }, [config, enabled, onData, state.reconnectAttempts, cleanup])

  const disconnect = useCallback(() => {
    cleanup()
    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      reconnectAttempts: 0,
    })
  }, [cleanup])

  // Connect on mount and when config changes
  useEffect(() => {
    if (enabled) {
      connect()
    }

    return () => {
      cleanup()
    }
  }, [enabled, config.table, config.event, config.filter])

  return {
    ...state,
    disconnect,
    reconnect: connect,
  }
}
