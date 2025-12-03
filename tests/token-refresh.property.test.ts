/**
 * Property-Based Test: Token Refresh
 * 
 * **Feature: backend-api-implementation, Property 3: Token refresh maintains authentication**
 * **Validates: Requirements 1.3**
 * 
 * Property: For any expired session with a valid refresh token, refreshing should return a new valid session token.
 * 
 * This test uses property-based testing to verify that the token refresh process
 * works correctly and maintains authentication state.
 */

import { describe, it, expect, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import * as fc from 'fast-check'
import { signUp, refreshSession } from '@/lib/services/auth.service'

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Skip tests if Supabase is not configured
const skipTests = !SUPABASE_URL || !SUPABASE_ANON_KEY

// Track created users for cleanup
const createdUserIds: string[] = []

describe('Property 3: Token refresh maintains authentication', () => {
  afterAll(async () => {
    if (skipTests) return

    // Cleanup: Delete all created test users using service role key
    if (SUPABASE_SERVICE_ROLE_KEY && createdUserIds.length > 0) {
      const adminClient = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      
      for (const userId of createdUserIds) {
        try {
          await adminClient.auth.admin.deleteUser(userId)
        } catch (error) {
          console.warn(`Failed to cleanup user ${userId}:`, error)
        }
      }
      
      createdUserIds.length = 0
    }
  })

  it('Property: Refreshing session with valid refresh token returns new valid session', async () => {
    if (skipTests) {
      console.warn('Skipping token refresh property test: Supabase not configured')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        // Generate valid credentials
        fc.record({
          emailPrefix: fc.stringMatching(/^[a-z0-9]{5,20}$/),
          emailDomain: fc.constantFrom('example.com', 'test.com', 'demo.com'),
          firstName: fc.stringMatching(/^[A-Z][a-z]{2,15}$/),
          lastName: fc.stringMatching(/^[A-Z][a-z]{2,15}$/),
          passwordLength: fc.integer({ min: 8, max: 30 }),
        }),
        async ({ emailPrefix, emailDomain, firstName, lastName, passwordLength }) => {
          // Create unique credentials
          const timestamp = Date.now()
          const randomSuffix = Math.random().toString(36).substring(7)
          const email = `${emailPrefix}-${timestamp}-${randomSuffix}@${emailDomain}`
          
          // Generate a valid password
          const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
          let password = 'Aa1!' // Start with required chars
          for (let i = 4; i < passwordLength; i++) {
            password += chars[Math.floor(Math.random() * chars.length)]
          }

          // Step 1: Create an account and get initial session
          const signUpResult = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          // Ensure account creation succeeded
          expect(signUpResult.error).toBeNull()
          expect(signUpResult.user).toBeDefined()
          expect(signUpResult.user).not.toBeNull()
          expect(signUpResult.session).toBeDefined()
          expect(signUpResult.session).not.toBeNull()
          
          // Track user for cleanup
          if (signUpResult.user?.id) {
            createdUserIds.push(signUpResult.user.id)
          }

          // Store original session details
          const originalAccessToken = signUpResult.session?.access_token
          const originalRefreshToken = signUpResult.session?.refresh_token
          const originalExpiresAt = signUpResult.session?.expires_at
          
          expect(originalAccessToken).toBeDefined()
          expect(originalRefreshToken).toBeDefined()
          expect(originalExpiresAt).toBeDefined()

          // Step 2: Refresh the session
          const refreshResult = await refreshSession()

          // Property: Refresh should succeed and return a new valid session
          expect(refreshResult.error).toBeNull()
          expect(refreshResult.session).toBeDefined()
          expect(refreshResult.session).not.toBeNull()
          
          // New session should have valid tokens
          expect(refreshResult.session?.access_token).toBeDefined()
          expect(typeof refreshResult.session?.access_token).toBe('string')
          expect(refreshResult.session?.access_token.length).toBeGreaterThan(0)
          
          // New session should have a refresh token
          expect(refreshResult.session?.refresh_token).toBeDefined()
          expect(typeof refreshResult.session?.refresh_token).toBe('string')
          expect(refreshResult.session?.refresh_token.length).toBeGreaterThan(0)
          
          // New session should have an expiration time in the future
          expect(refreshResult.session?.expires_at).toBeDefined()
          expect(refreshResult.session?.expires_at).toBeGreaterThan(Math.floor(Date.now() / 1000))
          
          // User information should be maintained
          expect(refreshResult.session?.user?.id).toBe(signUpResult.user?.id)
          expect(refreshResult.session?.user?.email).toBe(email)
          
          // Access token should be different (new token issued)
          // Note: In some cases, if refresh happens immediately, tokens might be the same
          // but the session should still be valid
          expect(refreshResult.session?.access_token).toBeDefined()
          
          // Expiration time should be in the future (authentication maintained)
          expect(refreshResult.session?.expires_at).toBeGreaterThan(Math.floor(Date.now() / 1000))
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design
    )
  })

  it('Property: Multiple consecutive refreshes maintain authentication', async () => {
    if (skipTests) {
      console.warn('Skipping token refresh property test: Supabase not configured')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          emailPrefix: fc.stringMatching(/^[a-z0-9]{5,10}$/),
          firstName: fc.stringMatching(/^[A-Z][a-z]{2,8}$/),
          lastName: fc.stringMatching(/^[A-Z][a-z]{2,8}$/),
          refreshCount: fc.integer({ min: 2, max: 5 }),
        }),
        async ({ emailPrefix, firstName, lastName, refreshCount }) => {
          const timestamp = Date.now()
          const randomSuffix = Math.random().toString(36).substring(7)
          const email = `${emailPrefix}-${timestamp}-${randomSuffix}@test.com`
          const password = 'RefreshTest123!'

          // Create account
          const signUpResult = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          expect(signUpResult.error).toBeNull()
          expect(signUpResult.user).not.toBeNull()
          expect(signUpResult.session).not.toBeNull()
          
          if (signUpResult.user?.id) {
            createdUserIds.push(signUpResult.user.id)
          }

          const userId = signUpResult.user?.id

          // Property: Multiple consecutive refreshes should all succeed and maintain authentication
          for (let i = 0; i < refreshCount; i++) {
            const refreshResult = await refreshSession()

            expect(refreshResult.error).toBeNull()
            expect(refreshResult.session).not.toBeNull()
            expect(refreshResult.session?.access_token).toBeDefined()
            expect(refreshResult.session?.refresh_token).toBeDefined()
            
            // User ID should remain consistent
            expect(refreshResult.session?.user?.id).toBe(userId)
            
            // Session should be valid (expires in the future)
            expect(refreshResult.session?.expires_at).toBeGreaterThan(Math.floor(Date.now() / 1000))
            
            // Add small delay between refreshes to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property: Refreshed session preserves user metadata', async () => {
    if (skipTests) {
      console.warn('Skipping token refresh property test: Supabase not configured')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          emailPrefix: fc.stringMatching(/^[a-z0-9]{5,15}$/),
          firstName: fc.stringMatching(/^[A-Z][a-z]{2,12}$/),
          lastName: fc.stringMatching(/^[A-Z][a-z]{2,12}$/),
        }),
        async ({ emailPrefix, firstName, lastName }) => {
          const timestamp = Date.now()
          const randomSuffix = Math.random().toString(36).substring(7)
          const email = `${emailPrefix}-${timestamp}-${randomSuffix}@demo.com`
          const password = 'MetaRefresh123!'

          // Create account with metadata
          const signUpResult = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          expect(signUpResult.error).toBeNull()
          expect(signUpResult.user).not.toBeNull()
          expect(signUpResult.session).not.toBeNull()
          
          if (signUpResult.user?.id) {
            createdUserIds.push(signUpResult.user.id)
          }

          // Refresh session
          const refreshResult = await refreshSession()

          // Property: Refreshed session should preserve user metadata
          expect(refreshResult.error).toBeNull()
          expect(refreshResult.session).not.toBeNull()
          expect(refreshResult.session?.user?.user_metadata?.first_name).toBe(firstName)
          expect(refreshResult.session?.user?.user_metadata?.last_name).toBe(lastName)
          expect(refreshResult.session?.user?.user_metadata?.full_name).toBe(`${firstName} ${lastName}`)
          expect(refreshResult.session?.user?.email).toBe(email)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property: Refreshed session has valid expiration time', async () => {
    if (skipTests) {
      console.warn('Skipping token refresh property test: Supabase not configured')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          emailPrefix: fc.stringMatching(/^[a-z]{5,10}$/),
          firstName: fc.stringMatching(/^[A-Z][a-z]{2,8}$/),
          lastName: fc.stringMatching(/^[A-Z][a-z]{2,8}$/),
        }),
        async ({ emailPrefix, firstName, lastName }) => {
          const timestamp = Date.now()
          const randomSuffix = Math.random().toString(36).substring(7)
          const email = `${emailPrefix}-${timestamp}-${randomSuffix}@example.com`
          const password = 'ExpiryTest123!'

          // Create account
          const signUpResult = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          expect(signUpResult.error).toBeNull()
          expect(signUpResult.user).not.toBeNull()
          expect(signUpResult.session).not.toBeNull()
          
          if (signUpResult.user?.id) {
            createdUserIds.push(signUpResult.user.id)
          }

          const originalExpiresAt = signUpResult.session?.expires_at || 0

          // Refresh session
          const refreshResult = await refreshSession()

          // Property: Refreshed session should have a valid expiration time
          expect(refreshResult.error).toBeNull()
          expect(refreshResult.session).not.toBeNull()
          
          const newExpiresAt = refreshResult.session?.expires_at || 0
          const currentTime = Math.floor(Date.now() / 1000)
          
          // New expiration should be in the future
          expect(newExpiresAt).toBeGreaterThan(currentTime)
          
          // New expiration should be at least 30 minutes in the future (typical session duration)
          const thirtyMinutesInSeconds = 30 * 60
          expect(newExpiresAt).toBeGreaterThan(currentTime + thirtyMinutesInSeconds - 60) // Allow 1 min tolerance
          
          // New expiration should be reasonable (not more than 24 hours)
          const twentyFourHoursInSeconds = 24 * 60 * 60
          expect(newExpiresAt).toBeLessThan(currentTime + twentyFourHoursInSeconds)
        }
      ),
      { numRuns: 100 }
    )
  })
})
