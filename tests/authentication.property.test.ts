/**
 * Property-Based Test: Authentication
 * 
 * **Feature: backend-api-implementation, Property 2: Valid credentials authenticate successfully**
 * **Validates: Requirements 1.2**
 * 
 * Property: For any user with valid credentials, login should return a valid session token.
 * 
 * This test uses property-based testing to verify that the authentication process
 * works correctly across a wide range of valid credential combinations.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import * as fc from 'fast-check'
import { signUp, signIn } from '@/lib/services/auth.service'

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Skip tests if Supabase is not configured
const skipTests = !SUPABASE_URL || !SUPABASE_ANON_KEY

// Track created users for cleanup
const createdUserIds: string[] = []

describe('Property 2: Valid credentials authenticate successfully', () => {
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

  it('Property: Valid credentials result in successful authentication with session token', async () => {
    if (skipTests) {
      console.warn('Skipping authentication property test: Supabase not configured')
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

          // Step 1: Create an account
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
          
          // Track user for cleanup
          if (signUpResult.user?.id) {
            createdUserIds.push(signUpResult.user.id)
          }

          // Step 2: Sign in with the same credentials
          const signInResult = await signIn({
            email,
            password,
          })

          // Property: Valid credentials should authenticate successfully
          expect(signInResult.error).toBeNull()
          expect(signInResult.user).toBeDefined()
          expect(signInResult.user).not.toBeNull()
          
          // User should have an ID matching the created account
          expect(signInResult.user?.id).toBe(signUpResult.user?.id)
          expect(signInResult.user?.email).toBe(email)
          
          // Session should be present and valid
          expect(signInResult.session).toBeDefined()
          expect(signInResult.session).not.toBeNull()
          expect(signInResult.session?.access_token).toBeDefined()
          expect(typeof signInResult.session?.access_token).toBe('string')
          expect(signInResult.session?.access_token.length).toBeGreaterThan(0)
          
          // Session should have a refresh token
          expect(signInResult.session?.refresh_token).toBeDefined()
          expect(typeof signInResult.session?.refresh_token).toBe('string')
          expect(signInResult.session?.refresh_token.length).toBeGreaterThan(0)
          
          // Session should have an expiration time in the future
          expect(signInResult.session?.expires_at).toBeDefined()
          expect(signInResult.session?.expires_at).toBeGreaterThan(Math.floor(Date.now() / 1000))
          
          // User in session should match authenticated user
          expect(signInResult.session?.user?.id).toBe(signInResult.user?.id)
          expect(signInResult.session?.user?.email).toBe(email)
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design
    )
  })

  it('Property: Authentication with various password complexities succeeds', async () => {
    if (skipTests) {
      console.warn('Skipping authentication property test: Supabase not configured')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          emailPrefix: fc.stringMatching(/^[a-z]{5,10}$/),
          firstName: fc.stringMatching(/^[A-Z][a-z]{2,8}$/),
          lastName: fc.stringMatching(/^[A-Z][a-z]{2,8}$/),
          // Test different password patterns
          passwordPattern: fc.oneof(
            fc.constant('Aa1!'), // Minimal
            fc.constant('SecurePass123!'), // Medium
            fc.constant('VeryLongAndComplexPassword123!@#'), // Long
            fc.constant('P@ssw0rd!2024'), // With special chars
          ),
        }),
        async ({ emailPrefix, firstName, lastName, passwordPattern }) => {
          const timestamp = Date.now()
          const randomSuffix = Math.random().toString(36).substring(7)
          const email = `${emailPrefix}-${timestamp}-${randomSuffix}@test.com`
          const password = passwordPattern

          // Create account
          const signUpResult = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          expect(signUpResult.error).toBeNull()
          expect(signUpResult.user).not.toBeNull()
          
          if (signUpResult.user?.id) {
            createdUserIds.push(signUpResult.user.id)
          }

          // Authenticate with the same credentials
          const signInResult = await signIn({
            email,
            password,
          })

          // Property: Authentication should succeed regardless of password complexity
          expect(signInResult.error).toBeNull()
          expect(signInResult.user).not.toBeNull()
          expect(signInResult.session).not.toBeNull()
          expect(signInResult.session?.access_token).toBeDefined()
          expect(signInResult.user?.id).toBe(signUpResult.user?.id)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property: Multiple authentication attempts with same credentials succeed', async () => {
    if (skipTests) {
      console.warn('Skipping authentication property test: Supabase not configured')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          emailPrefix: fc.stringMatching(/^[a-z0-9]{5,10}$/),
          firstName: fc.stringMatching(/^[A-Z][a-z]{2,8}$/),
          lastName: fc.stringMatching(/^[A-Z][a-z]{2,8}$/),
          attemptCount: fc.integer({ min: 2, max: 5 }),
        }),
        async ({ emailPrefix, firstName, lastName, attemptCount }) => {
          const timestamp = Date.now()
          const randomSuffix = Math.random().toString(36).substring(7)
          const email = `${emailPrefix}-${timestamp}-${randomSuffix}@example.com`
          const password = 'TestPass123!'

          // Create account
          const signUpResult = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          expect(signUpResult.error).toBeNull()
          expect(signUpResult.user).not.toBeNull()
          
          if (signUpResult.user?.id) {
            createdUserIds.push(signUpResult.user.id)
          }

          // Property: Multiple authentication attempts should all succeed
          for (let i = 0; i < attemptCount; i++) {
            const signInResult = await signIn({
              email,
              password,
            })

            expect(signInResult.error).toBeNull()
            expect(signInResult.user).not.toBeNull()
            expect(signInResult.session).not.toBeNull()
            expect(signInResult.session?.access_token).toBeDefined()
            expect(signInResult.user?.id).toBe(signUpResult.user?.id)
            
            // Each authentication should provide a valid session
            expect(signInResult.session?.expires_at).toBeGreaterThan(Math.floor(Date.now() / 1000))
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property: Authentication preserves user metadata', async () => {
    if (skipTests) {
      console.warn('Skipping authentication property test: Supabase not configured')
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
          const password = 'MetaPass123!'

          // Create account with metadata
          const signUpResult = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          expect(signUpResult.error).toBeNull()
          expect(signUpResult.user).not.toBeNull()
          
          if (signUpResult.user?.id) {
            createdUserIds.push(signUpResult.user.id)
          }

          // Authenticate
          const signInResult = await signIn({
            email,
            password,
          })

          // Property: Authentication should preserve user metadata
          expect(signInResult.error).toBeNull()
          expect(signInResult.user).not.toBeNull()
          expect(signInResult.user?.user_metadata?.first_name).toBe(firstName)
          expect(signInResult.user?.user_metadata?.last_name).toBe(lastName)
          expect(signInResult.user?.user_metadata?.full_name).toBe(`${firstName} ${lastName}`)
        }
      ),
      { numRuns: 100 }
    )
  })
})
