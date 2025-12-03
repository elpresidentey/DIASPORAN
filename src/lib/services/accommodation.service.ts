/**
 * Accommodation Service
 * Handles all accommodation listing and booking operations
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Database, AccommodationFilters, PaginatedResult } from '@/types/supabase'

type Accommodation = Database['public']['Tables']['accommodations']['Row']
type AccommodationInsert = Database['public']['Tables']['accommodations']['Insert']
type AccommodationUpdate = Database['public']['Tables']['accommodations']['Update']
type Booking = Database['public']['Tables']['bookings']['Row']

export interface AccommodationServiceError {
  code: string
  message: string
  details?: any
}

export interface AccommodationWithAvailability extends Accommodation {
  is_available: boolean
}

/**
 * Get paginated list of accommodations with filters
 */
export async function getAccommodations(
  filters: AccommodationFilters = {}
): Promise<{ data: PaginatedResult<Accommodation> | null; error: AccommodationServiceError | null }> {
  const supabase = createClient()

  const {
    page = 1,
    limit = 20,
    city,
    country,
    minPrice,
    maxPrice,
    rating,
    sortBy = 'created_at',
    sortOrder = 'desc',
    checkIn,
    checkOut,
    guests,
    bedrooms,
    bathrooms,
    propertyType,
    amenities,
  } = filters

  let query = supabase
    .from('accommodations')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)

  // Apply filters
  if (city) {
    query = query.ilike('city', `%${city}%`)
  }

  if (country) {
    query = query.ilike('country', `%${country}%`)
  }

  if (minPrice !== undefined) {
    query = query.gte('price_per_night', minPrice)
  }

  if (maxPrice !== undefined) {
    query = query.lte('price_per_night', maxPrice)
  }

  if (rating !== undefined) {
    query = query.gte('average_rating', rating)
  }

  if (guests !== undefined) {
    query = query.gte('max_guests', guests)
  }

  if (bedrooms !== undefined) {
    query = query.gte('bedrooms', bedrooms)
  }

  if (bathrooms !== undefined) {
    query = query.gte('bathrooms', bathrooms)
  }

  if (propertyType) {
    query = query.eq('property_type', propertyType)
  }

  if (amenities && amenities.length > 0) {
    query = query.contains('amenities', amenities)
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return {
      data: null,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch accommodations',
        details: error,
      },
    }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    data: {
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
    error: null,
  }
}

/**
 * Get single accommodation by ID
 */
export async function getAccommodation(
  id: string
): Promise<{ accommodation: Accommodation | null; error: AccommodationServiceError | null }> {
  const supabase = createClient()

  const { data: accommodation, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    return {
      accommodation: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Accommodation not found',
        details: error,
      },
    }
  }

  return { accommodation, error: null }
}

/**
 * Check accommodation availability for date range
 */
export async function checkAvailability(
  accommodationId: string,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean; error: AccommodationServiceError | null }> {
  const supabase = createClient()

  // Check for overlapping bookings
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('booking_type', 'accommodation')
    .eq('reference_id', accommodationId)
    .in('status', ['confirmed', 'pending'])
    .or(`and(start_date.lte.${checkOut},end_date.gte.${checkIn})`)

  if (error) {
    return {
      available: false,
      error: {
        code: 'AVAILABILITY_CHECK_FAILED',
        message: 'Failed to check availability',
        details: error,
      },
    }
  }

  return {
    available: bookings.length === 0,
    error: null,
  }
}

/**
 * Calculate booking cost for accommodation
 */
export function calculateBookingCost(
  pricePerNight: number,
  checkIn: string,
  checkOut: string,
  guests: number
): number {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // Base cost is price per night * number of nights
  const baseCost = pricePerNight * nights
  
  // Add 10% service fee
  const serviceFee = baseCost * 0.1
  
  return baseCost + serviceFee
}

/**
 * Create accommodation booking
 */
export async function createAccommodationBooking(
  userId: string,
  accommodationId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  specialRequests?: string
): Promise<{ booking: Booking | null; error: AccommodationServiceError | null }> {
  const supabase = createClient()

  // First, get the accommodation to check availability and get price
  const { accommodation, error: accommodationError } = await getAccommodation(accommodationId)

  if (accommodationError || !accommodation) {
    return {
      booking: null,
      error: accommodationError || {
        code: 'ACCOMMODATION_NOT_FOUND',
        message: 'Accommodation not found',
      },
    }
  }

  // Check if guests exceed max capacity
  if (guests > accommodation.max_guests) {
    return {
      booking: null,
      error: {
        code: 'EXCEEDS_CAPACITY',
        message: `Number of guests exceeds maximum capacity of ${accommodation.max_guests}`,
      },
    }
  }

  // Check availability
  const { available, error: availabilityError } = await checkAvailability(
    accommodationId,
    checkIn,
    checkOut
  )

  if (availabilityError) {
    return {
      booking: null,
      error: availabilityError,
    }
  }

  if (!available) {
    return {
      booking: null,
      error: {
        code: 'NOT_AVAILABLE',
        message: 'Accommodation is not available for the selected dates',
      },
    }
  }

  // Calculate total cost
  const totalPrice = calculateBookingCost(
    accommodation.price_per_night,
    checkIn,
    checkOut,
    guests
  )

  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      booking_type: 'accommodation' as const,
      reference_id: accommodationId,
      status: 'pending' as const,
      booking_date: new Date().toISOString(),
      start_date: checkIn,
      end_date: checkOut,
      guests,
      total_price: totalPrice,
      currency: accommodation.currency,
      payment_status: 'pending' as const,
      special_requests: specialRequests || null,
    } as any)
    .select()
    .single()

  if (bookingError) {
    return {
      booking: null,
      error: {
        code: 'BOOKING_FAILED',
        message: 'Failed to create booking',
        details: bookingError,
      },
    }
  }

  return { booking, error: null }
}

/**
 * Cancel accommodation booking and restore availability
 */
export async function cancelAccommodationBooking(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; error: AccommodationServiceError | null }> {
  const supabase = createClient()

  // Get the booking to verify ownership
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .eq('booking_type', 'accommodation')
    .single() as { data: any; error: any }

  if (fetchError || !booking) {
    return {
      success: false,
      error: {
        code: 'BOOKING_NOT_FOUND',
        message: 'Booking not found or you do not have permission to cancel it',
        details: fetchError,
      },
    }
  }

  // Check if booking can be cancelled
  const bookingStatus = booking.status as string
  if (bookingStatus === 'cancelled' || bookingStatus === 'completed') {
    return {
      success: false,
      error: {
        code: 'CANNOT_CANCEL',
        message: `Cannot cancel booking with status: ${bookingStatus}`,
      },
    }
  }

  // Update booking status to cancelled
  const updateQuery: any = supabase
    .from('bookings')
  const { error: updateError } = await updateQuery
    .update({
      status: 'cancelled' as const,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (updateError) {
    return {
      success: false,
      error: {
        code: 'CANCELLATION_FAILED',
        message: 'Failed to cancel booking',
        details: updateError,
      },
    }
  }

  // Availability is automatically restored since we check for non-cancelled bookings
  return { success: true, error: null }
}

/**
 * Server-side version of getAccommodations for use in API routes
 */
export async function getAccommodationsServer(
  filters: AccommodationFilters = {}
): Promise<{ data: PaginatedResult<Accommodation> | null; error: AccommodationServiceError | null }> {
  const supabase = createServerClient()

  const {
    page = 1,
    limit = 20,
    city,
    country,
    minPrice,
    maxPrice,
    rating,
    sortBy = 'created_at',
    sortOrder = 'desc',
    checkIn,
    checkOut,
    guests,
    bedrooms,
    bathrooms,
    propertyType,
    amenities,
  } = filters

  let query = supabase
    .from('accommodations')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)

  // Apply filters
  if (city) {
    query = query.ilike('city', `%${city}%`)
  }

  if (country) {
    query = query.ilike('country', `%${country}%`)
  }

  if (minPrice !== undefined) {
    query = query.gte('price_per_night', minPrice)
  }

  if (maxPrice !== undefined) {
    query = query.lte('price_per_night', maxPrice)
  }

  if (rating !== undefined) {
    query = query.gte('average_rating', rating)
  }

  if (guests !== undefined) {
    query = query.gte('max_guests', guests)
  }

  if (bedrooms !== undefined) {
    query = query.gte('bedrooms', bedrooms)
  }

  if (bathrooms !== undefined) {
    query = query.gte('bathrooms', bathrooms)
  }

  if (propertyType) {
    query = query.eq('property_type', propertyType)
  }

  if (amenities && amenities.length > 0) {
    query = query.contains('amenities', amenities)
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return {
      data: null,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch accommodations',
        details: error,
      },
    }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    data: {
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
    error: null,
  }
}

/**
 * Server-side version of getAccommodation for use in API routes
 */
export async function getAccommodationServer(
  id: string
): Promise<{ accommodation: Accommodation | null; error: AccommodationServiceError | null }> {
  const supabase = createServerClient()

  const { data: accommodation, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    return {
      accommodation: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Accommodation not found',
        details: error,
      },
    }
  }

  return { accommodation, error: null }
}
