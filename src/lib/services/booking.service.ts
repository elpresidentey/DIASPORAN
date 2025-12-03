/**
 * Booking Service
 * Handles all booking management operations including CRUD and notifications
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { 
  Database, 
  BookingFilters, 
  PaginatedResult,
  UpdateBookingInput 
} from '@/types/supabase'

type Booking = Database['public']['Tables']['bookings']['Row']
type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export interface BookingServiceError {
  code: string
  message: string
  details?: any
}

/**
 * Get paginated list of user's bookings with filters
 */
export async function getUserBookings(
  userId: string,
  filters: BookingFilters = {}
): Promise<{ data: PaginatedResult<Booking> | null; error: BookingServiceError | null }> {
  const supabase = createClient()

  const {
    page = 1,
    limit = 20,
    status,
    booking_type,
    startDate,
    endDate,
  } = filters

  let query = supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)

  // Apply filters
  if (status) {
    query = query.eq('status', status)
  }

  if (booking_type) {
    query = query.eq('booking_type', booking_type)
  }

  if (startDate) {
    query = query.gte('start_date', startDate)
  }

  if (endDate) {
    query = query.lte('start_date', endDate)
  }

  // Sort by creation date, newest first
  query = query.order('created_at', { ascending: false })

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
        message: 'Failed to fetch bookings',
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
 * Get single booking by ID
 */
export async function getBooking(
  bookingId: string,
  userId: string
): Promise<{ booking: Booking | null; error: BookingServiceError | null }> {
  const supabase = createClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single()

  if (error) {
    return {
      booking: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Booking not found or you do not have permission to view it',
        details: error,
      },
    }
  }

  return { booking, error: null }
}

/**
 * Update booking details
 */
export async function updateBooking(
  bookingId: string,
  userId: string,
  updates: UpdateBookingInput
): Promise<{ booking: Booking | null; error: BookingServiceError | null }> {
  const supabase = createClient()

  // First, get the booking to verify ownership and current status
  const { booking: existingBooking, error: fetchError } = await getBooking(bookingId, userId)

  if (fetchError || !existingBooking) {
    return {
      booking: null,
      error: fetchError || {
        code: 'BOOKING_NOT_FOUND',
        message: 'Booking not found',
      },
    }
  }

  // Check if booking can be modified
  if (existingBooking.status === 'cancelled' || existingBooking.status === 'completed') {
    return {
      booking: null,
      error: {
        code: 'CANNOT_MODIFY',
        message: `Cannot modify booking with status: ${existingBooking.status}`,
      },
    }
  }

  // Validate date range if dates are being updated
  if (updates.start_date && updates.end_date) {
    const startDate = new Date(updates.start_date)
    const endDate = new Date(updates.end_date)
    
    if (endDate <= startDate) {
      return {
        booking: null,
        error: {
          code: 'INVALID_DATE_RANGE',
          message: 'End date must be after start date',
        },
      }
    }
  }

  // Prepare update data
  const updateData: BookingUpdate = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  // Update the booking
  const updateBookingQuery: any = supabase.from('bookings')
  const { data: updatedBooking, error: updateError } = await updateBookingQuery
    .update(updateData)
    .eq('id', bookingId)
    .eq('user_id', userId)
    .select()
    .single()

  if (updateError) {
    return {
      booking: null,
      error: {
        code: 'UPDATE_FAILED',
        message: 'Failed to update booking',
        details: updateError,
      },
    }
  }

  // TODO: Send notification about booking modification
  // This would be implemented in a future task with notification service

  return { booking: updatedBooking, error: null }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  bookingId: string,
  userId: string,
  reason?: string
): Promise<{ success: boolean; error: BookingServiceError | null }> {
  const supabase = createClient()

  // Get the booking to verify ownership and current status
  const { booking, error: fetchError } = await getBooking(bookingId, userId)

  if (fetchError || !booking) {
    return {
      success: false,
      error: fetchError || {
        code: 'BOOKING_NOT_FOUND',
        message: 'Booking not found',
      },
    }
  }

  // Check if booking can be cancelled
  if (booking.status === 'cancelled') {
    return {
      success: false,
      error: {
        code: 'ALREADY_CANCELLED',
        message: 'Booking is already cancelled',
      },
    }
  }

  if (booking.status === 'completed') {
    return {
      success: false,
      error: {
        code: 'CANNOT_CANCEL',
        message: 'Cannot cancel a completed booking',
      },
    }
  }

  // Update booking status to cancelled
  const metadata = booking.metadata as Record<string, any> || {}
  if (reason) {
    metadata.cancellation_reason = reason
  }

  const cancelQuery: any = supabase.from('bookings')
  const { error: updateError } = await cancelQuery
    .update({
      status: 'cancelled' as const,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: metadata,
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

  // Restore availability based on booking type
  await restoreAvailability(booking)

  // TODO: Send cancellation notification
  // This would be implemented in a future task with notification service

  return { success: true, error: null }
}

/**
 * Restore availability after booking cancellation
 */
async function restoreAvailability(booking: Booking): Promise<void> {
  const supabase = createClient()

  try {
    switch (booking.booking_type) {
      case 'event':
        // Restore event capacity - do manual update
        {
          const { data: eventData } = await supabase
            .from('events')
            .select('available_spots')
            .eq('id', booking.reference_id)
            .single() as any
          
          if (eventData) {
            const eventUpdateQuery: any = supabase.from('events')
            await eventUpdateQuery
              .update({ 
                available_spots: (eventData as any).available_spots + booking.guests,
                updated_at: new Date().toISOString(),
              })
              .eq('id', booking.reference_id)
          }
        }
        break

      case 'transport':
        // Restore transport seats - do manual update
        {
          const { data: transportData } = await supabase
            .from('transport_options')
            .select('available_seats')
            .eq('id', booking.reference_id)
            .single() as any
          
          if (transportData) {
            const transportUpdateQuery: any = supabase.from('transport_options')
            await transportUpdateQuery
              .update({ 
                available_seats: (transportData as any).available_seats + booking.guests,
                updated_at: new Date().toISOString(),
              })
              .eq('id', booking.reference_id)
          }
        }
        break

      // Accommodation and dining availability is checked dynamically
      // by querying non-cancelled bookings, so no action needed
      case 'accommodation':
      case 'dining':
      case 'flight':
      default:
        // No availability restoration needed
        break
    }
  } catch (error) {
    console.error('Error restoring availability:', error)
    // Don't throw - cancellation should succeed even if availability restoration fails
  }
}

/**
 * Change booking status (for admin or system use)
 */
export async function changeBookingStatus(
  bookingId: string,
  newStatus: Booking['status'],
  userId?: string
): Promise<{ booking: Booking | null; error: BookingServiceError | null }> {
  const supabase = createClient()

  const updateData: BookingUpdate = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  }

  const statusQuery: any = supabase.from('bookings')
  let query = statusQuery
    .update(updateData)
    .eq('id', bookingId)

  // If userId provided, ensure user owns the booking
  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data: booking, error } = await query.select().single()

  if (error) {
    return {
      booking: null,
      error: {
        code: 'STATUS_UPDATE_FAILED',
        message: 'Failed to update booking status',
        details: error,
      },
    }
  }

  // TODO: Send notification about status change
  // This would be implemented in a future task with notification service

  return { booking, error: null }
}

/**
 * Server-side version of getUserBookings for use in API routes
 */
export async function getUserBookingsServer(
  userId: string,
  filters: BookingFilters = {}
): Promise<{ data: PaginatedResult<Booking> | null; error: BookingServiceError | null }> {
  const supabase = createServerClient()

  const {
    page = 1,
    limit = 20,
    status,
    booking_type,
    startDate,
    endDate,
  } = filters

  let query = supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)

  // Apply filters
  if (status) {
    query = query.eq('status', status)
  }

  if (booking_type) {
    query = query.eq('booking_type', booking_type)
  }

  if (startDate) {
    query = query.gte('start_date', startDate)
  }

  if (endDate) {
    query = query.lte('start_date', endDate)
  }

  // Sort by creation date, newest first
  query = query.order('created_at', { ascending: false })

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
        message: 'Failed to fetch bookings',
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
 * Server-side version of getBooking for use in API routes
 */
export async function getBookingServer(
  bookingId: string,
  userId: string
): Promise<{ booking: Booking | null; error: BookingServiceError | null }> {
  const supabase = createServerClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single()

  if (error) {
    return {
      booking: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Booking not found or you do not have permission to view it',
        details: error,
      },
    }
  }

  return { booking, error: null }
}

/**
 * Server-side version of updateBooking for use in API routes
 */
export async function updateBookingServer(
  bookingId: string,
  userId: string,
  updates: UpdateBookingInput
): Promise<{ booking: Booking | null; error: BookingServiceError | null }> {
  const supabase = createServerClient()

  // First, get the booking to verify ownership and current status
  const { booking: existingBooking, error: fetchError } = await getBookingServer(bookingId, userId)

  if (fetchError || !existingBooking) {
    return {
      booking: null,
      error: fetchError || {
        code: 'BOOKING_NOT_FOUND',
        message: 'Booking not found',
      },
    }
  }

  // Check if booking can be modified
  if (existingBooking.status === 'cancelled' || existingBooking.status === 'completed') {
    return {
      booking: null,
      error: {
        code: 'CANNOT_MODIFY',
        message: `Cannot modify booking with status: ${existingBooking.status}`,
      },
    }
  }

  // Validate date range if dates are being updated
  if (updates.start_date && updates.end_date) {
    const startDate = new Date(updates.start_date)
    const endDate = new Date(updates.end_date)
    
    if (endDate <= startDate) {
      return {
        booking: null,
        error: {
          code: 'INVALID_DATE_RANGE',
          message: 'End date must be after start date',
        },
      }
    }
  }

  // Prepare update data
  const updateData: BookingUpdate = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  // Update the booking
  const updateBookingServerQuery: any = supabase.from('bookings')
  const { data: updatedBooking, error: updateError } = await updateBookingServerQuery
    .update(updateData)
    .eq('id', bookingId)
    .eq('user_id', userId)
    .select()
    .single()

  if (updateError) {
    return {
      booking: null,
      error: {
        code: 'UPDATE_FAILED',
        message: 'Failed to update booking',
        details: updateError,
      },
    }
  }

  return { booking: updatedBooking, error: null }
}

/**
 * Server-side version of cancelBooking for use in API routes
 */
export async function cancelBookingServer(
  bookingId: string,
  userId: string,
  reason?: string
): Promise<{ success: boolean; error: BookingServiceError | null }> {
  const supabase = createServerClient()

  // Get the booking to verify ownership and current status
  const { booking, error: fetchError } = await getBookingServer(bookingId, userId)

  if (fetchError || !booking) {
    return {
      success: false,
      error: fetchError || {
        code: 'BOOKING_NOT_FOUND',
        message: 'Booking not found',
      },
    }
  }

  // Check if booking can be cancelled
  if (booking.status === 'cancelled') {
    return {
      success: false,
      error: {
        code: 'ALREADY_CANCELLED',
        message: 'Booking is already cancelled',
      },
    }
  }

  if (booking.status === 'completed') {
    return {
      success: false,
      error: {
        code: 'CANNOT_CANCEL',
        message: 'Cannot cancel a completed booking',
      },
    }
  }

  // Update booking status to cancelled
  const metadata = booking.metadata as Record<string, any> || {}
  if (reason) {
    metadata.cancellation_reason = reason
  }

  const cancelServerQuery: any = supabase.from('bookings')
  const { error: updateError } = await cancelServerQuery
    .update({
      status: 'cancelled' as const,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: metadata,
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

  // Restore availability based on booking type
  await restoreAvailabilityServer(booking)

  return { success: true, error: null }
}

/**
 * Server-side version of restoreAvailability
 */
async function restoreAvailabilityServer(booking: Booking): Promise<void> {
  const supabase = createServerClient()

  try {
    switch (booking.booking_type) {
      case 'event':
        // Restore event capacity
        const { data: event } = await supabase
          .from('events')
          .select('available_spots')
          .eq('id', booking.reference_id)
          .single() as any

        if (event) {
          const eventServerUpdateQuery: any = supabase.from('events')
          await eventServerUpdateQuery
            .update({ 
              available_spots: (event as any).available_spots + booking.guests,
              updated_at: new Date().toISOString(),
            })
            .eq('id', booking.reference_id)
        }
        break

      case 'transport':
        // Restore transport seats
        const { data: transport } = await supabase
          .from('transport_options')
          .select('available_seats')
          .eq('id', booking.reference_id)
          .single() as any

        if (transport) {
          const transportServerUpdateQuery: any = supabase.from('transport_options')
          await transportServerUpdateQuery
            .update({ 
              available_seats: (transport as any).available_seats + booking.guests,
              updated_at: new Date().toISOString(),
            })
            .eq('id', booking.reference_id)
        }
        break

      // Accommodation and dining availability is checked dynamically
      case 'accommodation':
      case 'dining':
      case 'flight':
      default:
        // No availability restoration needed
        break
    }
  } catch (error) {
    console.error('Error restoring availability:', error)
    // Don't throw - cancellation should succeed even if availability restoration fails
  }
}
