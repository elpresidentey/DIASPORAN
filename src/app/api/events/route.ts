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

