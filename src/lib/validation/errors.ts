/**
 * Error Handling Utilities
 * Standardized error responses and error logging
 */

import { NextResponse } from 'next/server'
import { ZodIssue } from 'zod'

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
    field?: string
    timestamp?: string
    requestId?: string
  }
}

/**
 * Standard success response structure
 */
export interface SuccessResponse<T = any> {
  success: true
  data: T
}

/**
 * API Response type
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

/**
 * Custom error classes
 */
export class ValidationError extends Error {
  public readonly code = 'VALIDATION_ERROR'
  public readonly statusCode = 400
  public readonly issues: ZodIssue[]

  constructor(message: string, issues: ZodIssue[]) {
    super(message)
    this.name = 'ValidationError'
    this.issues = issues
  }
}

export class AuthenticationError extends Error {
  public readonly code = 'UNAUTHORIZED'
  public readonly statusCode = 401

  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  public readonly code = 'FORBIDDEN'
  public readonly statusCode = 403

  constructor(message: string = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error {
  public readonly code = 'NOT_FOUND'
  public readonly statusCode = 404

  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  public readonly code = 'CONFLICT'
  public readonly statusCode = 409

  constructor(message: string, public readonly details?: any) {
    super(message)
    this.name = 'ConflictError'
  }
}

export class BusinessLogicError extends Error {
  public readonly statusCode = 400

  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message)
    this.name = 'BusinessLogicError'
  }
}

export class DatabaseError extends Error {
  public readonly code = 'DATABASE_ERROR'
  public readonly statusCode = 500

  constructor(message: string, public readonly details?: any) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class ExternalServiceError extends Error {
  public readonly code = 'EXTERNAL_SERVICE_ERROR'
  public readonly statusCode = 502

  constructor(message: string, public readonly details?: any) {
    super(message)
    this.name = 'ExternalServiceError'
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: Error | { code: string; message: string; details?: any; field?: string },
  statusCode?: number
): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString()

  // Handle custom error classes
  if (error instanceof ValidationError) {
    const formattedIssues = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }))

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: formattedIssues,
          timestamp,
        },
      },
      { status: error.statusCode }
    )
  }

  if (
    error instanceof AuthenticationError ||
    error instanceof AuthorizationError ||
    error instanceof NotFoundError ||
    error instanceof ConflictError ||
    error instanceof BusinessLogicError ||
    error instanceof DatabaseError ||
    error instanceof ExternalServiceError
  ) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: 'details' in error ? error.details : undefined,
          timestamp,
        },
      },
      { status: error.statusCode }
    )
  }

  // Handle plain error objects
  if ('code' in error && 'message' in error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          field: error.field,
          timestamp,
        },
      },
      { status: statusCode || 500 }
    )
  }

  // Handle generic Error instances
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'An unexpected error occurred',
        timestamp,
      },
    },
    { status: statusCode || 500 }
  )
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  )
}

/**
 * Log error with context
 */
export function logError(
  error: Error,
  context: {
    endpoint?: string
    method?: string
    userId?: string
    requestId?: string
    [key: string]: any
  }
): void {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  }

  // In production, this would send to a logging service
  // For now, we'll use console.error
  console.error('API Error:', JSON.stringify(errorLog, null, 2))
}

/**
 * Handle Supabase errors and convert to standard format
 */
export function handleSupabaseError(error: any): {
  code: string
  message: string
  details?: any
} {
  // PostgreSQL error codes
  const pgErrorCodes: Record<string, { code: string; message: string }> = {
    '23505': {
      code: 'UNIQUE_CONSTRAINT_VIOLATION',
      message: 'A record with this value already exists',
    },
    '23503': {
      code: 'FOREIGN_KEY_VIOLATION',
      message: 'Referenced record does not exist',
    },
    '23502': {
      code: 'NOT_NULL_VIOLATION',
      message: 'Required field is missing',
    },
    '23514': {
      code: 'CHECK_VIOLATION',
      message: 'Value does not meet constraints',
    },
  }

  // Check for PostgreSQL error code
  if (error.code && pgErrorCodes[error.code]) {
    return {
      ...pgErrorCodes[error.code],
      details: error.details || error.message,
    }
  }

  // Handle Supabase-specific errors
  if (error.message) {
    // Row Level Security violation
    if (error.message.includes('row-level security')) {
      return {
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this resource',
      }
    }

    // Not found
    if (error.message.includes('not found') || error.code === 'PGRST116') {
      return {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      }
    }
  }

  // Default database error
  return {
    code: 'DATABASE_ERROR',
    message: 'A database error occurred',
    details: error.message,
  }
}

/**
 * Wrap async route handler with error handling
 */
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      // Log the error
      logError(
        error instanceof Error ? error : new Error('Unknown error'),
        {
          endpoint: 'args' in args && args[0] ? (args[0] as any).url : 'unknown',
          method: 'args' in args && args[0] ? (args[0] as any).method : 'unknown',
        }
      )

      // Return error response
      return createErrorResponse(
        error instanceof Error ? error : new Error('An unexpected error occurred')
      )
    }
  }
}

/**
 * Error response helpers for common scenarios
 */
export const ErrorResponses = {
  unauthorized: (message?: string) =>
    createErrorResponse(new AuthenticationError(message), 401),

  forbidden: (message?: string) =>
    createErrorResponse(new AuthorizationError(message), 403),

  notFound: (resource?: string) =>
    createErrorResponse(
      new NotFoundError(resource ? `${resource} not found` : undefined),
      404
    ),

  conflict: (message: string, details?: any) =>
    createErrorResponse(new ConflictError(message, details), 409),

  validation: (message: string, issues: ZodIssue[]) =>
    createErrorResponse(new ValidationError(message, issues), 400),

  businessLogic: (code: string, message: string, details?: any) =>
    createErrorResponse(new BusinessLogicError(message, code, details), 400),

  database: (message: string, details?: any) =>
    createErrorResponse(new DatabaseError(message, details), 500),

  externalService: (message: string, details?: any) =>
    createErrorResponse(new ExternalServiceError(message, details), 502),

  internal: (message?: string) =>
    createErrorResponse(
      new Error(message || 'An unexpected error occurred'),
      500
    ),
}
