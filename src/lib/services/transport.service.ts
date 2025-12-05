/**
 * Transport Service
 * Handles all transport search and booking operations
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Database, TransportFilters, PaginatedResult } from '@/types/supabase'

type TransportOption = Database['public']['Tables']['transport_options']['Row']
type TransportUpdate = Database['public']['Tables']['transport_options']['Update']
type Booking = Database['public']['Tables']['bookings']['Row']

export interface TransportServiceError {
  code: string
  message: string
  details?: any
}

/**
 * Get paginated list of transport options with filters
 */
export async function getTransportOptions(
  filters: TransportFilters = {}
): Promise<{ data: PaginatedResult<TransportOption> | null; error: TransportServiceError | null }> {
  const supabase = createClient()

  const {
    page = 1,
    limit = 20,
    origin,
    destination,
    date,
    transportType,
    provider,
    minPrice,
    maxPrice,
    sortBy = 'departure_time',
    sortOrder = 'asc',
  } = filters

  let query = supabase
    .from('transport_options')
    .select('*', { count: 'exact' })

  // Apply filters
  if (origin) {
    query = query.ilike('origin', `%${origin}%`)
  }

  if (destination) {
    query = query.ilike('destination', `%${destination}%`)
  }

  if (transportType) {
    query = query.eq('transport_type', transportType)
  }

  if (provider) {
    query = query.ilike('provider', `%${provider}%`)
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice)
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice)
  }

  // Note: date filtering would require more complex logic based on schedule
  // For now, we'll keep it simple and filter by departure_time if date is provided
  if (date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    
    // Since departure_time is stored as time, we'll need to handle this differently
    // For simplicity, we'll skip date filtering in this basic implementation
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
        message: 'Failed to fetch transport options',
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
 * Get single transport option by ID
 */
export async function getTransportOption(
  id: string
): Promise<{ transport: TransportOption | null; error: TransportServiceError | null }> {
  const supabase = createClient()

  const { data: transport, error } = await supabase
    .from('transport_options')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return {
      transport: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Transport option not found',
        details: error,
      },
    }
  }

  return { transport, error: null }
}

/**
 * Create transport booking
 */
export async function createTransportBooking(
  userId: string,
  transportId: string,
  travelDate: string,
  passengers: number,
  specialRequests?: string
): Promise<{ booking: Booking | null; error: TransportServiceError | null }> {
  const supabase = createClient()

  // First, get the transport option to check availability and get price
  const { transport, error: transportError } = await getTransportOption(transportId)

  if (transportError || !transport) {
    return {
      booking: null,
      error: transportError || {
        code: 'TRANSPORT_NOT_FOUND',
        message: 'Transport option not found',
      },
    }
  }

  // Check if passengers exceed available seats
  if (passengers > transport.available_seats) {
    return {
      booking: null,
      error: {
        code: 'INSUFFICIENT_SEATS',
        message: `Only ${transport.available_seats} seats available`,
      },
    }
  }

  // Calculate total price
  const totalPrice = transport.price * passengers

  // Create booking
  const bookingData: Database['public']['Tables']['bookings']['Insert'] = {
    user_id: userId,
    booking_type: 'transport',
    reference_id: transportId,
    status: 'pending',
    start_date: travelDate,
    end_date: null,
    guests: passengers,
    total_price: totalPrice,
    currency: transport.currency,
    special_requests: specialRequests || null,
  }

  const transportBookingInsertQuery: any = supabase.from('bookings')
  const { data: booking, error: bookingError } = await transportBookingInsertQuery
    .insert(bookingData)
    .select()
    .single()

  if (bookingError) {
    return {
      booking: null,
      error: {
        code: 'BOOKING_FAILED',
        message: 'Failed to create transport booking',
        details: bookingError,
      },
    }
  }

  // Decrement available seats
  const transportUpdate: Database['public']['Tables']['transport_options']['Update'] = {
    available_seats: transport.available_seats - passengers,
    updated_at: new Date().toISOString(),
  }

  const transportUpdateQuery: any = supabase.from('transport_options')
  const { error: updateError } = await transportUpdateQuery
    .update(transportUpdate)
    .eq('id', transportId)

  if (updateError) {
    // Rollback booking if we can't update seats
    await supabase.from('bookings').delete().eq('id', booking.id)
    
    return {
      booking: null,
      error: {
        code: 'SEAT_UPDATE_FAILED',
        message: 'Failed to update available seats',
        details: updateError,
      },
    }
  }

  return { booking, error: null }
}

/**
 * Cancel transport booking and restore seats
 */
export async function cancelTransportBooking(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; error: TransportServiceError | null }> {
  const supabase = createClient()

  // Get the booking to verify ownership
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .eq('booking_type', 'transport')
    .single() as { data: Booking | null; error: any }

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
  if (booking.status === 'cancelled' || booking.status === 'completed') {
    return {
      success: false,
      error: {
        code: 'CANNOT_CANCEL',
        message: `Cannot cancel booking with status: ${booking.status}`,
      },
    }
  }

  // Update booking status to cancelled
  const bookingUpdate: Database['public']['Tables']['bookings']['Update'] = {
    status: 'cancelled',
    cancelled_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const bookingCancelQuery: any = supabase.from('bookings')
  const { error: updateError } = await bookingCancelQuery
    .update(bookingUpdate)
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

  // Restore available seats
  const { data: transport } = await supabase
    .from('transport_options')
    .select('available_seats')
    .eq('id', booking.reference_id)
    .single() as { data: { available_seats: number } | null; error: any }

  if (transport) {
    const restoreUpdate: Database['public']['Tables']['transport_options']['Update'] = {
      available_seats: transport.available_seats + booking.guests,
      updated_at: new Date().toISOString(),
    }

    const transportRestoreQuery: any = supabase.from('transport_options')
    await transportRestoreQuery
      .update(restoreUpdate)
      .eq('id', booking.reference_id)
  }

  return { success: true, error: null }
}

/**
 * Update transport schedule (admin/system operation)
 * This would typically trigger notifications to affected users
 */
export async function updateTransportSchedule(
  transportId: string,
  scheduleUpdate: {
    departure_time?: string
    arrival_time?: string
    duration_minutes?: number
    schedule?: any
  }
): Promise<{ transport: TransportOption | null; error: TransportServiceError | null }> {
  const supabase = createClient()

  const updateData: TransportUpdate = {
    ...scheduleUpdate,
    updated_at: new Date().toISOString(),
  }

  const transportScheduleUpdateQuery: any = supabase.from('transport_options')
  const { data: transport, error } = await transportScheduleUpdateQuery
    .update(updateData)
    .eq('id', transportId)
    .select()
    .single()

  if (error) {
    return {
      transport: null,
      error: {
        code: 'UPDATE_FAILED',
        message: 'Failed to update transport schedule',
        details: error,
      },
    }
  }

  // TODO: In a real implementation, this would trigger notifications
  // to all users with bookings for this transport option
  // For now, we'll just return the updated transport

  return { transport, error: null }
}

/**
 * Get user's transport bookings
 */
export async function getUserTransportBookings(
  userId: string
): Promise<{ bookings: Booking[]; error: TransportServiceError | null }> {
  const supabase = createClient()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .eq('booking_type', 'transport')
    .order('start_date', { ascending: false })

  if (error) {
    return {
      bookings: [],
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch transport bookings',
        details: error,
      },
    }
  }

  return { bookings: bookings || [], error: null }
}

/**
 * Server-side version of getTransportOptions for use in API routes
 */
export async function getTransportOptionsServer(
  filters: TransportFilters = {}
): Promise<{ data: PaginatedResult<TransportOption> | null; error: TransportServiceError | null }> {
  const supabase = createServerClient()

  const {
    page = 1,
    limit = 20,
    origin,
    destination,
    date,
    transportType,
    provider,
    minPrice,
    maxPrice,
    sortBy = 'departure_time',
    sortOrder = 'asc',
  } = filters

  let query = supabase
    .from('transport_options')
    .select('*', { count: 'exact' })

  // Apply filters
  if (origin) {
    query = query.ilike('origin', `%${origin}%`)
  }

  if (destination) {
    query = query.ilike('destination', `%${destination}%`)
  }

  if (transportType) {
    query = query.eq('transport_type', transportType)
  }

  if (provider) {
    query = query.ilike('provider', `%${provider}%`)
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice)
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice)
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
        message: 'Failed to fetch transport options',
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
 * Server-side version of getTransportOption for use in API routes
 */
export async function getTransportOptionServer(
  id: string
): Promise<{ transport: TransportOption | null; error: TransportServiceError | null }> {
  const supabase = createServerClient()

  const { data: transport, error } = await supabase
    .from('transport_options')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return {
      transport: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Transport option not found',
        details: error,
      },
    }
  }

  return { transport, error: null }
}
