/**
 * Saved Items API Route
 * POST /api/saved - Save an item
 * GET /api/saved - Get user's saved items
 */

import { NextRequest, NextResponse } from 'next/server'
import { saveItemServer, getSavedItemsServer } from '@/lib/services/saved-items.service'
import { getCurrentUser } from '@/lib/services/auth.service'
import type { Database } from '@/types/supabase'

type ItemType = Database['public']['Tables']['saved_items']['Row']['item_type']

/**
 * POST - Save an item
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { itemType, itemId, notes } = body

    if (!itemType || !itemId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Item type and item ID are required',
          },
        },
        { status: 400 }
      )
    }

    // Validate item type
    const validItemTypes: ItemType[] = ['dining', 'accommodation', 'flight', 'event', 'transport']
    if (!validItemTypes.includes(itemType)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ITEM_TYPE',
            message: 'Invalid item type. Must be one of: dining, accommodation, flight, event, transport',
          },
        },
        { status: 400 }
      )
    }

    // Save item
    const { savedItem, error } = await saveItemServer(user.id, itemType, itemId, notes)

    if (error) {
      const statusCode = error.code === 'ALREADY_SAVED' ? 409 : 
                        error.code === 'ITEM_NOT_FOUND' ? 404 : 500

      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        { status: statusCode }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: savedItem,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Save item API error:', error)
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
 * GET - Get user's saved items
 */
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const itemType = searchParams.get('itemType') as ItemType | null

    // Validate item type if provided
    if (itemType) {
      const validItemTypes: ItemType[] = ['dining', 'accommodation', 'flight', 'event', 'transport']
      if (!validItemTypes.includes(itemType)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ITEM_TYPE',
              message: 'Invalid item type. Must be one of: dining, accommodation, flight, event, transport',
            },
          },
          { status: 400 }
        )
      }
    }

    // Fetch saved items
    const { items, error } = await getSavedItemsServer(user.id, itemType || undefined)

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
        data: items,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get saved items API error:', error)
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
