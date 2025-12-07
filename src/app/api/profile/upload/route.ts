/**
export const dynamic = 'force-dynamic';
 * Profile Picture Upload API Route
 * POST /api/profile/upload - Upload a profile picture
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';
import { uploadProfilePictureServer } from '@/lib/services/profile.service'

/**
 * POST /api/profile/upload
 * Upload a profile picture for the current user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_FILE',
            message: 'No file provided',
          },
        },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'Only JPEG, PNG, and WebP images are allowed',
          },
        },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'File size must be less than 5MB',
          },
        },
        { status: 400 }
      )
    }

    // Upload file
    const { url, error } = await uploadProfilePictureServer(user.id, file)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        url,
        message: 'Profile picture uploaded successfully',
      },
    })
  } catch (error) {
    console.error('Profile upload error:', error)
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


