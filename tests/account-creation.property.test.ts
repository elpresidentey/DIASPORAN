/**
 * Property-Based Test: Account Creation
 * 
 * **Feature: backend-api-implementation, Property 1: Account creation succeeds for valid credentials**
 * **Validates: Requirements 1.1**
 * 
 * Property: For any valid registration credentials (email, password meeting requirements), 
 * creating an account should succeed and return a user ID.
 * 
 * This test uses property-based testing to verify that the account creation process
 * works correctly across a wide range of valid input combinations.
 */

import { describe, it, expect, afterEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import * as fc from 'fast-check'
import { signUp } from '@/lib/services/auth.service'

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Skip tests if Supabase is not configured
const skipTests = !SUPABASE_URL || !SUPABASE_ANON_KEY

// Track created users for cleanup
const createdUserIds: string[] = []

describe('Property 1: Account creation succeeds for valid credentials', () => {
  afterEach(async () => {
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

  it('Property: Valid credentials result in successful account creation with user ID', async () => {
    if (skipTests) {
      console.warn('Skipping account creation property test: Supabase not configured')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        // Generate valid email addresses
        fc.record({
          emailPrefix: fc.stringMatching(/^[a-z0-9]{5,20}$/),
          emailDomain: fc.constantFrom('example.com', 'test.com', 'demo.com'),
          firstName: fc.stringMatching(/^[A-Z][a-z]{2,15}$/),
          lastName: fc.stringMatching(/^[A-Z][a-z]{2,15}$/),
          // Generate valid passwords (min 8 chars, with uppercase, lowercase, number)
          passwordLength: fc.integer({ min: 8, max: 20 }),
          passwordChars: fc.array(
            fc.oneof(
              fc.char().filter(c => /[a-z]/.test(c)),
              fc.char().filter(c => /[A-Z]/.test(c)),
              fc.char().filter(c => /[0-9]/.test(c)),
              fc.constantFrom('!', '@', '#', '$', '%', '^', '&', '*')
            ),
            { minLength: 8, maxLength: 20 }
          ),
        }),
        async ({ emailPrefix, emailDomain, firstName, lastName, passwordChars }) => {
          // Construct unique email with timestamp to avoid conflicts
          const timestamp = Date.now()
          const randomSuffix = Math.random().toString(36).substring(7)
          const email = `${emailPrefix}-${timestamp}-${randomSuffix}@${emailDomain}`
          
          // Ensure password has required complexity
          const hasLower = passwordChars.some(c => /[a-z]/.test(c))
          const hasUpper = passwordChars.some(c => /[A-Z]/.test(c))
          const hasNumber = passwordChars.some(c => /[0-9]/.test(c))
          
          // If password doesn't meet requirements, add required characters
          let password = passwordChars.join('')
          if (!hasLower) password += 'a'
          if (!hasUpper) password += 'A'
          if (!hasNumber) password += '1'
          
          // Ensure minimum length
          while (password.length < 8) {
            password += 'Aa1!'
          }

          // Call the signUp function
          const result = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          // Property: Valid credentials should result in successful account creation
          expect(result.error).toBeNull()
          expect(result.user).toBeDefined()
          expect(result.user).not.toBeNull()
          
          // User should have an ID
          expect(result.user?.id).toBeDefined()
          expect(typeof result.user?.id).toBe('string')
          expect(result.user?.id.length).toBeGreaterThan(0)
          
          // User email should match what was provided
          expect(result.user?.email).toBe(email)
          
          // User metadata should contain the provided names
          expect(result.user?.user_metadata?.first_name).toBe(firstName)
          expect(result.user?.user_metadata?.last_name).toBe(lastName)
          expect(result.user?.user_metadata?.full_name).toBe(`${firstName} ${lastName}`)

          // Track user for cleanup
          if (result.user?.id) {
            createdUserIds.push(result.user.id)
          }
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design
    )
  })

  it('Property: Account creation with minimal valid data succeeds', async () => {
    if (skipTests) {
      console.warn('Skipping account creation property test: Supabase not configured')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          emailPrefix: fc.stringMatching(/^[a-z]{3,10}$/),
          firstName: fc.stringMatching(/^[A-Z][a-z]{1,5}$/),
          lastName: fc.stringMatching(/^[A-Z][a-z]{1,5}$/),
        }),
        async ({ emailPrefix, firstName, lastName }) => {
          // Create minimal valid credentials
          const timestamp = Date.now()
          const randomSuffix = Math.random().toString(36).substring(7)
          const email = `${emailPrefix}-${timestamp}-${randomSuffix}@test.com`
          const password = 'Pass123!' // Minimal valid password

          // Call the signUp function
          const result = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          // Property: Minimal valid credentials should succeed
          expect(result.error).toBeNull()
          expect(result.user).toBeDefined()
          expect(result.user).not.toBeNull()
          expect(result.user?.id).toBeDefined()
          expect(result.user?.email).toBe(email)

          // Track user for cleanup
          if (result.user?.id) {
            createdUserIds.push(result.user.id)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property: Account creation with various name formats succeeds', async () => {
    if (skipTests) {
      console.warn('Skipping account creation property test: Supabase not configured')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          emailPrefix: fc.stringMatching(/^[a-z0-9]{5,15}$/),
          // Test various name formats including special characters
          firstName: fc.oneof(
            fc.stringMatching(/^[A-Z][a-z]{2,10}$/),
            fc.stringMatching(/^[A-Z][a-z]{2,5}-[A-Z][a-z]{2,5}$/), // Hyphenated
            fc.stringMatching(/^[A-Z][a-z]{2,5} [A-Z][a-z]{2,5}$/), // Two-part
          ),
          lastName: fc.oneof(
            fc.stringMatching(/^[A-Z][a-z]{2,10}$/),
            fc.stringMatching(/^[A-Z][a-z]{2,5}-[A-Z][a-z]{2,5}$/), // Hyphenated
            fc.stringMatching(/^[A-Z]'[A-Z][a-z]{2,5}$/), // With apostrophe
          ),
        }),
        async ({ emailPrefix, firstName, lastName }) => {
          const timestamp = Date.now()
          const randomSuffix = Math.random().toString(36).substring(7)
          const email = `${emailPrefix}-${timestamp}-${randomSuffix}@example.com`
          const password = 'SecurePass123!'

          // Call the signUp function
          const result = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          // Property: Various valid name formats should succeed
          expect(result.error).toBeNull()
          expect(result.user).toBeDefined()
          expect(result.user).not.toBeNull()
          expect(result.user?.id).toBeDefined()
          expect(result.user?.user_metadata?.first_name).toBe(firstName)
          expect(result.user?.user_metadata?.last_name).toBe(lastName)

          // Track user for cleanup
          if (result.user?.id) {
            createdUserIds.push(result.user.id)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property: Account creation with long passwords succeeds', async () => {
    if (skipTests) {
      console.warn('Skipping account creation property test: Supabase not configured')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          emailPrefix: fc.stringMatching(/^[a-z0-9]{5,10}$/),
          firstName: fc.stringMatching(/^[A-Z][a-z]{2,10}$/),
          lastName: fc.stringMatching(/^[A-Z][a-z]{2,10}$/),
          passwordLength: fc.integer({ min: 20, max: 50 }),
        }),
        async ({ emailPrefix, firstName, lastName, passwordLength }) => {
          const timestamp = Date.now()
          const randomSuffix = Math.random().toString(36).substring(7)
          const email = `${emailPrefix}-${timestamp}-${randomSuffix}@test.com`
          
          // Generate a long, complex password
          const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
          let password = 'Aa1!' // Start with required chars
          for (let i = 4; i < passwordLength; i++) {
            password += chars[Math.floor(Math.random() * chars.length)]
          }

          // Call the signUp function
          const result = await signUp({
            email,
            password,
            firstName,
            lastName,
          })

          // Property: Long valid passwords should succeed
          expect(result.error).toBeNull()
          expect(result.user).toBeDefined()
          expect(result.user).not.toBeNull()
          expect(result.user?.id).toBeDefined()

          // Track user for cleanup
          if (result.user?.id) {
            createdUserIds.push(result.user.id)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
