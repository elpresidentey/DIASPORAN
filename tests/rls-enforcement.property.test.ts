/**
 * Property-Based Test: RLS Enforcement
 * 
 * **Feature: backend-api-implementation, Property 37: Row-level security enforced**
 * **Validates: Requirements 13.2**
 * 
 * Property: For any database query, users should only access records they are authorized 
 * to view based on RLS policies.
 * 
 * This test uses property-based testing to verify that RLS policies correctly enforce
 * data access rules across different tables, users, and operations.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import * as fc from 'fast-check'

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Skip tests if Supabase is not configured
const skipTests = !SUPABASE_URL || !SUPABASE_ANON_KEY

describe('Property 37: Row-level security enforced', () => {
  let supabase: ReturnType<typeof createClient<Database>>
  let testUser1Id: string
  let testUser2Id: string
  let testUser1Client: ReturnType<typeof createClient<Database>>
  let testUser2Client: ReturnType<typeof createClient<Database>>
  let testUser1Email: string
  let testUser2Email: string

  beforeAll(async () => {
    if (skipTests) {
      console.warn('Skipping RLS property tests: Supabase not configured')
      return
    }

    supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Create test users with unique emails
    testUser1Email = `test-rls-user-1-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`
    testUser2Email = `test-rls-user-2-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`
    const password = 'TestPassword123!'

    const { data: user1Data, error: user1Error } = await supabase.auth.signUp({
      email: testUser1Email,
      password: password,
    })

    const { data: user2Data, error: user2Error } = await supabase.auth.signUp({
      email: testUser2Email,
      password: password,
    })

    if (user1Error || user2Error || !user1Data.user || !user2Data.user) {
      console.error('User creation errors:', { user1Error, user2Error })
      throw new Error('Failed to create test users')
    }

    testUser1Id = user1Data.user.id
    testUser2Id = user2Data.user.id

    // Create authenticated clients for each user
    testUser1Client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
    testUser2Client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

    const { error: signIn1Error } = await testUser1Client.auth.signInWithPassword({
      email: testUser1Email,
      password: password,
    })

    const { error: signIn2Error } = await testUser2Client.auth.signInWithPassword({
      email: testUser2Email,
      password: password,
    })

    if (signIn1Error || signIn2Error) {
      console.error('Sign in errors:', { signIn1Error, signIn2Error })
      throw new Error('Failed to sign in test users')
    }
  })

  afterAll(async () => {
    if (skipTests) return

    // Cleanup: Sign out test users
    if (testUser1Client) {
      await testUser1Client.auth.signOut()
    }
    if (testUser2Client) {
      await testUser2Client.auth.signOut()
    }
  })

  it('Property: Users can only access their own user-scoped records', async () => {
    if (skipTests) return

    await fc.assert(
      fc.asyncProperty(
        // Generate random data for user-scoped tables
        fc.record({
          table: fc.constantFrom('bookings', 'saved_items', 'safety_reports'),
          operation: fc.constantFrom('select', 'insert', 'update', 'delete'),
          guests: fc.integer({ min: 1, max: 10 }),
          price: fc.double({ min: 10, max: 1000, noNaN: true }),
          notes: fc.string({ minLength: 0, maxLength: 100 }),
        }),
        async ({ table, operation, guests, price, notes }) => {
          let recordId: string | undefined

          // Test INSERT: User 1 creates a record
          if (operation === 'insert' || operation === 'select' || operation === 'update' || operation === 'delete') {
            if (table === 'bookings') {
              const { data, error } = await testUser1Client
                .from('bookings')
                .insert({
                  user_id: testUser1Id,
                  booking_type: 'dining',
                  reference_id: crypto.randomUUID(),
                  status: 'pending',
                  start_date: new Date().toISOString(),
                  guests: guests,
                  total_price: price,
                  currency: 'USD',
                  payment_status: 'pending',
                })
                .select()
                .single()

              expect(error).toBeNull()
              expect(data).toBeDefined()
              expect(data?.user_id).toBe(testUser1Id)
              recordId = data?.id
            } else if (table === 'saved_items') {
              const { data, error } = await testUser1Client
                .from('saved_items')
                .insert({
                  user_id: testUser1Id,
                  item_type: 'dining',
                  item_id: crypto.randomUUID(),
                  notes: notes,
                })
                .select()
                .single()

              expect(error).toBeNull()
              expect(data).toBeDefined()
              expect(data?.user_id).toBe(testUser1Id)
              recordId = data?.id
            } else if (table === 'safety_reports') {
              const { data, error } = await testUser1Client
                .from('safety_reports')
                .insert({
                  user_id: testUser1Id,
                  location: 'Test Location',
                  category: 'incident',
                  description: notes || 'Test report',
                  severity: 'moderate',
                })
                .select()
                .single()

              expect(error).toBeNull()
              expect(data).toBeDefined()
              expect(data?.user_id).toBe(testUser1Id)
              recordId = data?.id
            }
          }

          // Test SELECT: User 2 should NOT be able to view User 1's records
          if (recordId && (operation === 'select' || operation === 'update' || operation === 'delete')) {
            if (table === 'bookings') {
              const { data, error } = await testUser2Client
                .from('bookings')
                .select('*')
                .eq('id', recordId)
                .single()

              // RLS should prevent access - data should be null
              expect(data).toBeNull()
            } else if (table === 'saved_items') {
              const { data, error } = await testUser2Client
                .from('saved_items')
                .select('*')
                .eq('id', recordId)
                .single()

              // RLS should prevent access - data should be null
              expect(data).toBeNull()
            } else if (table === 'safety_reports') {
              const { data, error } = await testUser2Client
                .from('safety_reports')
                .select('*')
                .eq('id', recordId)
                .single()

              // RLS should prevent access - data should be null
              expect(data).toBeNull()
            }
          }

          // Test UPDATE: User 2 should NOT be able to update User 1's records
          if (recordId && operation === 'update') {
            if (table === 'bookings') {
              const { data, error } = await testUser2Client
                .from('bookings')
                .update({ guests: 99 })
                .eq('id', recordId)
                .select()

              // RLS should prevent update - data should be empty array
              expect(data).toEqual([])
            } else if (table === 'saved_items') {
              const { data, error } = await testUser2Client
                .from('saved_items')
                .update({ notes: 'Hacked' })
                .eq('id', recordId)
                .select()

              // RLS should prevent update - data should be empty array
              expect(data).toEqual([])
            } else if (table === 'safety_reports') {
              const { data, error } = await testUser2Client
                .from('safety_reports')
                .update({ description: 'Hacked' })
                .eq('id', recordId)
                .select()

              // RLS should prevent update - data should be empty array
              expect(data).toEqual([])
            }
          }

          // Test DELETE: User 2 should NOT be able to delete User 1's records
          if (recordId && operation === 'delete') {
            if (table === 'bookings') {
              const { error } = await testUser2Client
                .from('bookings')
                .delete()
                .eq('id', recordId)

              // Verify record still exists by querying with User 1
              const { data: verifyData } = await testUser1Client
                .from('bookings')
                .select('*')
                .eq('id', recordId)
                .single()

              // Record should still exist
              expect(verifyData).toBeDefined()
              expect(verifyData?.id).toBe(recordId)
            } else if (table === 'saved_items') {
              const { error } = await testUser2Client
                .from('saved_items')
                .delete()
                .eq('id', recordId)

              // Verify record still exists by querying with User 1
              const { data: verifyData } = await testUser1Client
                .from('saved_items')
                .select('*')
                .eq('id', recordId)
                .single()

              // Record should still exist
              expect(verifyData).toBeDefined()
              expect(verifyData?.id).toBe(recordId)
            } else if (table === 'safety_reports') {
              const { error } = await testUser2Client
                .from('safety_reports')
                .delete()
                .eq('id', recordId)

              // Verify record still exists by querying with User 1
              const { data: verifyData } = await testUser1Client
                .from('safety_reports')
                .select('*')
                .eq('id', recordId)
                .single()

              // Record should still exist
              expect(verifyData).toBeDefined()
              expect(verifyData?.id).toBe(recordId)
            }
          }

          // Cleanup: Delete the record with User 1
          if (recordId) {
            if (table === 'bookings') {
              await testUser1Client.from('bookings').delete().eq('id', recordId)
            } else if (table === 'saved_items') {
              await testUser1Client.from('saved_items').delete().eq('id', recordId)
            } else if (table === 'safety_reports') {
              await testUser1Client.from('safety_reports').delete().eq('id', recordId)
            }
          }
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design
    )
  })

  it('Property: Users cannot create records with other users IDs', async () => {
    if (skipTests) return

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          table: fc.constantFrom('bookings', 'saved_items', 'reviews', 'safety_reports'),
          guests: fc.integer({ min: 1, max: 10 }),
          price: fc.double({ min: 10, max: 1000, noNaN: true }),
          rating: fc.integer({ min: 1, max: 5 }),
        }),
        async ({ table, guests, price, rating }) => {
          // User 1 tries to create a record with User 2's ID
          if (table === 'bookings') {
            const { data, error } = await testUser1Client
              .from('bookings')
              .insert({
                user_id: testUser2Id, // Trying to impersonate User 2
                booking_type: 'dining',
                reference_id: crypto.randomUUID(),
                status: 'pending',
                start_date: new Date().toISOString(),
                guests: guests,
                total_price: price,
                currency: 'USD',
                payment_status: 'pending',
              })
              .select()

            // RLS WITH CHECK should prevent this
            expect(error).toBeDefined()
            expect(data).toBeNull()
          } else if (table === 'saved_items') {
            const { data, error } = await testUser1Client
              .from('saved_items')
              .insert({
                user_id: testUser2Id, // Trying to impersonate User 2
                item_type: 'dining',
                item_id: crypto.randomUUID(),
              })
              .select()

            // RLS WITH CHECK should prevent this
            expect(error).toBeDefined()
            expect(data).toBeNull()
          } else if (table === 'reviews') {
            // First create a booking for User 1
            const { data: bookingData } = await testUser1Client
              .from('bookings')
              .insert({
                user_id: testUser1Id,
                booking_type: 'dining',
                reference_id: crypto.randomUUID(),
                status: 'completed',
                start_date: new Date().toISOString(),
                guests: 2,
                total_price: 100,
                currency: 'USD',
                payment_status: 'paid',
              })
              .select()
              .single()

            if (bookingData) {
              const { data, error } = await testUser1Client
                .from('reviews')
                .insert({
                  user_id: testUser2Id, // Trying to impersonate User 2
                  booking_id: bookingData.id,
                  listing_type: 'dining',
                  listing_id: crypto.randomUUID(),
                  rating: rating,
                  title: 'Test',
                  comment: 'Test',
                })
                .select()

              // RLS WITH CHECK should prevent this
              expect(error).toBeDefined()
              expect(data).toBeNull()

              // Cleanup
              await testUser1Client.from('bookings').delete().eq('id', bookingData.id)
            }
          } else if (table === 'safety_reports') {
            const { data, error } = await testUser1Client
              .from('safety_reports')
              .insert({
                user_id: testUser2Id, // Trying to impersonate User 2
                location: 'Test',
                category: 'incident',
                description: 'Test',
                severity: 'moderate',
              })
              .select()

            // RLS WITH CHECK should prevent this
            expect(error).toBeDefined()
            expect(data).toBeNull()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property: Anonymous users can only read public data', async () => {
    if (skipTests) return

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('dining_venues', 'accommodations', 'events', 'flights', 'transport_options', 'reviews', 'safety_information'),
        async (table) => {
          const anonClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

          // Anonymous users should be able to read public listings
          if (table === 'dining_venues') {
            const { data, error } = await anonClient
              .from('dining_venues')
              .select('*')
              .limit(5)

            expect(error).toBeNull()
            expect(data).toBeDefined()
          } else if (table === 'accommodations') {
            const { data, error } = await anonClient
              .from('accommodations')
              .select('*')
              .limit(5)

            expect(error).toBeNull()
            expect(data).toBeDefined()
          } else if (table === 'events') {
            const { data, error } = await anonClient
              .from('events')
              .select('*')
              .limit(5)

            expect(error).toBeNull()
            expect(data).toBeDefined()
          } else if (table === 'flights') {
            const { data, error } = await anonClient
              .from('flights')
              .select('*')
              .limit(5)

            expect(error).toBeNull()
            expect(data).toBeDefined()
          } else if (table === 'transport_options') {
            const { data, error } = await anonClient
              .from('transport_options')
              .select('*')
              .limit(5)

            expect(error).toBeNull()
            expect(data).toBeDefined()
          } else if (table === 'reviews') {
            const { data, error } = await anonClient
              .from('reviews')
              .select('*')
              .limit(5)

            expect(error).toBeNull()
            expect(data).toBeDefined()
          } else if (table === 'safety_information') {
            const { data, error } = await anonClient
              .from('safety_information')
              .select('*')
              .limit(5)

            expect(error).toBeNull()
            expect(data).toBeDefined()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property: Anonymous users cannot access user-scoped data', async () => {
    if (skipTests) return

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('bookings', 'saved_items', 'safety_reports', 'users_profiles'),
        async (table) => {
          const anonClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

          // Anonymous users should NOT be able to read user-scoped data
          // (except users_profiles which has a special policy for public viewing)
          if (table === 'bookings') {
            const { data, error } = await anonClient
              .from('bookings')
              .select('*')
              .limit(5)

            // Should return empty array or error
            expect(data).toEqual([])
          } else if (table === 'saved_items') {
            const { data, error } = await anonClient
              .from('saved_items')
              .select('*')
              .limit(5)

            // Should return empty array or error
            expect(data).toEqual([])
          } else if (table === 'safety_reports') {
            const { data, error } = await anonClient
              .from('safety_reports')
              .select('*')
              .limit(5)

            // Should return empty array or error
            expect(data).toEqual([])
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property: Soft-deleted listings are not visible to regular queries', async () => {
    if (skipTests) return

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          table: fc.constantFrom('dining_venues', 'accommodations', 'events'),
          name: fc.string({ minLength: 5, maxLength: 50 }),
          city: fc.string({ minLength: 3, maxLength: 30 }),
        }),
        async ({ table, name, city }) => {
          let recordId: string | undefined

          // Create a listing
          if (table === 'dining_venues') {
            const { data } = await testUser1Client
              .from('dining_venues')
              .insert({
                name: name,
                description: 'Test venue',
                cuisine_type: ['Test'],
                price_range: 2,
                address: '123 Test St',
                city: city,
                country: 'Test Country',
                capacity: 50,
                created_by: testUser1Id,
              })
              .select()
              .single()

            recordId = data?.id
          } else if (table === 'accommodations') {
            const { data } = await testUser1Client
              .from('accommodations')
              .insert({
                name: name,
                description: 'Test accommodation',
                property_type: 'hotel',
                address: '123 Test St',
                city: city,
                country: 'Test Country',
                bedrooms: 2,
                bathrooms: 1,
                max_guests: 4,
                price_per_night: 100,
                currency: 'USD',
                created_by: testUser1Id,
              })
              .select()
              .single()

            recordId = data?.id
          } else if (table === 'events') {
            const { data } = await testUser1Client
              .from('events')
              .insert({
                title: name,
                description: 'Test event',
                category: 'entertainment',
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 86400000).toISOString(),
                location: 'Test Location',
                address: '123 Test St',
                city: city,
                country: 'Test Country',
                capacity: 100,
                available_spots: 100,
                organizer_id: testUser1Id,
              })
              .select()
              .single()

            recordId = data?.id
          }

          if (recordId) {
            // Soft delete the listing
            if (table === 'dining_venues') {
              await testUser1Client
                .from('dining_venues')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', recordId)
            } else if (table === 'accommodations') {
              await testUser1Client
                .from('accommodations')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', recordId)
            } else if (table === 'events') {
              await testUser1Client
                .from('events')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', recordId)
            }

            // Try to query the soft-deleted listing
            if (table === 'dining_venues') {
              const { data } = await testUser1Client
                .from('dining_venues')
                .select('*')
                .eq('id', recordId)
                .single()

              // RLS should filter out soft-deleted items
              expect(data).toBeNull()
            } else if (table === 'accommodations') {
              const { data } = await testUser1Client
                .from('accommodations')
                .select('*')
                .eq('id', recordId)
                .single()

              // RLS should filter out soft-deleted items
              expect(data).toBeNull()
            } else if (table === 'events') {
              const { data } = await testUser1Client
                .from('events')
                .select('*')
                .eq('id', recordId)
                .single()

              // RLS should filter out soft-deleted items
              expect(data).toBeNull()
            }

            // Cleanup: Hard delete the record
            if (table === 'dining_venues') {
              await supabase.from('dining_venues').delete().eq('id', recordId)
            } else if (table === 'accommodations') {
              await supabase.from('accommodations').delete().eq('id', recordId)
            } else if (table === 'events') {
              await supabase.from('events').delete().eq('id', recordId)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
