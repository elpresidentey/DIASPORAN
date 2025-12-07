/**
 * Flights API Route
 * GET /api/flights - Search and list flights with filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { getFlightsServer } from '@/lib/services/flight.service'
import { getCacheHeaders } from '@/lib/cache'
import type { FlightFilters } from '@/types/supabase'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    console.log('[Flights API] Request received:', {
      url: request.url,
      params: Object.fromEntries(searchParams.entries())
    })

    // Parse query parameters
    const filters: FlightFilters = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      origin: searchParams.get('origin') || undefined,
      destination: searchParams.get('destination') || undefined,
      departureDate: searchParams.get('departureDate') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      airline: searchParams.get('airline') || undefined,
      class: searchParams.get('class') || undefined,
      maxStops: searchParams.get('maxStops') ? parseInt(searchParams.get('maxStops')!) : undefined,
      sortBy: searchParams.get('sortBy') || 'departure_time',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
    }

    console.log('[Flights API] Filters:', filters)

    // Fetch flights
    const { data, error } = await getFlightsServer(filters)
    
    console.log('[Flights API] Service response:', {
      hasData: !!data,
      dataType: data ? typeof data : 'null',
      dataKeys: data ? Object.keys(data) : [],
      recordCount: data?.data?.length || 0,
      hasError: !!error,
      error: error
    })

    if (error) {
      console.error('[Flights API] Error from service:', error)
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

    console.log('[Flights API] Returning success response with', data?.data?.length || 0, 'flights')

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { 
        status: 200,
        headers: getCacheHeaders('FLIGHTS'),
      }
    )
  } catch (error) {
    console.error('[Flights API] Unexpected error:', error)
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


