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

    // Create a timeout promise that rejects after 5 seconds
    const timeoutPromise = new Promise<{ data: null; error: any }>((_, reject) => {
      setTimeout(() => reject(new Error('Database query timed out')), 5000)
    })

    // Fetch events with timeout race
    const { data, error } = await Promise.race([
      getEventsServer(filters),
      timeoutPromise
    ])

    if (error) {
      console.warn('Events API query failed, falling back to mock data:', error);
      return NextResponse.json({
        success: true,
        data: {
          data: MOCK_EVENTS,
          metadata: { total: MOCK_EVENTS.length, page: 1, limit: 20, totalPages: 1 }
        }
      });
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
    console.error('Events API execution failed, using fallback:', error)
    return NextResponse.json(
      {
        success: true,
        data: {
          data: MOCK_EVENTS,
          metadata: { total: MOCK_EVENTS.length, page: 1, limit: 20, totalPages: 1 }
        }
      },
      { status: 200 }
    )
  }
}

const MOCK_EVENTS = [
  {
    id: 'evt-1',
    title: 'Afro Nation Festival',
    description: 'The world\'s biggest Afrobeats festival returns to Lagos for an unforgettable experience.',
    location: 'Tafawa Balewa Square, Lagos',
    city: 'Lagos',
    country: 'Nigeria',
    start_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    price: 45000,
    currency: 'NGN',
    image_url: 'https://images.unsplash.com/photo-1459749411177-287ce3274392?q=80&w=2070&auto=format&fit=crop',
    category: 'Music',
    organizer_id: 'org-1',
    available_tickets: 5000,
    created_at: new Date().toISOString()
  },
  {
    id: 'evt-2',
    title: 'Lagos Fashion Week',
    description: 'Showcasing the best of African fashion design and creativity.',
    location: 'Eko Hotel & Suites, Lagos',
    city: 'Lagos',
    country: 'Nigeria',
    start_date: new Date(Date.now() + 86400000 * 10).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 13).toISOString(),
    price: 25000,
    currency: 'NGN',
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2076&auto=format&fit=crop',
    category: 'Fashion',
    organizer_id: 'org-2',
    available_tickets: 1200,
    created_at: new Date().toISOString()
  },
  {
    id: 'evt-3',
    title: 'Tech Fest 2024',
    description: 'Connecting innovators, startups, and investors in the African tech ecosystem.',
    location: 'Landmark Centre, Lagos',
    city: 'Lagos',
    country: 'Nigeria',
    start_date: new Date(Date.now() + 86400000 * 15).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 16).toISOString(),
    price: 15000,
    currency: 'NGN',
    image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop',
    category: 'Technology',
    organizer_id: 'org-3',
    available_tickets: 3000,
    created_at: new Date().toISOString()
  },
  {
    id: 'evt-4',
    title: 'Taste of Nigeria Food Festival',
    description: 'A culinary journey through the diverse flavors of Nigerian cuisine.',
    location: 'Muri Okunola Park, Lagos',
    city: 'Lagos',
    country: 'Nigeria',
    start_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    price: 5000,
    currency: 'NGN',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop',
    category: 'Food & Drink',
    organizer_id: 'org-4',
    available_tickets: 2000,
    created_at: new Date().toISOString()
  }
];
