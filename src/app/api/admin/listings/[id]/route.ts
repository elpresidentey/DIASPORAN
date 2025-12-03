/**
 * Admin Listing Detail API Routes
 * GET /api/admin/listings/[id] - Get a specific listing (including soft-deleted)
 * PATCH /api/admin/listings/[id] - Update a listing
 * DELETE /api/admin/listings/[id] - Soft delete a listing
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware/auth.middleware'
import {
  getAdminListing,
  updateListing,
  softDeleteListing,
  restoreListing,
  type ListingType,
  type UpdateListingInput,
  type DeleteListingInput,
} from '@/lib/services/admin.service'

/**
 * GET /api/admin/listings/[id]
 * Get a specific listing with admin privileges (includes soft-deleted)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify admin authentication
  const authResult = await requireAdmin()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as ListingType

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

    const result = await getAdminListing(authResult.user.id, type, params.id)

    if (result.error) {
      if (result.error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Listing not found',
            },
          },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: result.error.message || 'Failed to fetch listing',
            details: result.error,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
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

/**
 * PATCH /api/admin/listings/[id]
 * Update a listing
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify admin authentication
  const authResult = await requireAdmin()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const body = await request.json()
    const { type, data, restore } = body

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required field: type',
          },
        },
        { status: 400 }
      )
    }

    // Handle restore operation
    if (restore === true) {
      const result = await restoreListing(authResult.user.id, {
        type,
        id: params.id,
      })

      if (result.error) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'DATABASE_ERROR',
              message: result.error.message || 'Failed to restore listing',
              details: result.error,
            },
          },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: result.data,
      })
    }

    // Handle regular update
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required field: data',
          },
        },
        { status: 400 }
      )
    }

    const updateInput: UpdateListingInput = {
      type,
      id: params.id,
      data,
    }

    const result = await updateListing(authResult.user.id, updateInput)

    if (result.error) {
      if (result.error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Listing not found',
            },
          },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: result.error.message || 'Failed to update listing',
            details: result.error,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
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

/**
 * DELETE /api/admin/listings/[id]
 * Soft delete a listing and cancel future bookings
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify admin authentication
  const authResult = await requireAdmin()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as ListingType

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

    const deleteInput: DeleteListingInput = {
      type,
      id: params.id,
    }

    const result = await softDeleteListing(authResult.user.id, deleteInput)

    if (result.error) {
      if (result.error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Listing not found',
            },
          },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: result.error.message || 'Failed to delete listing',
            details: result.error,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Listing soft deleted and future bookings cancelled',
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
