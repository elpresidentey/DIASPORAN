/**
export const dynamic = 'force-dynamic';
 * GET /api/auth/me
 * Returns the current authenticated user's information
 */

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';
import { requireAuth } from '@/lib/middleware/auth.middleware'

export async function GET() {
  const authResult = await requireAuth()

  if (authResult.error) {
    return authResult.error
  }

  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
        user_metadata: authResult.user.user_metadata,
        created_at: authResult.user.created_at,
      },
    },
  })
}


