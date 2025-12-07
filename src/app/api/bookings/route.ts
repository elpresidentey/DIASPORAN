/**
export const dynamic = 'force-dynamic';
 * Bookings API Route
 * POST /api/bookings - Create a new booking
 * GET /api/bookings - Get user's bookings
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAccommodationBooking } from '@/lib/services/accommodation.service'
import { registerForEvent } from '@/lib/services/event.service'
import { createTransportBooking } from '@/lib/services/transport.service'
import { getUserBookingsServer } from '@/lib/services/booking.service'

export const dynamic = 'force-dynamic';
import {
  validateBody,
  validateQuery,
  schemas,
  createSuccessResponse,
  ErrorResponses,
  logError,
} from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return ErrorResponses.unauthorized()
    }

    // Validate request body
    const { data: validatedData, error: validationError } = await validateBody(
      request,
      schemas.createBooking
    )

    if (validationError || !validatedData) {
      return validationError || ErrorResponses.validation('Validation failed', [])
    }

    const {
      booking_type,
      reference_id,
      start_date,
      end_date,
      guests,
      special_requests,
      ticket_type,
    } = validatedData

    // Handle accommodation bookings
    if (booking_type === 'accommodation') {
      const { booking, error } = await createAccommodationBooking(
        user.id,
        reference_id,
        start_date,
        end_date!,
        guests,
        special_requests
      )

      if (error) {
        const statusCode = error.code === 'NOT_AVAILABLE' ? 409 : 500
        logError(new Error(error.message), {
          endpoint: '/api/bookings',
          method: 'POST',
          userId: user.id,
          bookingType: booking_type,
          errorCode: error.code,
        })
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

      return createSuccessResponse(booking, 201)
    }

    // Handle event bookings
    if (booking_type === 'event') {
      const { booking, error } = await registerForEvent(
        user.id,
        reference_id,
        guests, // number of tickets
        ticket_type,
        special_requests
      )

      if (error) {
        const statusCode = 
          error.code === 'SOLD_OUT' || error.code === 'INSUFFICIENT_CAPACITY' ? 409 : 500
        logError(new Error(error.message), {
          endpoint: '/api/bookings',
          method: 'POST',
          userId: user.id,
          bookingType: booking_type,
          errorCode: error.code,
        })
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

      return createSuccessResponse(booking, 201)
    }

    // Handle transport bookings
    if (booking_type === 'transport') {
      const { booking, error } = await createTransportBooking(
        user.id,
        reference_id,
        start_date, // travel date
        guests, // number of passengers
        special_requests
      )

      if (error) {
        const statusCode = error.code === 'INSUFFICIENT_SEATS' ? 409 : 500
        logError(new Error(error.message), {
          endpoint: '/api/bookings',
          method: 'POST',
          userId: user.id,
          bookingType: booking_type,
          errorCode: error.code,
        })
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

      return createSuccessResponse(booking, 201)
    }

    // For other booking types, we'll implement them in future tasks
    return ErrorResponses.businessLogic(
      'NOT_IMPLEMENTED',
      `Booking type ${booking_type} is not yet implemented`
    )
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/bookings',
      method: 'POST',
    })
    return ErrorResponses.internal()
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return ErrorResponses.unauthorized()
    }

    // Validate query parameters
    const { data: filters, error: validationError } = validateQuery(
      request,
      schemas.bookingFilters
    )

    if (validationError || !filters) {
      return validationError || ErrorResponses.validation('Validation failed', [])
    }

    const { data, error } = await getUserBookingsServer(user.id, filters)

    if (error) {
      logError(new Error(error.message), {
        endpoint: '/api/bookings',
        method: 'GET',
        userId: user.id,
        errorCode: error.code,
      })
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

    return createSuccessResponse(data)
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/bookings',
      method: 'GET',
    })
    return ErrorResponses.internal()
  }
}


