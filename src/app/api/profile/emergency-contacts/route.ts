/**
 * Emergency Contacts API Routes
 * POST /api/profile/emergency-contacts - Save emergency contacts
 * GET /api/profile/emergency-contacts - Get emergency contacts
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import {
  saveEmergencyContactsServer,
  getEmergencyContacts,
  type EmergencyContact,
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
    const { contacts } = body

    if (!contacts || !Array.isArray(contacts)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Contacts must be an array',
          },
        },
        { status: 400 }
      )
    }

    // Validate contact structure
    for (const contact of contacts) {
      if (!contact.name || !contact.phone) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_INPUT',
              message: 'Each contact must have name and phone',
            },
          },
          { status: 400 }
        )
      }
    }

    const { success, error } = await saveEmergencyContactsServer(user.id, contacts)

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
      message: 'Emergency contacts saved successfully',
    })
  } catch (error) {
    console.error('Emergency contacts save error:', error)
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

    const { contacts, error } = await getEmergencyContacts(user.id)

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
      data: contacts,
    })
  } catch (error) {
    console.error('Emergency contacts fetch error:', error)
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
