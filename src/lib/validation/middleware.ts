/**
 * Validation Middleware
 * Request validation utilities for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError, ZodSchema } from 'zod'
import { createErrorResponse, ValidationError } from './errors'

/**
 * Validate request body against a Zod schema
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T | null; error: NextResponse | null }> {
  try {
    const body = await request.json()
    const validatedData = schema.parse(body)
    return { data: validatedData, error: null }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        data: null,
        error: createErrorResponse(
          new ValidationError('Validation failed', error.issues),
          400
        ),
      }
    }
    if (error instanceof SyntaxError) {
      return {
        data: null,
        error: createErrorResponse(
          {
            code: 'INVALID_JSON',
            message: 'Invalid JSON in request body',
          },
          400
        ),
      }
    }
    return {
      data: null,
      error: createErrorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Failed to validate request body',
        },
        400
      ),
    }
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): { data: T | null; error: NextResponse | null } {
  try {
    const { searchParams } = new URL(request.url)
    const queryObject: Record<string, any> = {}

    // Convert URLSearchParams to plain object
    searchParams.forEach((value, key) => {
      // Handle array parameters (e.g., ?amenities=wifi&amenities=pool)
      if (queryObject[key]) {
        if (Array.isArray(queryObject[key])) {
          queryObject[key].push(value)
        } else {
          queryObject[key] = [queryObject[key], value]
        }
      } else {
        queryObject[key] = value
      }
    })

    const validatedData = schema.parse(queryObject)
    return { data: validatedData, error: null }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        data: null,
        error: createErrorResponse(
          new ValidationError('Query parameter validation failed', error.issues),
          400
        ),
      }
    }
    return {
      data: null,
      error: createErrorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Failed to validate query parameters',
        },
        400
      ),
    }
  }
}

/**
 * Validate route parameters against a Zod schema
 */
export function validateParams<T>(
  params: Record<string, string>,
  schema: ZodSchema<T>
): { data: T | null; error: NextResponse | null } {
  try {
    const validatedData = schema.parse(params)
    return { data: validatedData, error: null }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        data: null,
        error: createErrorResponse(
          new ValidationError('Route parameter validation failed', error.issues),
          400
        ),
      }
    }
    return {
      data: null,
      error: createErrorResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Failed to validate route parameters',
        },
        400
      ),
    }
  }
}

/**
 * Validate UUID parameter
 */
export function validateUuidParam(
  id: string,
  paramName: string = 'id'
): { valid: boolean; error: NextResponse | null } {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(id)) {
    return {
      valid: false,
      error: createErrorResponse(
        {
          code: 'INVALID_UUID',
          message: `Invalid ${paramName} format`,
          field: paramName,
        },
        400
      ),
    }
  }

  return { valid: true, error: null }
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: string,
  endDate: string
): { valid: boolean; error: NextResponse | null } {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime())) {
      return {
        valid: false,
        error: createErrorResponse(
          {
            code: 'INVALID_DATE',
            message: 'Invalid start date format',
            field: 'start_date',
          },
          400
        ),
      }
    }

    if (isNaN(end.getTime())) {
      return {
        valid: false,
        error: createErrorResponse(
          {
            code: 'INVALID_DATE',
            message: 'Invalid end date format',
            field: 'end_date',
          },
          400
        ),
      }
    }

    if (end <= start) {
      return {
        valid: false,
        error: createErrorResponse(
          {
            code: 'INVALID_DATE_RANGE',
            message: 'End date must be after start date',
            field: 'end_date',
          },
          400
        ),
      }
    }

    return { valid: true, error: null }
  } catch (error) {
    return {
      valid: false,
      error: createErrorResponse(
        {
          code: 'DATE_VALIDATION_ERROR',
          message: 'Failed to validate date range',
        },
        400
      ),
    }
  }
}

/**
 * Validate enum value
 */
export function validateEnum<T extends string>(
  value: string,
  allowedValues: readonly T[],
  fieldName: string
): { valid: boolean; error: NextResponse | null } {
  if (!allowedValues.includes(value as T)) {
    return {
      valid: false,
      error: createErrorResponse(
        {
          code: 'INVALID_ENUM_VALUE',
          message: `Invalid ${fieldName}. Allowed values: ${allowedValues.join(', ')}`,
          field: fieldName,
        },
        400
      ),
    }
  }

  return { valid: true, error: null }
}

/**
 * Validate foreign key reference exists
 * This is a helper that should be used in service layer after DB query
 */
export function createForeignKeyError(
  fieldName: string,
  value: string
): NextResponse {
  return createErrorResponse(
    {
      code: 'FOREIGN_KEY_VIOLATION',
      message: `Referenced ${fieldName} does not exist`,
      field: fieldName,
      details: { value },
    },
    400
  )
}

/**
 * Validate unique constraint
 * This is a helper that should be used in service layer after DB query
 */
export function createUniqueConstraintError(
  fieldName: string,
  value: string
): NextResponse {
  return createErrorResponse(
    {
      code: 'UNIQUE_CONSTRAINT_VIOLATION',
      message: `${fieldName} already exists`,
      field: fieldName,
      details: { value },
    },
    409
  )
}
