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
    
    console.log('[Flights API] Request received - UPDATED VERSION:', {
      url: request.url,
      params: Object.fromEntries(searchParams.entries()),
      timestamp: new Date().toISOString()
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
      console.log('[Flights API] Using mock data - Supabase not configured')
      
      // Return mock flight data immediately without calling Supabase service
      const mockFlights = [
        {
          id: '1',
          airline: 'British Airways',
          flight_number: 'BA075',
          origin_airport: 'LHR',
          destination_airport: 'LOS',
          departure_time: '2024-12-20T10:30:00Z',
          arrival_time: '2024-12-20T17:45:00Z',
          duration_minutes: 435,
          price: 850000,
          currency: 'NGN',
          class_type: 'Economy',
          available_seats: 45,
        },
        {
          id: '2',
          airline: 'Virgin Atlantic',
          flight_number: 'VS411',
          origin_airport: 'LHR',
          destination_airport: 'LOS',
          departure_time: '2024-12-20T14:15:00Z',
          arrival_time: '2024-12-20T21:30:00Z',
          duration_minutes: 435,
          price: 920000,
          currency: 'NGN',
          class_type: 'Economy',
          available_seats: 32,
        },
        {
          id: '3',
          airline: 'Air France',
          flight_number: 'AF878',
          origin_airport: 'CDG',
          destination_airport: 'LOS',
          departure_time: '2024-12-20T16:45:00Z',
          arrival_time: '2024-12-21T00:15:00Z',
          duration_minutes: 450,
          price: 780000,
          currency: 'NGN',
          class_type: 'Economy',
          available_seats: 28,
        },
        {
          id: '4',
          airline: 'Emirates',
          flight_number: 'EK783',
          origin_airport: 'DXB',
          destination_airport: 'LOS',
          departure_time: '2024-12-20T08:20:00Z',
          arrival_time: '2024-12-20T13:45:00Z',
          duration_minutes: 325,
          price: 1200000,
          currency: 'NGN',
          class_type: 'Business',
          available_seats: 12,
        },
        {
          id: '5',
          airline: 'Turkish Airlines',
          flight_number: 'TK1830',
          origin_airport: 'IST',
          destination_airport: 'LOS',
          departure_time: '2024-12-20T12:10:00Z',
          arrival_time: '2024-12-20T18:35:00Z',
          duration_minutes: 385,
          price: 650000,
          currency: 'NGN',
          class_type: 'Economy',
          available_seats: 67,
        },
        {
          id: '6',
          airline: 'KLM',
          flight_number: 'KL587',
          origin_airport: 'AMS',
          destination_airport: 'LOS',
          departure_time: '2024-12-20T11:25:00Z',
          arrival_time: '2024-12-20T18:50:00Z',
          duration_minutes: 445,
          price: 890000,
          currency: 'NGN',
          class_type: 'Economy',
          available_seats: 23,
        }
      ]

      // Apply basic filtering to mock data
      let filteredFlights = mockFlights

      if (filters.origin) {
        filteredFlights = filteredFlights.filter(flight => 
          flight.origin_airport.toLowerCase().includes(filters.origin!.toLowerCase())
        )
      }

      if (filters.destination) {
        filteredFlights = filteredFlights.filter(flight => 
          flight.destination_airport.toLowerCase().includes(filters.destination!.toLowerCase())
        )
      }

      if (filters.airline) {
        filteredFlights = filteredFlights.filter(flight => 
          flight.airline.toLowerCase().includes(filters.airline!.toLowerCase())
        )
      }

      if (filters.minPrice) {
        filteredFlights = filteredFlights.filter(flight => flight.price >= filters.minPrice!)
      }

      if (filters.maxPrice) {
        filteredFlights = filteredFlights.filter(flight => flight.price <= filters.maxPrice!)
      }

      const mockData = {
        data: filteredFlights,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: filteredFlights.length,
          totalPages: Math.ceil(filteredFlights.length / (filters.limit || 20)),
          hasNext: false,
          hasPrev: false,
        },
      }

      console.log('[Flights API] Returning mock data with', filteredFlights.length, 'flights')
      
      return NextResponse.json(
        {
          success: true,
          data: mockData,
        },
        { 
          status: 200,
          headers: getCacheHeaders('FLIGHTS'),
        }
      )
    }

    // Fetch flights from Supabase if configured
    console.log('[Flights API] Using Supabase - fetching real data')
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


