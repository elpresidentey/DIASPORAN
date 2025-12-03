/**
 * Accommodation Details API Route
 * GET /api/stays/[id] - Get single accommodation by ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAccommodationServer } from '@/lib/services/accommodation.service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Accommodation ID is required',
          },
        },
        { status: 400 }
      )
    }

    const { accommodation, error } = await getAccommodationServer(id)

    if (error) {
      const statusCode = error.code === 'NOT_FOUND' ? 404 : 500
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
        data: accommodation,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
        },
      }
    )
  } catch (error) {
    console.error('Error in GET /api/stays/[id]:', error)
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
