/**
 * Individual Review API Routes
 * GET /api/reviews/[id] - Get a specific review
 * PATCH /api/reviews/[id] - Update a review
 * DELETE /api/reviews/[id] - Delete a review
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import {
  getReviewServer,
  updateReviewServer,
  deleteReviewServer,
  type UpdateReviewInput,
} from '@/lib/services/review.service'

/**
 * GET /api/reviews/[id]
 * Get a specific review by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(reviewId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid review ID format',
          },
        },
        { status: 400 }
      )
    }

    // Get review
    const { review, error } = await getReviewServer(reviewId)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: error.code === 'NOT_FOUND' ? 404 : 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: review,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching review:', error)
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

/**
 * PATCH /api/reviews/[id]
 * Update a review
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

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

    const reviewId = params.id

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(reviewId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid review ID format',
          },
        },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Validate that at least one field is being updated
    const allowedFields = ['rating', 'title', 'comment', 'images']
    const hasValidField = allowedFields.some(field => body[field] !== undefined)

    if (!hasValidField) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'At least one field must be provided for update',
          },
        },
        { status: 400 }
      )
    }

    // Validate rating if provided
    if (body.rating !== undefined) {
      if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Rating must be a number between 1 and 5',
            },
          },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updates: UpdateReviewInput = {}
    if (body.rating !== undefined) updates.rating = body.rating
    if (body.title !== undefined) updates.title = body.title
    if (body.comment !== undefined) updates.comment = body.comment
    if (body.images !== undefined) updates.images = body.images

    // Update review
    const { review, error } = await updateReviewServer(reviewId, user.id, updates)

    if (error) {
      const statusCode =
        error.code === 'INVALID_RATING' ? 400 :
        error.code === 'UPDATE_FAILED' ? 403 :
        500

      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: statusCode }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: review,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating review:', error)
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

/**
 * DELETE /api/reviews/[id]
 * Delete a review
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

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

    const reviewId = params.id

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(reviewId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid review ID format',
          },
        },
        { status: 400 }
      )
    }

    // Delete review
    const { success, error } = await deleteReviewServer(reviewId, user.id)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: error.code === 'DELETE_FAILED' ? 403 : 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Review deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting review:', error)
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
