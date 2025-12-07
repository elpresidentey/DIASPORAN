/**
 * Supabase Client for Client Components
 * 
 * This client is used in Client Components (components with 'use client' directive).
 * It uses the browser's cookies to manage authentication state.
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for use in Client Components
 * 
 * @returns Supabase client instance configured for client-side use
 * 
 * @example
 * ```tsx
 * 'use client'
 * 
 * import { createClient } from '@/lib/supabase/client'
 * 
 * export default function MyComponent() {
 *   const supabase = createClient()
 *   
 *   const fetchData = async () => {
 *     const { data, error } = await supabase
 *       .from('dining_venues')
 *       .select('*')
 *   }
 *   
 *   return <div>...</div>
 * }
 * ```
 */
export const createClient = () => {
  return createClientComponentClient<Database>()
}
