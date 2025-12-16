/**
export const dynamic = 'force-dynamic';
 * Transport API Routes
 * GET /api/transport - Search transport options
 */

import { NextRequest, NextResponse } from 'next/server'
import { getTransportOptionsServer } from '@/lib/services/transport.service'
import { getCacheHeaders } from '@/lib/cache'

export const dynamic = 'force-dynamic';
import type { TransportFilters } from '@/types/supabase'

/**
 * GET /api/transport
 * Search and filter transport options
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    console.log('[Transport API] Request received:', {
      url: request.url,
      params: Object.fromEntries(searchParams.entries()),
      timestamp: new Date().toISOString()
    })

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

    console.log('[Transport API] Filters:', filters)

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
      console.log('[Transport API] Using mock data - Supabase not configured')
      
      // Return mock transport data
      const mockTransport = [
        {
          id: '1',
          provider: 'Uber',
          transport_type: 'Ride Share',
          origin: 'Murtala Muhammed Airport',
          destination: 'Victoria Island',
          departure_time: '2024-12-20T10:00:00Z',
          arrival_time: '2024-12-20T10:45:00Z',
          duration_minutes: 45,
          price: 8500,
          currency: 'NGN',
          vehicle_type: 'UberX',
          capacity: 4,
          amenities: ['Air Conditioning', 'GPS Tracking', 'Mobile Payment'],
          rating: 4.7,
          available: true,
        },
        {
          id: '2',
          provider: 'Bolt',
          transport_type: 'Ride Share',
          origin: 'Murtala Muhammed Airport',
          destination: 'Victoria Island',
          departure_time: '2024-12-20T10:05:00Z',
          arrival_time: '2024-12-20T10:50:00Z',
          duration_minutes: 45,
          price: 7800,
          currency: 'NGN',
          vehicle_type: 'Bolt',
          capacity: 4,
          amenities: ['Air Conditioning', 'GPS Tracking', 'Mobile Payment'],
          rating: 4.6,
          available: true,
        },
        {
          id: '3',
          provider: 'Lagos BRT',
          transport_type: 'Bus',
          origin: 'Ikorodu',
          destination: 'TBS',
          departure_time: '2024-12-20T07:30:00Z',
          arrival_time: '2024-12-20T08:45:00Z',
          duration_minutes: 75,
          price: 400,
          currency: 'NGN',
          vehicle_type: 'BRT Bus',
          capacity: 60,
          amenities: ['Air Conditioning', 'WiFi', 'CCTV'],
          rating: 4.2,
          available: true,
        },
        {
          id: '4',
          provider: 'ABC Transport',
          transport_type: 'Interstate Bus',
          origin: 'Lagos',
          destination: 'Abuja',
          departure_time: '2024-12-20T08:00:00Z',
          arrival_time: '2024-12-20T16:00:00Z',
          duration_minutes: 480,
          price: 12000,
          currency: 'NGN',
          vehicle_type: 'Luxury Bus',
          capacity: 40,
          amenities: ['Air Conditioning', 'WiFi', 'Entertainment', 'Refreshments'],
          rating: 4.4,
          available: true,
        },
        {
          id: '5',
          provider: 'Arik Air',
          transport_type: 'Flight',
          origin: 'Lagos (LOS)',
          destination: 'Abuja (ABV)',
          departure_time: '2024-12-20T14:30:00Z',
          arrival_time: '2024-12-20T15:45:00Z',
          duration_minutes: 75,
          price: 85000,
          currency: 'NGN',
          vehicle_type: 'Boeing 737',
          capacity: 150,
          amenities: ['In-flight Service', 'Baggage Allowance', 'Priority Boarding'],
          rating: 4.3,
          available: true,
        },
        {
          id: '6',
          provider: 'Lagos Ferry',
          transport_type: 'Ferry',
          origin: 'Marina',
          destination: 'Ikorodu',
          departure_time: '2024-12-20T09:00:00Z',
          arrival_time: '2024-12-20T10:30:00Z',
          duration_minutes: 90,
          price: 1500,
          currency: 'NGN',
          vehicle_type: 'Ferry Boat',
          capacity: 200,
          amenities: ['Life Jackets', 'Scenic Views', 'Refreshments'],
          rating: 4.1,
          available: true,
        }
      ]

      // Apply basic filtering to mock data
      let filteredTransport = mockTransport

      if (filters.origin) {
        filteredTransport = filteredTransport.filter(transport => 
          transport.origin.toLowerCase().includes(filters.origin!.toLowerCase())
        )
      }

      if (filters.destination) {
        filteredTransport = filteredTransport.filter(transport => 
          transport.destination.toLowerCase().includes(filters.destination!.toLowerCase())
        )
      }

      if (filters.transportType) {
        filteredTransport = filteredTransport.filter(transport => 
          transport.transport_type.toLowerCase().includes(filters.transportType!.toLowerCase())
        )
      }

      if (filters.provider) {
        filteredTransport = filteredTransport.filter(transport => 
          transport.provider.toLowerCase().includes(filters.provider!.toLowerCase())
        )
      }

      if (filters.minPrice) {
        filteredTransport = filteredTransport.filter(transport => transport.price >= filters.minPrice!)
      }

      if (filters.maxPrice) {
        filteredTransport = filteredTransport.filter(transport => transport.price <= filters.maxPrice!)
      }

      const mockData = {
        data: filteredTransport,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: filteredTransport.length,
          totalPages: Math.ceil(filteredTransport.length / (filters.limit || 20)),
          hasNext: false,
          hasPrev: false,
        },
      }

      console.log('[Transport API] Returning mock data with', filteredTransport.length, 'transport options')
      
      return NextResponse.json(
        {
          success: true,
          data: mockData,
        },
        { 
          status: 200,
          headers: getCacheHeaders('TRANSPORT'),
        }
      )
    }

    // Fetch transport options from Supabase if configured
    console.log('[Transport API] Using Supabase - fetching real data')
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


