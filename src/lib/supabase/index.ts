/**
 * Supabase Client Exports
 * 
 * Central export point for all Supabase-related utilities
 */

export { createClient } from './client'
export { createServerClient } from './server'
export { createMiddlewareClient } from './middleware'
export {
  handleSupabaseError,
  createSuccessResponse,
  createErrorResponse,
  validateSupabaseEnv,
  getSupabaseUrl,
  getSupabaseAnonKey,
  type ApiResponse
} from './utils'
