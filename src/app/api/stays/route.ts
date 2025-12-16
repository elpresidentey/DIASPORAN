/**
 * Accommodations API Route
 * GET /api/stays - Get paginated list of accommodations with filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAccommodationsServer } from '@/lib/services/accommodation.service'
import { getCacheHeaders } from '@/lib/cache'
import type { AccommodationFilters } from '@/types/supabase'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    console.log('[Stays API] Request received:', {
      url: request.url,
      params: Object.fromEntries(searchParams.entries()),
      timestamp: new Date().toISOString()
    })

    // Parse query parameters
    const filters: AccommodationFilters = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      city: searchParams.get('city') || undefined,
      country: searchParams.get('country') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      sortBy: searchParams.get('sortBy') || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      checkIn: searchParams.get('checkIn') || undefined,
      checkOut: searchParams.get('checkOut') || undefined,
      guests: searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : undefined,
      bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
      bathrooms: searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      amenities: searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : undefined,
    }

    console.log('[Stays API] Filters:', filters)

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
      console.log('[Stays API] Using mock data - Supabase not configured')
      
      // Return mock accommodation data
      const mockStays = [
        {
          id: '1',
          name: 'Luxury Apartment in Victoria Island',
          description: 'Modern 2-bedroom apartment with stunning lagoon views in the heart of Lagos business district.',
          city: 'Lagos',
          country: 'Nigeria',
          property_type: 'Apartment',
          bedrooms: 2,
          bathrooms: 2,
          max_guests: 4,
          price_per_night: 45000,
          currency: 'NGN',
          amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Pool', 'Gym', 'Security'],
          images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'],
          average_rating: 4.8,
          total_reviews: 127,
        },
        {
          id: '2',
          name: 'Cozy Guesthouse in Lekki',
          description: 'Comfortable guesthouse perfect for business travelers, close to major tech companies.',
          city: 'Lagos',
          country: 'Nigeria',
          property_type: 'Guesthouse',
          bedrooms: 1,
          bathrooms: 1,
          max_guests: 2,
          price_per_night: 28000,
          currency: 'NGN',
          amenities: ['WiFi', 'Air Conditioning', 'Breakfast', 'Parking', 'Security'],
          images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'],
          average_rating: 4.5,
          total_reviews: 89,
        },
        {
          id: '3',
          name: 'Executive Suite in Ikoyi',
          description: 'Premium executive suite with panoramic city views and world-class amenities.',
          city: 'Lagos',
          country: 'Nigeria',
          property_type: 'Hotel Suite',
          bedrooms: 1,
          bathrooms: 1,
          max_guests: 2,
          price_per_night: 75000,
          currency: 'NGN',
          amenities: ['WiFi', 'Air Conditioning', 'Room Service', 'Spa', 'Concierge', 'Valet'],
          images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop'],
          average_rating: 4.9,
          total_reviews: 203,
        },
        {
          id: '4',
          name: 'Family Villa in Banana Island',
          description: 'Spacious 4-bedroom villa with private pool, perfect for families and groups.',
          city: 'Lagos',
          country: 'Nigeria',
          property_type: 'Villa',
          bedrooms: 4,
          bathrooms: 3,
          max_guests: 8,
          price_per_night: 120000,
          currency: 'NGN',
          amenities: ['WiFi', 'Air Conditioning', 'Private Pool', 'Garden', 'BBQ', 'Security'],
          images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop'],
          average_rating: 4.7,
          total_reviews: 156,
        },
        {
          id: '5',
          name: 'Budget-Friendly Room in Surulere',
          description: 'Clean and comfortable accommodation for budget-conscious travelers.',
          city: 'Lagos',
          country: 'Nigeria',
          property_type: 'Room',
          bedrooms: 1,
          bathrooms: 1,
          max_guests: 2,
          price_per_night: 15000,
          currency: 'NGN',
          amenities: ['WiFi', 'Air Conditioning', 'Shared Kitchen', 'Security'],
          images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2058&auto=format&fit=crop'],
          average_rating: 4.2,
          total_reviews: 67,
        },
        {
          id: '6',
          name: 'Boutique Hotel in Ikeja',
          description: 'Stylish boutique hotel room near Murtala Muhammed Airport, perfect for transit stays.',
          city: 'Lagos',
          country: 'Nigeria',
          property_type: 'Hotel Room',
          bedrooms: 1,
          bathrooms: 1,
          max_guests: 2,
          price_per_night: 35000,
          currency: 'NGN',
          amenities: ['WiFi', 'Air Conditioning', 'Airport Shuttle', 'Restaurant', 'Gym'],
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074&auto=format&fit=crop'],
          average_rating: 4.6,
          total_reviews: 134,
        }
      ]

      // Apply basic filtering to mock data
      let filteredStays = mockStays

      if (filters.city) {
        filteredStays = filteredStays.filter(stay => 
          stay.city.toLowerCase().includes(filters.city!.toLowerCase())
        )
      }

      if (filters.country) {
        filteredStays = filteredStays.filter(stay => 
          stay.country.toLowerCase().includes(filters.country!.toLowerCase())
        )
      }

      if (filters.minPrice) {
        filteredStays = filteredStays.filter(stay => stay.price_per_night >= filters.minPrice!)
      }

      if (filters.maxPrice) {
        filteredStays = filteredStays.filter(stay => stay.price_per_night <= filters.maxPrice!)
      }

      if (filters.rating) {
        filteredStays = filteredStays.filter(stay => stay.average_rating >= filters.rating!)
      }

      if (filters.bedrooms) {
        filteredStays = filteredStays.filter(stay => stay.bedrooms >= filters.bedrooms!)
      }

      if (filters.bathrooms) {
        filteredStays = filteredStays.filter(stay => stay.bathrooms >= filters.bathrooms!)
      }

      if (filters.guests) {
        filteredStays = filteredStays.filter(stay => stay.max_guests >= filters.guests!)
      }

      if (filters.propertyType) {
        filteredStays = filteredStays.filter(stay => 
          stay.property_type.toLowerCase().includes(filters.propertyType!.toLowerCase())
        )
      }

      const mockData = {
        data: filteredStays,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: filteredStays.length,
          totalPages: Math.ceil(filteredStays.length / (filters.limit || 20)),
          hasNext: false,
          hasPrev: false,
        },
      }

      console.log('[Stays API] Returning mock data with', filteredStays.length, 'stays')
      
      return NextResponse.json(
        {
          success: true,
          data: mockData,
        },
        { 
          status: 200,
          headers: getCacheHeaders('ACCOMMODATIONS'),
        }
      )
    }

    // Fetch accommodations from Supabase if configured
    console.log('[Stays API] Using Supabase - fetching real data')
    const { data, error } = await getAccommodationsServer(filters)

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
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
        headers: getCacheHeaders('ACCOMMODATIONS'),
      }
    )
  } catch (error) {
    console.error('Error in GET /api/stays:', error)
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



