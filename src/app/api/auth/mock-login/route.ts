/**
 * Mock Authentication API Route
 * POST /api/auth/mock-login - Create a mock user session for testing
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, full_name, phone } = body

    if (!email || !full_name) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and full name are required',
          },
        },
        { status: 400 }
      )
    }

    // Create a mock user
    const mockUser = {
      id: 'mock-user-' + Date.now(),
      email,
      user_metadata: {
        full_name,
        phone: phone || null,
      },
      created_at: new Date().toISOString(),
    }

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token-' + Date.now(),
      expires_at: Date.now() + 3600000, // 1 hour
      token_type: 'bearer',
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: mockUser,
          session: mockSession,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in POST /api/auth/mock-login:', error)
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