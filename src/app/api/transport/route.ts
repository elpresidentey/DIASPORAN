/**
 * Transport API Routes
 * GET /api/transport - Search transport options
 */

import { NextRequest, NextResponse } from 'next/server'
import { getTransportOptionsServer } from '@/lib/services/transport.service'
import { getCacheHeaders } from '@/lib/cache'
import type { TransportFilters } from '@/types/supabase'

/**
 * GET /api/transport
 * Search and filter transport options
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const filters: TransportFilters = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      origin: searchParams.get('origin') || undefined,
      destination: searchParams.get('destination') || undefined,
      date: searchParams.get('date') || undefined,
      transportType: searchParams.get('transportType') || searchParams.get('type') || undefined,
      provider: searchParams.get('provider') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      sortBy: searchParams.get('sortBy') || 'departure_time',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
    }

    const { data, error } = await getTransportOptionsServer(filters)

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
        headers: getCacheHeaders('TRANSPORT'),
      }
    )
  } catch (error) {
    console.error('Transport search error:', error)
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
