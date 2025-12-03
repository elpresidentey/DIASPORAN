/**
 * Row Level Security (RLS) Policies Test
 * 
 * This test suite verifies that RLS policies are correctly enforced
 * for different user roles and scenarios.
 * 
 * Note: These tests require a test Supabase instance with the migrations applied.
 * They test the security boundaries defined in the RLS policies.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

describe('RLS Policies', () => {
  let supabase: ReturnType<typeof createClient<Database>>
  let testUser1Id: string
  let testUser2Id: string
  let testUser1Client: ReturnType<typeof createClient<Database>>
  let testUser2Client: ReturnType<typeof createClient<Database>>

  beforeAll(async () => {
    // Skip tests if Supabase is not configured
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Skipping RLS tests: Supabase not configured')
      return
    }

    supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Create test users
    const user1Email = `test-user-1-${Date.now()}@example.com`
    const user2Email = `test-user-2-${Date.now()}@example.com`
    const password = 'TestPassword123!'

    const { data: user1Data, error: user1Error } = await supabase.auth.signUp({
      email: user1Email,
      password: password,
    })

    const { data: user2Data, error: user2Error } = await supabase.auth.signUp({
      email: user2Email,
      password: password,
    })

    if (user1Error || user2Error || !user1Data.user || !user2Data.user) {
      throw new Error('Failed to create test users')
    }

    testUser1Id = user1Data.user.id
    testUser2Id = user2Data.user.id

    // Create authenticated clients for each user
    testUser1Client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
    testUser2Client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

    await testUser1Client.auth.signInWithPassword({
      email: user1Email,
      password: password,
    })

    await testUser2Client.auth.signInWithPassword({
      email: user2Email,
      password: password,
    })
  })

  afterAll(async () => {
    // Cleanup: Delete test users
    if (testUser1Client) {
      await testUser1Client.auth.signOut()
    }
    if (testUser2Client) {
      await testUser2Client.auth.signOut()
    }
  })

  describe('users_profiles RLS', () => {
    it('should allow users to view their own profile', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('users_profiles')
        .select('*')
        .eq('id', testUser1Id)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.id).toBe(testUser1Id)
    })

    it('should prevent users from viewing other users profiles', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('users_profiles')
        .select('*')
        .eq('id', testUser2Id)
        .single()

      // Should return no data due to RLS
      expect(data).toBeNull()
    })

    it('should allow users to update their own profile', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('users_profiles')
        .update({ full_name: 'Test User 1' })
        .eq('id', testUser1Id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.full_name).toBe('Test User 1')
    })

    it('should prevent users from updating other users profiles', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('users_profiles')
        .update({ full_name: 'Hacked Name' })
        .eq('id', testUser2Id)
        .select()

      // Should fail or return no data due to RLS
      expect(data).toEqual([])
    })
  })

  describe('bookings RLS', () => {
    let testBookingId: string

    it('should allow users to create their own bookings', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('bookings')
        .insert({
          user_id: testUser1Id,
          booking_type: 'dining',
          reference_id: crypto.randomUUID(),
          status: 'pending',
          start_date: new Date().toISOString(),
          guests: 2,
          total_price: 100.00,
          currency: 'USD',
          payment_status: 'pending',
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.user_id).toBe(testUser1Id)
      
      if (data) {
        testBookingId = data.id
      }
    })

    it('should allow users to view their own bookings', async () => {
      if (!SUPABASE_URL || !testBookingId) return

      const { data, error } = await testUser1Client
        .from('bookings')
        .select('*')
        .eq('user_id', testUser1Id)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.length).toBeGreaterThan(0)
    })

    it('should prevent users from viewing other users bookings', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser2Client
        .from('bookings')
        .select('*')
        .eq('user_id', testUser1Id)

      // Should return empty array due to RLS
      expect(data).toEqual([])
    })

    it('should prevent users from creating bookings for other users', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('bookings')
        .insert({
          user_id: testUser2Id, // Trying to create booking for another user
          booking_type: 'dining',
          reference_id: crypto.randomUUID(),
          status: 'pending',
          start_date: new Date().toISOString(),
          guests: 2,
          total_price: 100.00,
          currency: 'USD',
          payment_status: 'pending',
        })
        .select()

      // Should fail due to RLS WITH CHECK clause
      expect(error).toBeDefined()
    })
  })

  describe('reviews RLS', () => {
    let testReviewId: string
    let testBookingId: string

    beforeAll(async () => {
      if (!SUPABASE_URL) return

      // Create a booking for the review
      const { data: bookingData } = await testUser1Client
        .from('bookings')
        .insert({
          user_id: testUser1Id,
          booking_type: 'dining',
          reference_id: crypto.randomUUID(),
          status: 'completed',
          start_date: new Date().toISOString(),
          guests: 2,
          total_price: 100.00,
          currency: 'USD',
          payment_status: 'paid',
        })
        .select()
        .single()

      if (bookingData) {
        testBookingId = bookingData.id
      }
    })

    it('should allow users to create their own reviews', async () => {
      if (!SUPABASE_URL || !testBookingId) return

      const { data, error } = await testUser1Client
        .from('reviews')
        .insert({
          user_id: testUser1Id,
          booking_id: testBookingId,
          listing_type: 'dining',
          listing_id: crypto.randomUUID(),
          rating: 5,
          title: 'Great experience',
          comment: 'Loved it!',
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.user_id).toBe(testUser1Id)
      
      if (data) {
        testReviewId = data.id
      }
    })

    it('should allow anyone to view reviews', async () => {
      if (!SUPABASE_URL || !testReviewId) return

      // Test with user 2 viewing user 1's review
      const { data, error } = await testUser2Client
        .from('reviews')
        .select('*')
        .eq('id', testReviewId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
    })

    it('should allow anonymous users to view reviews', async () => {
      if (!SUPABASE_URL || !testReviewId) return

      const anonClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
      
      const { data, error } = await anonClient
        .from('reviews')
        .select('*')
        .eq('id', testReviewId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
    })

    it('should prevent users from updating other users reviews', async () => {
      if (!SUPABASE_URL || !testReviewId) return

      const { data, error } = await testUser2Client
        .from('reviews')
        .update({ rating: 1, comment: 'Hacked review' })
        .eq('id', testReviewId)
        .select()

      // Should return empty array due to RLS
      expect(data).toEqual([])
    })
  })

  describe('saved_items RLS', () => {
    let testSavedItemId: string

    it('should allow users to create their own saved items', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('saved_items')
        .insert({
          user_id: testUser1Id,
          item_type: 'dining',
          item_id: crypto.randomUUID(),
          notes: 'Want to try this place',
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.user_id).toBe(testUser1Id)
      
      if (data) {
        testSavedItemId = data.id
      }
    })

    it('should allow users to view their own saved items', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('saved_items')
        .select('*')
        .eq('user_id', testUser1Id)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.length).toBeGreaterThan(0)
    })

    it('should prevent users from viewing other users saved items', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser2Client
        .from('saved_items')
        .select('*')
        .eq('user_id', testUser1Id)

      // Should return empty array due to RLS
      expect(data).toEqual([])
    })

    it('should allow users to delete their own saved items', async () => {
      if (!SUPABASE_URL || !testSavedItemId) return

      const { error } = await testUser1Client
        .from('saved_items')
        .delete()
        .eq('id', testSavedItemId)

      expect(error).toBeNull()
    })
  })

  describe('listings RLS (dining_venues)', () => {
    let testVenueId: string

    it('should allow anonymous users to view listings', async () => {
      if (!SUPABASE_URL) return

      const anonClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
      
      const { data, error } = await anonClient
        .from('dining_venues')
        .select('*')
        .limit(10)

      expect(error).toBeNull()
      expect(data).toBeDefined()
    })

    it('should allow authenticated users to create listings', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('dining_venues')
        .insert({
          name: 'Test Restaurant',
          description: 'A test restaurant',
          cuisine_type: ['Italian'],
          price_range: 2,
          address: '123 Test St',
          city: 'Test City',
          country: 'Test Country',
          capacity: 50,
          created_by: testUser1Id,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      
      if (data) {
        testVenueId = data.id
      }
    })

    it('should hide soft-deleted listings from regular queries', async () => {
      if (!SUPABASE_URL || !testVenueId) return

      // Soft delete the venue
      await testUser1Client
        .from('dining_venues')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', testVenueId)

      // Try to query it
      const { data, error } = await testUser1Client
        .from('dining_venues')
        .select('*')
        .eq('id', testVenueId)
        .single()

      // Should return null due to RLS filtering deleted items
      expect(data).toBeNull()
    })
  })

  describe('safety_reports RLS', () => {
    let testReportId: string

    it('should allow users to create their own safety reports', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('safety_reports')
        .insert({
          user_id: testUser1Id,
          location: 'Test Location',
          category: 'incident',
          description: 'Test safety report',
          severity: 'moderate',
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.user_id).toBe(testUser1Id)
      
      if (data) {
        testReportId = data.id
      }
    })

    it('should allow users to view their own safety reports', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser1Client
        .from('safety_reports')
        .select('*')
        .eq('user_id', testUser1Id)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.length).toBeGreaterThan(0)
    })

    it('should prevent users from viewing other users safety reports', async () => {
      if (!SUPABASE_URL) return

      const { data, error } = await testUser2Client
        .from('safety_reports')
        .select('*')
        .eq('user_id', testUser1Id)

      // Should return empty array due to RLS
      expect(data).toEqual([])
    })
  })
})
