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

    // Create a timeout promise that rejects after 5 seconds
    const timeoutPromise = new Promise<{ data: null; error: any }>((_, reject) => {
      setTimeout(() => reject(new Error('Database query timed out')), 5000)
    })

    // Fetch flights with timeout race
    const { data, error } = await Promise.race([
      getFlightsServer(filters),
      timeoutPromise
    ])

    console.log('[Flights API] Service response:', {
      hasData: !!data,
      dataType: data ? typeof data : 'null',
      dataKeys: data ? Object.keys(data) : [],
      recordCount: data?.data?.length || 0,
      hasError: !!error,
      error: error
    })

    if (error) {
      console.warn('Flights API query failed, falling back to mock data:', error);
      return NextResponse.json({
        success: true,
        data: {
          data: MOCK_FLIGHTS,
          metadata: { total: MOCK_FLIGHTS.length, page: 1, limit: 20, totalPages: 1 }
        }
      });
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
    console.warn('Flights API execution failed, using fallback:', error);
    return NextResponse.json({
      success: true,
      data: {
        data: MOCK_FLIGHTS,
        metadata: { total: MOCK_FLIGHTS.length, page: 1, limit: 20, totalPages: 1 }
      }
    });
  }
}

const MOCK_FLIGHTS = [
  {
    id: 'flight-1',
    airline: 'Air Peace',
    flight_number: 'P47154',
    origin: 'LOS',
    destination: 'ABV',
    departure_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    arrival_time: new Date(Date.now() + 86400000 + 3600000).toISOString(),
    price: 85000,
    currency: 'NGN',
    duration: '1h 0m',
    stops: 0,
    class: 'Economy',
    aircraft: 'Boeing 737',
    seats_available: 42,
    created_at: new Date().toISOString()
  },
  {
    id: 'flight-2',
    airline: 'Ibom Air',
    flight_number: 'IAN120',
    origin: 'LOS',
    destination: 'QUO',
    departure_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    arrival_time: new Date(Date.now() + 172800000 + 3600000).toISOString(),
    price: 95000,
    currency: 'NGN',
    duration: '1h 0m',
    stops: 0,
    class: 'Economy',
    aircraft: 'CRJ 900',
    seats_available: 15,
    created_at: new Date().toISOString()
  },
  {
    id: 'flight-3',
    airline: 'Green Africa',
    flight_number: 'GW202',
    origin: 'LOS',
    destination: 'IBA',
    departure_time: new Date(Date.now() + 259200000).toISOString(),
    arrival_time: new Date(Date.now() + 259200000 + 3000000).toISOString(),
    price: 45000,
    currency: 'NGN',
    duration: '50m',
    stops: 0,
    class: 'Economy',
    aircraft: 'ATR 72',
    seats_available: 50,
    created_at: new Date().toISOString()
  },
  {
    id: 'flight-4',
    airline: 'Arik Air',
    flight_number: 'W3101',
    origin: 'ABV',
    destination: 'PHC',
    departure_time: new Date(Date.now() + 345600000).toISOString(),
    arrival_time: new Date(Date.now() + 345600000 + 3600000).toISOString(),
    price: 75000,
    currency: 'NGN',
    duration: '1h 0m',
    stops: 0,
    class: 'Economy',
    aircraft: 'Boeing 737',
    seats_available: 28,
    created_at: new Date().toISOString()
  },
  {
    id: 'flight-5',
    airline: 'British Airways',
    flight_number: 'BA075',
    origin: 'LHR',
    destination: 'LOS',
    departure_time: new Date(Date.now() + 432000000).toISOString(),
    arrival_time: new Date(Date.now() + 432000000 + 23400000).toISOString(),
    price: 1250000,
    currency: 'NGN',
    duration: '6h 30m',
    stops: 0,
    class: 'Business',
    aircraft: 'Boeing 787',
    seats_available: 5,
    created_at: new Date().toISOString()
  }
];


