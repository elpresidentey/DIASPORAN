/**
 * Profile API Route
 * GET /api/profile - Get user profile
 * PUT /api/profile - Update user profile
 * DELETE /api/profile - Delete user account
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';

/**
 * GET /api/profile - Get user profile
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to view profile',
          },
        },
        { status: 401 }
      )
    }

    // Get profile from profiles table if it exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROFILE_FETCH_ERROR',
            message: 'Failed to fetch profile',
            details: profileError,
          },
        },
        { status: 500 }
      )
    }

    // Combine auth user data with profile data
    const userProfile = {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name,
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
      phone: profile?.phone || user.phone,
      bio: profile?.bio,
      created_at: user.created_at,
      updated_at: profile?.updated_at || user.updated_at,
    }

    return NextResponse.json(
      {
        success: true,
        data: userProfile,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in GET /api/profile:', error)
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
 * PUT /api/profile - Update user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to update profile',
          },
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { full_name, phone, bio, avatar_url } = body

    // Validate input
    if (full_name && typeof full_name !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Full name must be a string',
          },
        },
        { status: 400 }
      )
    }

    // Update or insert profile
    const profileData = {
      id: user.id,
      full_name: full_name || null,
      phone: phone || null,
      bio: bio || null,
      avatar_url: avatar_url || null,
      updated_at: new Date().toISOString(),
    }

    const { data: profile, error: upsertError } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .single()

    if (upsertError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPDATE_FAILED',
            message: 'Failed to update profile',
            details: upsertError,
          },
        },
        { status: 500 }
      )
    }

    // Also update auth metadata if needed
    if (full_name || avatar_url) {
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: full_name,
          avatar_url: avatar_url,
        }
      })

      if (authUpdateError) {
        console.error('Failed to update auth metadata:', authUpdateError)
        // Don't fail the request if auth update fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: profile,
        message: 'Profile updated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in PUT /api/profile:', error)
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
 * DELETE /api/profile - Delete user account
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to delete account',
          },
        },
        { status: 401 }
      )
    }

    // Delete user profile data
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (profileDeleteError) {
      console.error('Failed to delete profile:', profileDeleteError)
      // Continue with account deletion even if profile deletion fails
    }

    // Delete user bookings
    const { error: bookingsDeleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('user_id', user.id)

    if (bookingsDeleteError) {
      console.error('Failed to delete bookings:', bookingsDeleteError)
      // Continue with account deletion even if bookings deletion fails
    }

    // Delete the auth user (this will cascade delete related data)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

    if (deleteError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DELETE_FAILED',
            message: 'Failed to delete account',
            details: deleteError,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in DELETE /api/profile:', error)
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