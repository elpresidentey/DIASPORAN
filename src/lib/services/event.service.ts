/**
 * Event Service
 * Handles all event listing and registration operations
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Database, EventFilters, PaginatedResult } from '@/types/supabase'

type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']
type Booking = Database['public']['Tables']['bookings']['Row']

export interface EventServiceError {
  code: string
  message: string
  details?: any
}

/**
 * Get paginated list of events with filters
 */
export async function getEvents(
  filters: EventFilters = {}
): Promise<{ data: PaginatedResult<Event> | null; error: EventServiceError | null }> {
  const supabase = createClient()

  const {
    page = 1,
    limit = 20,
    city,
    country,
    category,
    startDate,
    endDate,
    hasAvailability,
    rating,
    sortBy = 'start_date',
    sortOrder = 'asc',
  } = filters

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)

  // Apply filters
  if (city) {
    query = query.ilike('city', `%${city}%`)
  }

  if (country) {
    query = query.ilike('country', `%${country}%`)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (startDate) {
    query = query.gte('start_date', startDate)
  }

  if (endDate) {
    query = query.lte('end_date', endDate)
  }

  if (hasAvailability) {
    query = query.gt('available_spots', 0)
  }

  if (rating !== undefined) {
    query = query.gte('average_rating', rating)
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
        message: 'Failed to fetch events',
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
 * Get single event by ID
 */
export async function getEvent(
  id: string
): Promise<{ event: Event | null; error: EventServiceError | null }> {
  const supabase = createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    return {
      event: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Event not found',
        details: error,
      },
    }
  }

  return { event, error: null }
}

/**
 * Register for an event (create booking)
 */
export async function registerForEvent(
  userId: string,
  eventId: string,
  tickets: number,
  ticketType?: string,
  specialRequests?: string
): Promise<{ booking: Booking | null; error: EventServiceError | null }> {
  const supabase = createClient()

  // First, get the event to check availability and get price
  const { event, error: eventError } = await getEvent(eventId)

  if (eventError || !event) {
    return {
      booking: null,
      error: eventError || {
        code: 'EVENT_NOT_FOUND',
        message: 'Event not found',
      },
    }
  }

  // Check if event has enough available spots
  if (event.available_spots < tickets) {
    return {
      booking: null,
      error: {
        code: 'INSUFFICIENT_CAPACITY',
        message: `Only ${event.available_spots} spots available`,
      },
    }
  }

  // Check if event is sold out
  if (event.available_spots === 0) {
    return {
      booking: null,
      error: {
        code: 'SOLD_OUT',
        message: 'Event is sold out',
      },
    }
  }

  // Calculate total price from ticket types
  let totalPrice = 0
  if (event.ticket_types && Array.isArray(event.ticket_types) && event.ticket_types.length > 0) {
    const ticketTypeData = event.ticket_types.find((t: any) => t.type === ticketType) || event.ticket_types[0]
    totalPrice = (ticketTypeData as any).price * tickets
  }

  // Create booking
  const bookingData: Database['public']['Tables']['bookings']['Insert'] = {
    user_id: userId,
    booking_type: 'event',
    reference_id: eventId,
    status: 'pending',
    start_date: event.start_date,
    end_date: event.end_date,
    guests: tickets,
    total_price: totalPrice,
    currency: 'USD',
    special_requests: specialRequests || null,
    metadata: ticketType ? { ticket_type: ticketType } : null,
  }

  const bookingInsertQuery: any = supabase.from('bookings')
  const { data: booking, error: bookingError } = await bookingInsertQuery
    .insert(bookingData)
    .select()
    .single()

  if (bookingError) {
    return {
      booking: null,
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'Failed to register for event',
        details: bookingError,
      },
    }
  }

  // Decrement available spots
  const eventUpdate: Database['public']['Tables']['events']['Update'] = {
    available_spots: event.available_spots - tickets,
    updated_at: new Date().toISOString(),
  }

  const eventUpdateQuery: any = supabase.from('events')
  const { error: updateError } = await eventUpdateQuery
    .update(eventUpdate)
    .eq('id', eventId)

  if (updateError) {
    // Rollback booking if we can't update capacity
    await supabase.from('bookings').delete().eq('id', booking.id)
    
    return {
      booking: null,
      error: {
        code: 'CAPACITY_UPDATE_FAILED',
        message: 'Failed to update event capacity',
        details: updateError,
      },
    }
  }

  return { booking, error: null }
}

/**
 * Cancel event registration and restore capacity
 */
export async function cancelEventRegistration(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; error: EventServiceError | null }> {
  const supabase = createClient()

  // Get the booking to verify ownership
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .eq('booking_type', 'event')
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

  // Restore available spots
  const { data: event } = await supabase
    .from('events')
    .select('available_spots')
    .eq('id', booking.reference_id)
    .single()

  if (event) {
    const restoreUpdate: Database['public']['Tables']['events']['Update'] = {
      available_spots: event.available_spots + booking.guests,
      updated_at: new Date().toISOString(),
    }

    const eventRestoreQuery: any = supabase.from('events')
    await eventRestoreQuery
      .update(restoreUpdate)
      .eq('id', booking.reference_id)
  }

  return { success: true, error: null }
}

/**
 * Server-side version of getEvents for use in API routes
 */
export async function getEventsServer(
  filters: EventFilters = {}
): Promise<{ data: PaginatedResult<Event> | null; error: EventServiceError | null }> {
  const supabase = createServerClient()

  const {
    page = 1,
    limit = 20,
    city,
    country,
    category,
    startDate,
    endDate,
    hasAvailability,
    rating,
    sortBy = 'start_date',
    sortOrder = 'asc',
  } = filters

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)

  // Apply filters
  if (city) {
    query = query.ilike('city', `%${city}%`)
  }

  if (country) {
    query = query.ilike('country', `%${country}%`)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (startDate) {
    query = query.gte('start_date', startDate)
  }

  if (endDate) {
    query = query.lte('end_date', endDate)
  }

  if (hasAvailability) {
    query = query.gt('available_spots', 0)
  }

  if (rating !== undefined) {
    query = query.gte('average_rating', rating)
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
        message: 'Failed to fetch events',
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
 * Server-side version of getEvent for use in API routes
 */
export async function getEventServer(
  id: string
): Promise<{ event: Event | null; error: EventServiceError | null }> {
  const supabase = createServerClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    return {
      event: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Event not found',
        details: error,
      },
    }
  }

  return { event, error: null }
}
