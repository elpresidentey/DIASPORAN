/**
 * Authentication Middleware for API Routes
 * Validates authentication tokens and protects routes
 */

import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'

export interface AuthenticatedRequest {
  user: User
}

/**
 * Middleware to require authentication for API routes
 * Returns the authenticated user or an error response
 */
export async function requireAuth(): Promise<
  { user: User; error: null } | { user: null; error: NextResponse }
> {
  const supabase = createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      user: null,
      error: NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      ),
    }
  }

  return { user, error: null }
}

/**
 * Middleware to require admin role
 * Checks if user has admin privileges by querying the users_profiles table
 */
export async function requireAdmin(): Promise<
  { user: User; error: null } | { user: null; error: NextResponse }
> {
  const authResult = await requireAuth()

  if (authResult.error) {
    return authResult
  }

  const supabase = createServerClient()

  // Check if user has admin privileges in their profile
  const { data: profile, error: profileError } = await supabase
    .from('users_profiles')
    .select('preferences')
    .eq('id', authResult.user.id)
    .single() as { data: { preferences: any } | null; error: any }

  if (profileError || !profile) {
    return {
      user: null,
      error: NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Admin access required',
          },
        },
        { status: 403 }
      ),
    }
  }

  const preferences = profile.preferences as Record<string, any> | null
  const isAdmin = preferences?.is_admin === true

  if (!isAdmin) {
    return {
      user: null,
      error: NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Admin access required',
          },
        },
        { status: 403 }
      ),
    }
  }

  return { user: authResult.user, error: null }
}

/**
 * Optional authentication - returns user if authenticated, null otherwise
 * Does not block the request
 */
export async function optionalAuth(): Promise<{ user: User | null }> {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { user }
}

/**
 * Validate request has valid session token
 */
export async function validateSession(): Promise<boolean> {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return !!session
}
