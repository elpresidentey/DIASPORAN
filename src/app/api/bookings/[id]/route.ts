/**
 * Booking Details API Route
 * GET /api/bookings/[id] - Get single booking by ID
 * PATCH /api/bookings/[id] - Update booking details
 * DELETE /api/bookings/[id] - Cancel a booking
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { 
  getBookingServer, 
  updateBookingServer, 
  cancelBookingServer 
} from '@/lib/services/booking.service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Booking ID is required',
          },
        },
        { status: 400 }
      )
    }

    const { booking, error } = await getBookingServer(id, user.id)

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
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: booking,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in GET /api/bookings/[id]:', error)
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Booking ID is required',
          },
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { start_date, end_date, guests, special_requests, status } = body

    // Validate that at least one field is being updated
    if (!start_date && !end_date && !guests && !special_requests && !status) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'At least one field must be provided for update',
          },
        },
        { status: 400 }
      )
    }

    const updates: any = {}
    if (start_date !== undefined) updates.start_date = start_date
    if (end_date !== undefined) updates.end_date = end_date
    if (guests !== undefined) updates.guests = guests
    if (special_requests !== undefined) updates.special_requests = special_requests
    if (status !== undefined) updates.status = status

    const { booking, error } = await updateBookingServer(id, user.id, updates)

    if (error) {
      const statusCode = error.code === 'CANNOT_MODIFY' || error.code === 'INVALID_DATE_RANGE' ? 400 : 500
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        { status: statusCode }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: booking,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in PATCH /api/bookings/[id]:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Booking ID is required',
          },
        },
        { status: 400 }
      )
    }

    // Get cancellation reason from request body if provided
    let reason: string | undefined
    try {
      const body = await request.json()
      reason = body.reason
    } catch {
      // No body provided, that's okay
    }

    const { success, error } = await cancelBookingServer(id, user.id, reason)

    if (error) {
      const statusCode = 
        error.code === 'CANNOT_CANCEL' || error.code === 'ALREADY_CANCELLED' ? 400 : 
        error.code === 'BOOKING_NOT_FOUND' ? 404 : 500
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        { status: statusCode }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Booking cancelled successfully',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in DELETE /api/bookings/[id]:', error)
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
