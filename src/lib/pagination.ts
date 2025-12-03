/**
 * Pagination Utilities
 * Provides cursor-based and offset-based pagination helpers
 */

export interface OffsetPaginationParams {
  page: number
  limit: number
}

export interface CursorPaginationParams {
  cursor?: string
  limit: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface CursorPaginationMeta {
  limit: number
  nextCursor?: string
  prevCursor?: string
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Calculate offset pagination range for Supabase query
 */
export function getOffsetRange(page: number, limit: number): { from: number; to: number } {
  const from = (page - 1) * limit
  const to = from + limit - 1
  return { from, to }
}

/**
 * Build pagination metadata from query results
 */
export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit)
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

/**
 * Encode cursor for cursor-based pagination
 * Cursor format: base64(id:timestamp)
 */
export function encodeCursor(id: string, timestamp: string): string {
  const cursorData = `${id}:${timestamp}`
  return Buffer.from(cursorData).toString('base64')
}

/**
 * Decode cursor for cursor-based pagination
 */
export function decodeCursor(cursor: string): { id: string; timestamp: string } | null {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
    const [id, timestamp] = decoded.split(':')
    
    if (!id || !timestamp) {
      return null
    }
    
    return { id, timestamp }
  } catch {
    return null
  }
}

/**
 * Build cursor pagination metadata
 */
export function buildCursorPaginationMeta<T extends { id: string; created_at: string }>(
  data: T[],
  limit: number,
  requestedCursor?: string
): CursorPaginationMeta {
  const hasNext = data.length === limit
  const hasPrev = !!requestedCursor
  
  let nextCursor: string | undefined
  let prevCursor: string | undefined
  
  if (hasNext && data.length > 0) {
    const lastItem = data[data.length - 1]
    nextCursor = encodeCursor(lastItem.id, lastItem.created_at)
  }
  
  if (hasPrev && data.length > 0) {
    const firstItem = data[0]
    prevCursor = encodeCursor(firstItem.id, firstItem.created_at)
  }
  
  return {
    limit,
    nextCursor,
    prevCursor,
    hasNext,
    hasPrev,
  }
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(
  page?: number,
  limit?: number
): { page: number; limit: number; error?: string } {
  const validatedPage = page && page > 0 ? page : 1
  const validatedLimit = limit && limit > 0 && limit <= 100 ? limit : 20
  
  if (page && page < 1) {
    return { page: validatedPage, limit: validatedLimit, error: 'Page must be greater than 0' }
  }
  
  if (limit && (limit < 1 || limit > 100)) {
    return { page: validatedPage, limit: validatedLimit, error: 'Limit must be between 1 and 100' }
  }
  
  return { page: validatedPage, limit: validatedLimit }
}
