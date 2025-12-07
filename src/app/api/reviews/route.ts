/**
export const dynamic = 'force-dynamic';
 * Reviews API Routes
 * POST /api/reviews - Create a new review
 * GET /api/reviews - List reviews with filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getCacheHeaders } from '@/lib/cache'

export const dynamic = 'force-dynamic';
import { 
  createReviewServer, 
  getReviewsServer,
  type CreateReviewInput,
  type ReviewFilters 
} from '@/lib/services/review.service'

/**
 * POST /api/reviews
 * Create a new review
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['booking_id', 'listing_type', 'listing_id', 'rating', 'title', 'comment']
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Missing required fields: ${missingFields.join(', ')}`,
          },
        },
        { status: 400 }
      )
    }

    // Validate listing_type
    const validListingTypes = ['dining', 'accommodation', 'event', 'transport']
    if (!validListingTypes.includes(body.listing_type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Invalid listing_type. Must be one of: ${validListingTypes.join(', ')}`,
          },
        },
        { status: 400 }
      )
    }

    // Validate rating
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

    // Prepare review data
    const reviewData: CreateReviewInput = {
      booking_id: body.booking_id,
      listing_type: body.listing_type,
      listing_id: body.listing_id,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      images: body.images || [],
    }

    // Create review
    const { review, error } = await createReviewServer(user.id, reviewData)

    if (error) {
      const statusCode = 
        error.code === 'BOOKING_NOT_FOUND' ? 404 :
        error.code === 'BOOKING_NOT_COMPLETED' ? 403 :
        error.code === 'REVIEW_EXISTS' ? 409 :
        error.code === 'INVALID_RATING' ? 400 :
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
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating review:', error)
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
 * GET /api/reviews
 * List reviews with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const filters: ReviewFilters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      listing_type: searchParams.get('listing_type') || undefined,
      listing_id: searchParams.get('listing_id') || undefined,
      user_id: searchParams.get('user_id') || undefined,
      min_rating: searchParams.get('min_rating') ? parseInt(searchParams.get('min_rating')!) : undefined,
      max_rating: searchParams.get('max_rating') ? parseInt(searchParams.get('max_rating')!) : undefined,
      sortBy: (searchParams.get('sortBy') as 'created_at' | 'rating' | 'helpful_count') || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    }

    // Validate pagination
    if (filters.page! < 1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Page must be greater than 0',
          },
        },
        { status: 400 }
      )
    }

    if (filters.limit! < 1 || filters.limit! > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Limit must be between 1 and 100',
          },
        },
        { status: 400 }
      )
    }

    // Get reviews
    const { data, error } = await getReviewsServer(filters)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: data!.data,
        pagination: data!.pagination,
      },
      { 
        status: 200,
        headers: getCacheHeaders('REVIEWS'),
      }
    )
  } catch (error) {
    console.error('Error fetching reviews:', error)
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


