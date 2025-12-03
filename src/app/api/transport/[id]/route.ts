/**
 * Transport Details API Routes
 * GET /api/transport/[id] - Get transport option details
 */

import { NextRequest, NextResponse } from 'next/server'
import { getTransportOptionServer } from '@/lib/services/transport.service'

/**
 * GET /api/transport/[id]
 * Get detailed information about a specific transport option
 */
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
            message: 'Transport option ID is required',
          },
        },
        { status: 400 }
      )
    }

    const { transport, error } = await getTransportOptionServer(id)

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
        { status: error.code === 'NOT_FOUND' ? 404 : 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: transport,
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Transport details error:', error)
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
