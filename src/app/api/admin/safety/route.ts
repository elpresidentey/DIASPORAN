/**
export const dynamic = 'force-dynamic';
 * Admin Safety Information API Routes
 * POST /api/admin/safety - Create safety information
 * PATCH /api/admin/safety - Update safety information
 * DELETE /api/admin/safety - Delete safety information
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

export const dynamic = 'force-dynamic';
import {
  createSafetyInformationServer,
  updateSafetyInformationServer,
  deleteSafetyInformationServer,
} from '@/lib/services/safety.service'

// Helper function to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  // For now, we'll implement a simple check
  // In production, you'd check against a role in the database or auth metadata
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('users_profiles')
    .select('preferences')
    .eq('id', userId)
    .single<{ preferences: Database['public']['Tables']['users_profiles']['Row']['preferences'] }>()

  if (error || !data) return false
  
  const preferences = data.preferences as Record<string, any> | null
  return preferences?.role === 'admin'
}

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

    // Check admin privileges
    const adminCheck = await isAdmin(user.id)
    if (!adminCheck) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Admin privileges required',
          },
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      country,
      city,
      category,
      title,
      description,
      emergency_contacts,
      safety_level,
    } = body

    // Validate required fields
    if (!country || !category || !title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Country, category, title, and description are required',
          },
        },
        { status: 400 }
      )
    }

    // Validate safety level if provided
    if (safety_level) {
      const validLevels = ['low', 'moderate', 'high', 'critical']
      if (!validLevels.includes(safety_level)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_INPUT',
              message: 'Safety level must be one of: low, moderate, high, critical',
            },
          },
          { status: 400 }
        )
      }
    }

    const { data, error } = await createSafetyInformationServer(user.id, {
      country,
      city: city || null,
      category,
      title,
      description,
      emergency_contacts: emergency_contacts || [],
      safety_level: safety_level || null,
      last_updated: new Date().toISOString(),
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
      { status: 201 }
    )
  } catch (error) {
    console.error('Safety information creation error:', error)
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

export async function PATCH(request: NextRequest) {
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

    // Check admin privileges
    const adminCheck = await isAdmin(user.id)
    if (!adminCheck) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Admin privileges required',
          },
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Safety information ID is required',
          },
        },
        { status: 400 }
      )
    }

    // Validate safety level if provided
    if (updateData.safety_level) {
      const validLevels = ['low', 'moderate', 'high', 'critical']
      if (!validLevels.includes(updateData.safety_level)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_INPUT',
              message: 'Safety level must be one of: low, moderate, high, critical',
            },
          },
          { status: 400 }
        )
      }
    }

    const { data, error } = await updateSafetyInformationServer(id, updateData)

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
      data,
    })
  } catch (error) {
    console.error('Safety information update error:', error)
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

export async function DELETE(request: NextRequest) {
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

    // Check admin privileges
    const adminCheck = await isAdmin(user.id)
    if (!adminCheck) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Admin privileges required',
          },
        },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Safety information ID is required',
          },
        },
        { status: 400 }
      )
    }

    const { success, error } = await deleteSafetyInformationServer(id)

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
      message: 'Safety information deleted successfully',
    })
  } catch (error) {
    console.error('Safety information deletion error:', error)
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


