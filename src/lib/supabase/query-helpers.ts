/**
 * Query helper utilities for Supabase
 * 
 * These helpers work around TypeScript inference issues with Supabase queries
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * Helper to perform update queries with proper typing
 */
export function updateQuery<T extends keyof Database['public']['Tables']>(
  supabase: SupabaseClient<Database>,
  table: T
) {
  return (supabase.from(table) as any).update
}

/**
 * Helper to perform insert queries with proper typing
 */
export function insertQuery<T extends keyof Database['public']['Tables']>(
  supabase: SupabaseClient<Database>,
  table: T
) {
  return (supabase.from(table) as any).insert
}
