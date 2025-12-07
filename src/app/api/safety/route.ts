/**
export const dynamic = 'force-dynamic';
 * Safety Information API Routes
 * GET /api/safety - Get safety information with optional filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSafetyInformationServer } from '@/lib/services/safety.service'

export const dynamic = 'force-dynamic';
import { getCacheHeaders } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const country = searchParams.get('country') || undefined
    const city = searchParams.get('city') || undefined
    const category = searchParams.get('category') || undefined
    const safetyLevel = searchParams.get('safetyLevel') as 'low' | 'moderate' | 'high' | 'critical' | undefined

    const { data, error } = await getSafetyInformationServer({
      country,
      city,
      category,
      safetyLevel,
    })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
        headers: getCacheHeaders('SAFETY'),
      }
    )
  } catch (error) {
    console.error('Safety information fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    )
  }
}


