/**
 * Supabase Client for Middleware
 * 
 * This client is used in Next.js middleware to handle authentication
 * and session management for protected routes.
 */

import { createMiddlewareClient as createSupabaseMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for use in Next.js middleware
 * 
 * @param req - Next.js request object
 * @param res - Next.js response object
 * @returns Supabase client instance configured for middleware use
 * 
 * @example
 * ```ts
 * import { createMiddlewareClient } from '@/lib/supabase/middleware'
 * import { NextResponse } from 'next/server'
 * import type { NextRequest } from 'next/server'
 * 
 * export async function middleware(req: NextRequest) {
 *   const res = NextResponse.next()
 *   const supabase = createMiddlewareClient(req, res)
 *   
 *   const { data: { session } } = await supabase.auth.getSession()
 *   
 *   if (!session) {
 *     return NextResponse.redirect(new URL('/login', req.url))
 *   }
 *   
 *   return res
 * }
 * ```
 */
export const createMiddlewareClient = (req: NextRequest, res: NextResponse) => {
  return createSupabaseMiddlewareClient<Database>({ req, res })
}
