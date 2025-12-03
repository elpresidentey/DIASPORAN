/**
 * Admin Media Upload API Routes
 * POST /api/admin/media - Upload media files to Supabase Storage
 * DELETE /api/admin/media - Delete media files from Supabase Storage
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware/auth.middleware'
import { uploadMedia, deleteMedia } from '@/lib/services/admin.service'

/**
 * POST /api/admin/media
 * Upload media file to Supabase Storage
 */
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const authResult = await requireAdmin()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required field: file',
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
            code: 'VALIDATION_ERROR',
            message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
          },
        },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'File size exceeds maximum allowed size of 10MB',
          },
        },
        { status: 400 }
      )
    }

    // Upload the file
    const result = await uploadMedia(authResult.user.id, file, folder)

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPLOAD_ERROR',
            message: result.error.message || 'Failed to upload file',
            details: result.error,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'An unexpected error occurred',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/media
 * Delete media file from Supabase Storage
 */
export async function DELETE(request: NextRequest) {
  // Verify admin authentication
  const authResult = await requireAdmin()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required parameter: path',
          },
        },
        { status: 400 }
      )
    }

    // Delete the file
    const result = await deleteMedia(authResult.user.id, path)

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DELETE_ERROR',
            message: result.error.message || 'Failed to delete file',
            details: result.error,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'An unexpected error occurred',
        },
      },
      { status: 500 }
    )
  }
}
