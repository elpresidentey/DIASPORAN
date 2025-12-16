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
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isSupabaseConfigured = supabaseUrl && 
    supabaseKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseUrl.includes('xxxxxxxxx') &&
    !supabaseKey.includes('placeholder') &&
    supabaseUrl !== 'https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.supabase.co'

  if (!isSupabaseConfigured) {
    // Mock authentication - simulate successful signup
    console.log('[Auth Service] Using mock authentication - Supabase not configured')
    
    // Basic validation for mock auth
    if (!data.email || !data.email.includes('@') || !data.email.includes('.')) {
      return { 
        user: null, 
        session: null, 
        error: { 
          message: 'Please enter a valid email address',
          name: 'ValidationError',
          status: 400
        } as AuthError 
      }
    }

    if (!data.password || data.password.length < 6) {
      return { 
        user: null, 
        session: null, 
        error: { 
          message: 'Password must be at least 6 characters long',
          name: 'ValidationError',
          status: 400
        } as AuthError 
      }
    }

    if (!data.firstName || data.firstName.trim().length < 2) {
      return { 
        user: null, 
        session: null, 
        error: { 
          message: 'First name must be at least 2 characters long',
          name: 'ValidationError',
          status: 400
        } as AuthError 
      }
    }

    if (!data.lastName || data.lastName.trim().length < 2) {
      return { 
        user: null, 
        session: null, 
        error: { 
          message: 'Last name must be at least 2 characters long',
          name: 'ValidationError',
          status: 400
        } as AuthError 
      }
    }

    // Check if user already exists (in localStorage)
    if (typeof window !== 'undefined') {
      const existingUsers = localStorage.getItem('mock-auth-users')
      if (existingUsers) {
        const users = JSON.parse(existingUsers)
        if (users[data.email]) {
          return { 
            user: null, 
            session: null, 
            error: { 
              message: 'An account with this email already exists',
              name: 'UserAlreadyExistsError',
              status: 409
            } as AuthError 
          }
        }
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create mock user object
    const mockUser: User = {
      id: `mock-user-${Date.now()}`,
      aud: 'authenticated',
      role: 'authenticated',
      email: data.email,
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
        full_name: `${data.firstName} ${data.lastName}`,
      },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const mockSession: Session = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser,
    }

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock-auth-user', JSON.stringify(mockUser))
      localStorage.setItem('mock-auth-session', JSON.stringify(mockSession))
      
      // Store user in users registry
      const existingUsers = localStorage.getItem('mock-auth-users')
      const users = existingUsers ? JSON.parse(existingUsers) : {}
      users[data.email] = {
        password: data.password, // In real app, this would be hashed
        user: mockUser
      }
      localStorage.setItem('mock-auth-users', JSON.stringify(users))
    }

    return {
      user: mockUser,
      session: mockSession,
      error: null,
    }
  }

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
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isSupabaseConfigured = supabaseUrl && 
    supabaseKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseUrl.includes('xxxxxxxxx') &&
    !supabaseKey.includes('placeholder') &&
    supabaseUrl !== 'https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.supabase.co'

  if (!isSupabaseConfigured) {
    // Mock authentication - simulate successful signin
    console.log('[Auth Service] Using mock authentication - Supabase not configured')
    
    // Basic validation for mock auth
    if (!data.email || !data.email.includes('@')) {
      return { 
        user: null, 
        session: null, 
        error: { 
          message: 'Please enter a valid email address',
          name: 'ValidationError',
          status: 400
        } as AuthError 
      }
    }

    if (!data.password) {
      return { 
        user: null, 
        session: null, 
        error: { 
          message: 'Password is required',
          name: 'ValidationError',
          status: 400
        } as AuthError 
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if user exists in localStorage registry
    let mockUser: User | null = null
    let mockSession: Session | null = null
    
    if (typeof window !== 'undefined') {
      const existingUsers = localStorage.getItem('mock-auth-users')
      if (existingUsers) {
        const users = JSON.parse(existingUsers)
        const userRecord = users[data.email]
        
        if (userRecord && userRecord.password === data.password) {
          // Valid credentials - use stored user
          mockUser = userRecord.user
          
          // Update last sign in time
          if (mockUser) {
            mockUser.last_sign_in_at = new Date().toISOString()
            mockUser.updated_at = new Date().toISOString()
          }
          
          if (mockUser) {
            mockSession = {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
              expires_in: 3600,
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              token_type: 'bearer',
              user: mockUser,
            }
          }
        } else if (userRecord) {
          // User exists but wrong password
          return { 
            user: null, 
            session: null, 
            error: { 
              message: 'Invalid email or password',
              name: 'AuthenticationError',
              status: 401
            } as AuthError 
          }
        }
      }
    }
    
    // If no stored user, return error (user doesn't exist)
    if (!mockUser) {
      return { 
        user: null, 
        session: null, 
        error: { 
          message: 'No account found with this email. Please sign up first.',
          name: 'UserNotFoundError',
          status: 404
        } as AuthError 
      }
    }

    // Store current session
    if (typeof window !== 'undefined' && mockSession) {
      localStorage.setItem('mock-auth-user', JSON.stringify(mockUser))
      localStorage.setItem('mock-auth-session', JSON.stringify(mockSession))
    }

    return {
      user: mockUser,
      session: mockSession,
      error: null,
    }
  }

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
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isSupabaseConfigured = supabaseUrl && 
    supabaseKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseUrl.includes('xxxxxxxxx') &&
    !supabaseKey.includes('placeholder') &&
    supabaseUrl !== 'https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.supabase.co'

  if (!isSupabaseConfigured) {
    // Mock authentication - clear localStorage
    console.log('[Auth Service] Using mock authentication - signing out')
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock-auth-user')
      localStorage.removeItem('mock-auth-session')
    }

    return { error: null }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  return { error }
}

/**
 * Get the current session
 */
export async function getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isSupabaseConfigured = supabaseUrl && 
    supabaseKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseUrl.includes('xxxxxxxxx') &&
    !supabaseKey.includes('placeholder') &&
    supabaseUrl !== 'https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.supabase.co'

  if (!isSupabaseConfigured) {
    // Mock authentication - get from localStorage
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem('mock-auth-session')
      if (storedSession) {
        const session = JSON.parse(storedSession) as Session
        return { session, error: null }
      }
    }
    
    return { session: null, error: null }
  }

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