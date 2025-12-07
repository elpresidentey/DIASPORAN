/**
export const dynamic = 'force-dynamic';
 * Safety Reports API Routes
 * POST /api/safety/reports - Create a safety report
 * GET /api/safety/reports - Get safety reports (user's own or all for admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';
import {
  createSafetyReportServer,
  getUserSafetyReports,
  getAllSafetyReportsServer,
  type CreateSafetyReportData,
} from '@/lib/services/safety.service'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Check authentication
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

    const body = await request.json()
    const { location, latitude, longitude, category, description, severity } = body

    // Validate required fields
    if (!location || !category || !description || !severity) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Location, category, description, and severity are required',
          },
        },
        { status: 400 }
      )
    }

    // Validate severity
    const validSeverities = ['low', 'moderate', 'high', 'critical']
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Severity must be one of: low, moderate, high, critical',
          },
        },
        { status: 400 }
      )
    }

    const reportData: CreateSafetyReportData = {
      location,
      latitude,
      longitude,
      category,
      description,
      severity,
    }

    const { report, error } = await createSafetyReportServer(user.id, reportData)

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
        data: report,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Safety report creation error:', error)
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

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Check authentication
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

    // Get user's own reports
    const { reports, error } = await getUserSafetyReports(user.id)

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

    return NextResponse.json({
      success: true,
      data: reports,
    })
  } catch (error) {
    console.error('Safety reports fetch error:', error)
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


