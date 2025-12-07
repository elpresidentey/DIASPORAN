/**
export const dynamic = 'force-dynamic';
 * Admin Listings API Routes
 * POST /api/admin/listings - Create a new listing
 * GET /api/admin/listings - Get all listings (including soft-deleted)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware/auth.middleware'

export const dynamic = 'force-dynamic';
import {
  createListing,
  getAdminListings,
  type ListingType,
  type CreateListingInput,
  type AdminListingFilters,
} from '@/lib/services/admin.service'

/**
 * POST /api/admin/listings
 * Create a new listing with admin attribution
 */
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const authResult = await requireAdmin()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const body = await request.json()
    const { type, data } = body as CreateListingInput

    // Validate required fields
    if (!type || !data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: type and data',
          },
        },
        { status: 400 }
      )
    }

    // Validate listing type
    const validTypes: ListingType[] = [
      'dining_venues',
      'accommodations',
      'events',
      'transport_options',
    ]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Invalid listing type. Must be one of: ${validTypes.join(', ')}`,
          },
        },
        { status: 400 }
      )
    }

    // Create the listing
    const result = await createListing(authResult.user.id, { type, data })

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: result.error.message || 'Failed to create listing',
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
 * GET /api/admin/listings
 * Get all listings with admin privileges (includes soft-deleted)
 */
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const authResult = await requireAdmin()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as ListingType
    const includeDeleted = searchParams.get('includeDeleted') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const city = searchParams.get('city') || undefined
    const country = searchParams.get('country') || undefined

    // Validate listing type
    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required parameter: type',
          },
        },
        { status: 400 }
      )
    }

    const validTypes: ListingType[] = [
      'dining_venues',
      'accommodations',
      'events',
      'transport_options',
    ]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Invalid listing type. Must be one of: ${validTypes.join(', ')}`,
          },
        },
        { status: 400 }
      )
    }

    const filters: AdminListingFilters = {
      includeDeleted,
      page,
      limit,
      city,
      country,
    }

    // Get listings
    const result = await getAdminListings(authResult.user.id, type, filters)

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: result.error.message || 'Failed to fetch listings',
            details: result.error,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
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


