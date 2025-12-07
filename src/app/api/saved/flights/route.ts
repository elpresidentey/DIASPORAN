/**
export const dynamic = 'force-dynamic';
 * Saved Flights API Route
 * GET /api/saved/flights - Get user's saved flights
 * POST /api/saved/flights - Save a flight
 * DELETE /api/saved/flights - Remove a saved flight
 */

import { NextRequest, NextResponse } from 'next/server'
import { saveFlight, unsaveFlight, getSavedFlights } from '@/lib/services/flight.service'

export const dynamic = 'force-dynamic';
import { getCurrentUser } from '@/lib/services/auth.service'

/**
 * GET - Get user's saved flights
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { user, error: authError } = await getCurrentUser()

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

    // Fetch saved flights
    const { flights, error } = await getSavedFlights(user.id)

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
        data: flights,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get saved flights API error:', error)
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
 * POST - Save a flight
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { user, error: authError } = await getCurrentUser()

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

    // Parse request body
    const body = await request.json()
    const { flightId, notes } = body

    if (!flightId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Flight ID is required',
          },
        },
        { status: 400 }
      )
    }

    // Save flight
    const { savedItem, error } = await saveFlight(user.id, flightId, notes)

    if (error) {
      const statusCode = error.code === 'ALREADY_SAVED' ? 409 : 
                        error.code === 'FLIGHT_NOT_FOUND' ? 404 : 500

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
        data: savedItem,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Save flight API error:', error)
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
 * DELETE - Remove a saved flight
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user
    const { user, error: authError } = await getCurrentUser()

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

    // Parse request body
    const body = await request.json()
    const { flightId } = body

    if (!flightId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Flight ID is required',
          },
        },
        { status: 400 }
      )
    }

    // Remove saved flight
    const { success, error } = await unsaveFlight(user.id, flightId)

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
        data: { message: 'Flight removed from saved items' },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Remove saved flight API error:', error)
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


