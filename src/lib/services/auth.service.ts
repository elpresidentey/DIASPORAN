/**
 * Authentication Service
 * Handles all authentication operations using Supabase Auth
 */

import { createClient } from '@/lib/supabase/client'
import type { User, Session, AuthError } from '@supabase/supabase-js'

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  user: User | null
  session: Session | null
  error: AuthError | null
}

export interface PasswordResetResponse {
  error: AuthError | null
}

/**
 * Sign up a new user with email and password
 * Creates both an auth user and a profile record
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const supabase = createClient()

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        full_name: `${data.firstName} ${data.lastName}`,
      },
    },
  })

  if (error) {
    return { user: null, session: null, error }
  }

  // Profile will be created automatically via database trigger or RLS policy
  // The user metadata is stored in auth.users and can be synced to users_profiles

  return {
    user: authData.user,
    session: authData.session,
    error: null,
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
  const supabase = createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { user: null, session: null, error }
  }

  return {
    user: authData.user,
    session: authData.session,
    error: null,
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  return { error }
}

/**
 * Get the current session
 */
export async function getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getSession()

  return { session: data.session, error }
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  return { user: data.user, error }
}

/**
 * Request a password reset email
 */
export async function resetPassword(email: string): Promise<PasswordResetResponse> {
  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  return { error }
}

/**
 * Update user password (after reset)
 */
export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  const supabase = createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  return { error }
}

/**
 * Refresh the current session
 * This is typically handled automatically by Supabase client
 */
export async function refreshSession(): Promise<{ session: Session | null; error: AuthError | null }> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.refreshSession()

  return { session: data.session, error }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  const supabase = createClient()

  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)

  return subscription
}
