/**
 * Supabase Client for Server Components
 * 
 * This client is used in Server Components, Server Actions, and API Routes.
 * It uses Next.js cookies() to manage authentication state server-side.
 */

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for use in Server Components
 * 
 * @returns Supabase client instance configured for server-side use
 * 
 * @example
 * ```tsx
 * import { createServerClient } from '@/lib/supabase/server'
 * 
 * export default async function MyServerComponent() {
 *   const supabase = createServerClient()
 *   
 *   const { data, error } = await supabase
 *     .from('dining_venues')
 *     .select('*')
 *   
 *   return <div>...</div>
 * }
 * ```
 */
export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
