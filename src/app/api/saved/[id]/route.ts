/**
 * Saved Item by ID API Route
 * DELETE /api/saved/[id] - Remove a saved item
 */

import { NextRequest, NextResponse } from 'next/server'
import { removeSavedItemServer } from '@/lib/services/saved-items.service'
import { getCurrentUser } from '@/lib/services/auth.service'

/**
 * DELETE - Remove a saved item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user
    const { user, error: authError } = await getCurrentUser()

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

    const savedItemId = params.id

    if (!savedItemId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Saved item ID is required',
          },
        },
        { status: 400 }
      )
    }

    // Remove saved item
    const { success, error } = await removeSavedItemServer(user.id, savedItemId)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Item removed from saved items' },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Remove saved item API error:', error)
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
