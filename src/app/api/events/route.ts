/**
 * Events API Route
 * GET /api/events - Get paginated list of events with filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { getEventsServer } from '@/lib/services/event.service'
import { getCacheHeaders } from '@/lib/cache'
import type { EventFilters } from '@/types/supabase'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    console.log('[Events API] Request received:', {
      url: request.url,
      params: Object.fromEntries(searchParams.entries()),
      timestamp: new Date().toISOString()
    })

    // Parse filters from query parameters
    const filters: EventFilters = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      city: searchParams.get('city') || undefined,
      country: searchParams.get('country') || undefined,
      category: searchParams.get('category') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      hasAvailability: searchParams.get('hasAvailability') === 'true' || undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      sortBy: searchParams.get('sortBy') || 'start_date',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
    }

    console.log('[Events API] Filters:', filters)

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
      console.log('[Events API] Using mock data - Supabase not configured')
      
      // Return mock event data
      const mockEvents = [
        {
          id: '1',
          title: 'Detty December Lagos Festival',
          description: 'The biggest end-of-year celebration in Lagos featuring top Afrobeats artists, food, and entertainment.',
          category: 'Music & Entertainment',
          start_date: '2024-12-28T18:00:00Z',
          end_date: '2024-12-29T02:00:00Z',
          location: 'Eko Atlantic City',
          city: 'Lagos',
          country: 'Nigeria',
          capacity: 50000,
          available_spots: 15000,
          ticket_types: [
            { id: '1', name: 'General Admission', price: 25000 },
            { id: '2', name: 'VIP', price: 75000 }
          ],
          images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop'],
          average_rating: 4.8,
          total_reviews: 342,
        },
        {
          id: '2',
          title: 'New Year Eve Gala Dinner',
          description: 'Elegant New Year Eve dinner with live jazz music and premium dining experience.',
          category: 'Food & Dining',
          start_date: '2024-12-31T19:00:00Z',
          end_date: '2025-01-01T01:00:00Z',
          location: 'Four Points by Sheraton',
          city: 'Lagos',
          country: 'Nigeria',
          capacity: 200,
          available_spots: 45,
          ticket_types: [
            { id: '1', name: 'Standard', price: 75000 },
            { id: '2', name: 'Premium', price: 120000 }
          ],
          images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop'],
          average_rating: 4.9,
          total_reviews: 156,
        },
        {
          id: '3',
          title: 'Lagos Tech Conference 2024',
          description: 'Annual technology conference bringing together innovators, entrepreneurs, and tech leaders.',
          category: 'Business & Professional',
          start_date: '2024-12-20T09:00:00Z',
          end_date: '2024-12-20T17:00:00Z',
          location: 'Lagos Continental Hotel',
          city: 'Lagos',
          country: 'Nigeria',
          capacity: 500,
          available_spots: 120,
          ticket_types: [
            { id: '1', name: 'Regular', price: 15000 },
            { id: '2', name: 'Student', price: 8000 }
          ],
          images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'],
          average_rating: 4.7,
          total_reviews: 289,
        },
        {
          id: '4',
          title: 'Afrobeats Dance Workshop',
          description: 'Learn authentic Afrobeats dance moves from professional choreographers.',
          category: 'Arts & Culture',
          start_date: '2024-12-22T14:00:00Z',
          end_date: '2024-12-22T17:00:00Z',
          location: 'Terra Kulture',
          city: 'Lagos',
          country: 'Nigeria',
          capacity: 50,
          available_spots: 25,
          ticket_types: [
            { id: '1', name: 'Workshop Pass', price: 8000 }
          ],
          images: ['https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=2070&auto=format&fit=crop'],
          average_rating: 4.6,
          total_reviews: 78,
        },
        {
          id: '5',
          title: 'Lagos Food Festival',
          description: 'Celebrate Nigerian cuisine with food tastings, cooking demonstrations, and cultural performances.',
          category: 'Food & Dining',
          start_date: '2024-12-25T12:00:00Z',
          end_date: '2024-12-25T20:00:00Z',
          location: 'Freedom Park',
          city: 'Lagos',
          country: 'Nigeria',
          capacity: 2000,
          available_spots: 800,
          ticket_types: [
            { id: '1', name: 'Entry Pass', price: 5000 }
          ],
          images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop'],
          average_rating: 4.5,
          total_reviews: 234,
        },
        {
          id: '6',
          title: 'Startup Pitch Competition',
          description: 'Young entrepreneurs pitch their innovative ideas to investors and industry experts.',
          category: 'Business & Professional',
          start_date: '2024-12-21T10:00:00Z',
          end_date: '2024-12-21T16:00:00Z',
          location: 'Co-Creation Hub',
          city: 'Lagos',
          country: 'Nigeria',
          capacity: 300,
          available_spots: 150,
          ticket_types: [
            { id: '1', name: 'Free Entry', price: 0 }
          ],
          images: ['https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop'],
          average_rating: 4.4,
          total_reviews: 167,
        }
      ]

      // Apply basic filtering to mock data
      let filteredEvents = mockEvents

      if (filters.city) {
        filteredEvents = filteredEvents.filter(event => 
          event.city.toLowerCase().includes(filters.city!.toLowerCase())
        )
      }

      if (filters.country) {
        filteredEvents = filteredEvents.filter(event => 
          event.country.toLowerCase().includes(filters.country!.toLowerCase())
        )
      }

      if (filters.category) {
        filteredEvents = filteredEvents.filter(event => 
          event.category.toLowerCase().includes(filters.category!.toLowerCase())
        )
      }

      if (filters.rating) {
        filteredEvents = filteredEvents.filter(event => event.rating >= filters.rating!)
      }

      if (filters.hasAvailability) {
        filteredEvents = filteredEvents.filter(event => event.available_tickets > 0)
      }

      if (filters.startDate) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.start_date) >= new Date(filters.startDate!)
        )
      }

      if (filters.endDate) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.end_date) <= new Date(filters.endDate!)
        )
      }

      const mockData = {
        data: filteredEvents,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: filteredEvents.length,
          totalPages: Math.ceil(filteredEvents.length / (filters.limit || 20)),
          hasNext: false,
          hasPrev: false,
        },
      }

      console.log('[Events API] Returning mock data with', filteredEvents.length, 'events')
      
      return NextResponse.json(
        {
          success: true,
          data: mockData,
        },
        { 
          status: 200,
          headers: getCacheHeaders('EVENTS'),
        }
      )
    }

    // Fetch events from Supabase if configured
    console.log('[Events API] Using Supabase - fetching real data')
    const { data, error } = await getEventsServer(filters)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        { status: error.code === 'NOT_FOUND' ? 404 : 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
        headers: getCacheHeaders('EVENTS'),
      }
    )
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  }
}

