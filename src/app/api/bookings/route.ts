/**
 * Bookings API Route
 * GET /api/bookings - Get user's bookings
 * POST /api/bookings - Create a new booking
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUserBookingsServer } from '@/lib/services/booking.service'
import { createServerClient } from '@/lib/supabase/server'
import { getCacheHeaders } from '@/lib/cache'
import type { BookingFilters } from '@/types/supabase'

export const dynamic = 'force-dynamic';

/**
 * GET /api/bookings - Get user's bookings
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to view bookings',
          },
        },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const filters: BookingFilters = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      status: searchParams.get('status') as any || undefined,
      booking_type: searchParams.get('booking_type') as any || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    }

    const { data, error } = await getUserBookingsServer(user.id, filters)

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

    // If no bookings found, return sample data for demonstration
    if (data && data.data.length === 0) {
      const sampleBookings = [
        {
          id: 'sample-1',
          user_id: user.id,
          booking_type: 'event',
          reference_id: 'bf1ca642-38be-4dd4-9a7e-976d47d8f0d8',
          status: 'completed',
          start_date: '2024-11-15T18:00:00Z',
          end_date: '2024-11-15T23:59:00Z',
          guests: 2,
          total_price: 50000,
          currency: 'NGN',
          special_requests: 'VIP seating preferred',
          metadata: {
            customer_info: { name: 'Demo User', email: 'demo@example.com' },
            booking_source: 'web'
          },
          created_at: '2024-11-08T10:00:00Z',
          updated_at: '2024-11-08T10:00:00Z',
          cancelled_at: null
        },
        {
          id: 'sample-2',
          user_id: user.id,
          booking_type: 'flight',
          reference_id: 'mock-flight-1',
          status: 'confirmed',
          start_date: '2024-12-28T14:30:00Z',
          end_date: '2024-12-28T20:45:00Z',
          guests: 1,
          total_price: 1275000,
          currency: 'NGN',
          special_requests: 'Window seat preferred',
          metadata: {
            customer_info: { name: 'Demo User', email: 'demo@example.com' },
            flight_details: { class: 'Economy', seat: '12A' }
          },
          created_at: '2024-12-20T08:00:00Z',
          updated_at: '2024-12-20T08:00:00Z',
          cancelled_at: null
        },
        {
          id: 'sample-3',
          user_id: user.id,
          booking_type: 'accommodation',
          reference_id: 'mock-hotel-1',
          status: 'confirmed',
          start_date: '2024-12-30T15:00:00Z',
          end_date: '2025-01-03T11:00:00Z',
          guests: 2,
          total_price: 1500000,
          currency: 'NGN',
          special_requests: 'Late check-in requested',
          metadata: {
            customer_info: { name: 'Demo User', email: 'demo@example.com' },
            accommodation_details: { room_type: 'Deluxe Suite', nights: 4 }
          },
          created_at: '2024-12-22T12:00:00Z',
          updated_at: '2024-12-22T12:00:00Z',
          cancelled_at: null
        },
        {
          id: 'sample-4',
          user_id: user.id,
          booking_type: 'transport',
          reference_id: 'mock-transport-1',
          status: 'cancelled',
          start_date: '2024-11-10T16:00:00Z',
          end_date: '2024-11-10T18:00:00Z',
          guests: 2,
          total_price: 30000,
          currency: 'NGN',
          special_requests: null,
          metadata: {
            customer_info: { name: 'Demo User', email: 'demo@example.com' },
            transport_details: { vehicle_type: 'SUV', pickup: 'Airport' },
            cancellation_reason: 'Change of plans'
          },
          created_at: '2024-11-03T14:00:00Z',
          updated_at: '2024-11-05T16:00:00Z',
          cancelled_at: '2024-11-05T16:00:00Z'
        },
        {
          id: 'sample-5',
          user_id: user.id,
          booking_type: 'dining',
          reference_id: 'mock-dining-1',
          status: 'completed',
          start_date: '2024-10-15T20:00:00Z',
          end_date: '2024-10-15T22:30:00Z',
          guests: 4,
          total_price: 120000,
          currency: 'NGN',
          special_requests: 'Anniversary celebration',
          metadata: {
            customer_info: { name: 'Demo User', email: 'demo@example.com' },
            dining_details: { restaurant: 'Nok by Alara', special_occasion: 'Anniversary' }
          },
          created_at: '2024-10-08T10:00:00Z',
          updated_at: '2024-10-08T10:00:00Z',
          cancelled_at: null
        }
      ];

      const sampleData = {
        data: sampleBookings,
        pagination: {
          page: 1,
          limit: 20,
          total: sampleBookings.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      return NextResponse.json(
        {
          success: true,
          data: sampleData,
        },
        { 
          status: 200,
          headers: getCacheHeaders('BOOKINGS'),
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { 
        status: 200,
        headers: getCacheHeaders('BOOKINGS'),
      }
    )
  } catch (error) {
    console.error('Error in GET /api/bookings:', error)
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

/**
 * POST /api/bookings - Create a new booking
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const isSupabaseConfigured = supabaseUrl && 
      supabaseKey && 
      !supabaseUrl.includes('placeholder') && 
      !supabaseUrl.includes('xxxxxxxxx') &&
      !supabaseKey.includes('placeholder') &&
      supabaseUrl !== 'https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.supabase.co'

    let user = null

    if (isSupabaseConfigured) {
      const supabase = createServerClient()
      
      // Get the current user
      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !supabaseUser) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'You must be logged in to create a booking',
            },
          },
          { status: 401 }
        )
      }
      
      user = supabaseUser
    }

    const body = await request.json()
    
    if (!isSupabaseConfigured) {
      // For mock mode, we'll accept the user ID from the request
      if (body.user_id) {
        user = { id: body.user_id }
      } else {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'User ID required for mock authentication',
            },
          },
          { status: 401 }
        )
      }
    }
    const {
      booking_type,
      reference_id,
      start_date,
      end_date,
      guests,
      total_price,
      currency,
      special_requests,
      customer_info,
      payment_info,
    } = body

    // Validate required fields
    if (!booking_type || !reference_id || !start_date || !guests || !total_price) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: booking_type, reference_id, start_date, guests, total_price',
          },
        },
        { status: 400 }
      )
    }

    // Validate booking type
    const validBookingTypes = ['flight', 'accommodation', 'event', 'transport', 'dining']
    if (!validBookingTypes.includes(booking_type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_BOOKING_TYPE',
            message: `Invalid booking type. Must be one of: ${validBookingTypes.join(', ')}`,
          },
        },
        { status: 400 }
      )
    }

    // Check availability and get item details
    let itemExists = false
    let availableCapacity = 0

    if (isSupabaseConfigured) {
      const supabase = createServerClient()
      
      switch (booking_type) {
        case 'flight':
          const { data: flight } = await supabase
            .from('flights')
            .select('available_seats')
            .eq('id', reference_id)
            .single() as any
          
          if (flight) {
            itemExists = true
            availableCapacity = flight.available_seats
          }
          break

        case 'accommodation':
          const { data: accommodation } = await supabase
            .from('accommodations')
            .select('max_guests')
            .eq('id', reference_id)
            .single() as any
          
          if (accommodation) {
            itemExists = true
            availableCapacity = accommodation.max_guests
          }
          break

        case 'event':
          const { data: event } = await supabase
            .from('events')
            .select('available_spots')
            .eq('id', reference_id)
            .single() as any
          
          if (event) {
            itemExists = true
            availableCapacity = event.available_spots
          }
          break

        case 'transport':
          const { data: transport } = await supabase
            .from('transport_options')
            .select('available_seats')
            .eq('id', reference_id)
            .single() as any
          
          if (transport) {
            itemExists = true
            availableCapacity = transport.available_seats
          }
          break

        case 'dining':
          const { data: venue } = await supabase
            .from('dining_venues')
            .select('capacity')
            .eq('id', reference_id)
            .single() as any
          
          if (venue) {
            itemExists = true
            availableCapacity = venue.capacity
          }
          break
      }

      if (!itemExists) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'ITEM_NOT_FOUND',
              message: `${booking_type} not found`,
            },
          },
          { status: 404 }
        )
      }

      if (guests > availableCapacity) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INSUFFICIENT_CAPACITY',
              message: `Only ${availableCapacity} spots/seats available`,
            },
          },
          { status: 400 }
        )
      }
    } else {
      // Mock mode - assume item exists and has capacity
      itemExists = true
      availableCapacity = 100 // Mock capacity
    }

    // Create the booking
    const bookingData = {
      user_id: user!.id,
      booking_type,
      reference_id,
      status: 'confirmed' as const,
      start_date,
      end_date: end_date || null,
      guests,
      total_price,
      currency: currency || 'NGN',
      special_requests: special_requests || null,
      metadata: {
        customer_info,
        payment_info: payment_info ? {
          ...payment_info,
          // Remove sensitive card details
          card_number: payment_info.card_number ? `****${payment_info.card_number.slice(-4)}` : undefined,
          cvv: undefined,
        } : undefined,
        booking_source: 'web',
        created_via: 'payment_dialog',
      },
    }

    let booking = null

    if (isSupabaseConfigured) {
      const supabase = createServerClient()
      
      const { data: supabaseBooking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData as any)
        .select()
        .single()

      if (bookingError) {
        console.error('Booking creation error:', bookingError)
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'BOOKING_FAILED',
              message: 'Failed to create booking',
              details: bookingError,
            },
          },
          { status: 500 }
        )
      }
      
      booking = supabaseBooking
    } else {
      // Mock mode - create a mock booking
      booking = {
        id: 'mock-booking-' + Date.now(),
        ...bookingData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        cancelled_at: null,
      }
    }

    // Update availability
    if (isSupabaseConfigured) {
      try {
        const supabase = createServerClient()
        
        switch (booking_type) {
          case 'flight':
            const { error: flightError } = await (supabase as any)
              .from('flights')
              .update({ 
                available_seats: availableCapacity - guests,
                updated_at: new Date().toISOString(),
              })
              .eq('id', reference_id)
            if (flightError) console.error('Flight availability update error:', flightError)
            break

          case 'event':
            const { error: eventError } = await (supabase as any)
              .from('events')
              .update({ 
                available_spots: availableCapacity - guests,
                updated_at: new Date().toISOString(),
              })
              .eq('id', reference_id)
            if (eventError) console.error('Event availability update error:', eventError)
            break

          case 'transport':
            const { error: transportError } = await (supabase as any)
              .from('transport_options')
              .update({ 
                available_seats: availableCapacity - guests,
                updated_at: new Date().toISOString(),
              })
              .eq('id', reference_id)
            if (transportError) console.error('Transport availability update error:', transportError)
            break

          // Accommodation and dining availability is managed differently
          case 'accommodation':
          case 'dining':
          default:
            // No availability update needed
            break
        }
      } catch (availabilityError) {
        console.error('Error updating availability:', availabilityError)
        // Don't fail the booking if availability update fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          booking,
          message: 'Booking created successfully',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/bookings:', error)
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