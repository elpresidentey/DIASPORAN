/**
 * Supabase Utility Functions
 * 
 * Common utilities for working with Supabase client and handling responses
 */

import type { PostgrestError } from '@supabase/supabase-js'

/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

/**
 * Handles Supabase errors and converts them to standardized API responses
 * 
 * @param error - Supabase error object
 * @returns Standardized error response
 */
export function handleSupabaseError(error: PostgrestError | Error | null): ApiResponse<never> {
  if (!error) {
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred'
      }
    }
  }

  // Handle PostgrestError (database errors)
  if ('code' in error && 'message' in error && 'details' in error) {
    const pgError = error as PostgrestError
    return {
      success: false,
      error: {
        code: pgError.code,
        message: pgError.message,
        details: pgError.details
      }
    }
  }

  // Handle generic Error
  return {
    success: false,
    error: {
      code: 'ERROR',
      message: error.message
    }
  }
}

/**
 * Creates a success response
 * 
 * @param data - Response data
 * @returns Standardized success response
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data
  }
}

/**
 * Creates an error response
 * 
 * @param code - Error code
 * @param message - Error message
 * @param details - Optional error details
 * @returns Standardized error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: any
): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  }
}

/**
 * Validates environment variables for Supabase
 * 
 * @throws Error if required environment variables are missing
 */
export function validateSupabaseEnv(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  )

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Supabase environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    )
  }
}

/**
 * Gets the Supabase URL from environment variables
 * 
 * @returns Supabase URL
 * @throws Error if NEXT_PUBLIC_SUPABASE_URL is not set
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  return url
}

/**
 * Gets the Supabase anon key from environment variables
 * 
 * @returns Supabase anon key
 * @throws Error if NEXT_PUBLIC_SUPABASE_ANON_KEY is not set
 */
export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  }
  return key
}
