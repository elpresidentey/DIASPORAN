/**
export const dynamic = 'force-dynamic';
 * Profile API Routes
 * GET /api/profile - Get current user's profile
 * PATCH /api/profile - Update current user's profile
 * DELETE /api/profile - Delete current user's account
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import {
  getProfileServer,
  updateProfileServer,
  deleteAccount,
  getProfileWithStats,
} from '@/lib/services/profile.service'
import type { UpdateProfileData } from '@/lib/services/profile.service'

export const dynamic = 'force-dynamic';
import {
  validateBody,
  schemas,
  createSuccessResponse,
  ErrorResponses,
  logError,
} from '@/lib/validation'

/**
 * GET /api/profile
 * Get the current user's profile with statistics
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return ErrorResponses.unauthorized()
    }

    // Get profile with stats
    const { profile, error } = await getProfileServer(user.id)

    if (error) {
      logError(new Error(error.message), {
        endpoint: '/api/profile',
        method: 'GET',
        userId: user.id,
        errorCode: error.code,
      })
      return ErrorResponses.notFound('Profile')
    }

    // Get statistics
    const [bookingsResult, reviewsResult, savedItemsResult] = await Promise.all([
      supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('saved_items').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ])

    const profileWithStats = {
      ...profile,
      total_bookings: bookingsResult.count || 0,
      total_reviews: reviewsResult.count || 0,
      total_saved_items: savedItemsResult.count || 0,
    }

    return createSuccessResponse(profileWithStats)
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/profile',
      method: 'GET',
    })
    return ErrorResponses.internal()
  }
}

/**
 * PATCH /api/profile
 * Update the current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return ErrorResponses.unauthorized()
    }

    // Validate request body
    const { data: updateData, error: validationError } = await validateBody(
      request,
      schemas.updateProfile
    )

    if (validationError || !updateData) {
      return validationError || ErrorResponses.validation('Validation failed', [])
    }

    // Update profile
    const { profile, error } = await updateProfileServer(user.id, updateData)

    if (error) {
      logError(new Error(error.message), {
        endpoint: '/api/profile',
        method: 'PATCH',
        userId: user.id,
        errorCode: error.code,
      })
      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: 400 }
      )
    }

    return createSuccessResponse(profile)
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/profile',
      method: 'PATCH',
    })
    return ErrorResponses.internal()
  }
}

/**
 * DELETE /api/profile
 * Delete the current user's account and all associated data
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return ErrorResponses.unauthorized()
    }

    // Delete account
    const { success, error } = await deleteAccount(user.id)

    if (error) {
      logError(new Error(error.message), {
        endpoint: '/api/profile',
        method: 'DELETE',
        userId: user.id,
        errorCode: error.code,
      })
      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: 400 }
      )
    }

    return createSuccessResponse({
      message: 'Account deleted successfully',
    })
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/profile',
      method: 'DELETE',
    })
    return ErrorResponses.internal()
  }
}


