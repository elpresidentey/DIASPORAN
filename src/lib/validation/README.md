# Validation and Error Handling

This module provides comprehensive data validation and error handling for the DettyConnect API.

## Features

- **Schema Validation**: Zod-based validation schemas for all API inputs
- **Request Validation**: Middleware for validating request bodies, query parameters, and route params
- **Error Handling**: Standardized error responses with proper HTTP status codes
- **Error Logging**: Contextual error logging for debugging and monitoring
- **Type Safety**: Full TypeScript support with inferred types

## Usage

### Validating Request Body

```typescript
import { validateBody, schemas, createSuccessResponse } from '@/lib/validation'

export async function POST(request: NextRequest) {
  // Validate request body
  const { data, error } = await validateBody(request, schemas.createBooking)
  
  if (error) {
    return error // Returns formatted error response
  }

  // data is now typed and validated
  const booking = await createBooking(data)
  
  return createSuccessResponse(booking, 201)
}
```

### Validating Query Parameters

```typescript
import { validateQuery, schemas } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const { data, error } = validateQuery(request, schemas.bookingFilters)
  
  if (error) {
    return error
  }

  const bookings = await getBookings(data)
  return createSuccessResponse(bookings)
}
```

### Validating Route Parameters

```typescript
import { validateUuidParam, ErrorResponses } from '@/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { valid, error } = validateUuidParam(params.id)
  
  if (!valid) {
    return error
  }

  const booking = await getBooking(params.id)
  
  if (!booking) {
    return ErrorResponses.notFound('Booking')
  }

  return createSuccessResponse(booking)
}
```

### Custom Error Responses

```typescript
import { 
  ErrorResponses, 
  BusinessLogicError,
  createErrorResponse 
} from '@/lib/validation'

// Using predefined error responses
if (!hasPermission) {
  return ErrorResponses.forbidden('You cannot access this resource')
}

if (capacity === 0) {
  return ErrorResponses.conflict('Event is sold out')
}

// Using custom business logic errors
if (bookingDate < today) {
  return createErrorResponse(
    new BusinessLogicError(
      'Cannot book in the past',
      'INVALID_BOOKING_DATE',
      { bookingDate, today }
    )
  )
}
```

### Error Logging

```typescript
import { logError } from '@/lib/validation'

try {
  await processPayment(booking)
} catch (error) {
  logError(error as Error, {
    endpoint: '/api/bookings',
    method: 'POST',
    userId: user.id,
    bookingId: booking.id,
  })
  
  return ErrorResponses.internal('Payment processing failed')
}
```

### Handling Supabase Errors

```typescript
import { handleSupabaseError, createErrorResponse } from '@/lib/validation'

const { data, error } = await supabase
  .from('bookings')
  .insert(bookingData)

if (error) {
  const standardError = handleSupabaseError(error)
  return createErrorResponse(standardError, 400)
}
```

## Available Schemas

### Authentication
- `schemas.register` - User registration
- `schemas.login` - User login
- `schemas.passwordResetRequest` - Password reset request
- `schemas.passwordReset` - Password reset

### Profile
- `schemas.updateProfile` - Profile updates
- `schemas.emergencyContact` - Emergency contact
- `schemas.emergencyContacts` - Emergency contacts array

### Bookings
- `schemas.createBooking` - Create booking
- `schemas.updateBooking` - Update booking
- `schemas.bookingFilters` - Booking filters

### Reviews
- `schemas.createReview` - Create review
- `schemas.updateReview` - Update review
- `schemas.reviewFilters` - Review filters

### Saved Items
- `schemas.saveItem` - Save item
- `schemas.savedItemsFilters` - Saved items filters

### Safety
- `schemas.createSafetyReport` - Safety report
- `schemas.safetyInfoFilters` - Safety info filters

### Listings
- `schemas.listingFilters` - Common listing filters
- `schemas.accommodationFilters` - Accommodation filters
- `schemas.flightFilters` - Flight filters
- `schemas.eventFilters` - Event filters

### Admin
- `schemas.adminCreateListing` - Admin create listing
- `schemas.adminUpdateListing` - Admin update listing
- `schemas.adminSoftDelete` - Admin soft delete

## Validation Features

### Date Range Validation
Automatically validates that end dates are after start dates:

```typescript
const schema = z.object({
  start_date: dateStringSchema,
  end_date: dateStringSchema,
}).refine(
  (data) => new Date(data.end_date) > new Date(data.start_date),
  { message: 'End date must be after start date' }
)
```

### Enum Validation
Validates values against allowed enums:

```typescript
const bookingTypeSchema = z.enum([
  'dining', 
  'accommodation', 
  'flight', 
  'event', 
  'transport'
])
```

### Foreign Key Validation
Helper for foreign key validation errors:

```typescript
import { createForeignKeyError } from '@/lib/validation'

const accommodation = await getAccommodation(reference_id)

if (!accommodation) {
  return createForeignKeyError('accommodation', reference_id)
}
```

### Unique Constraint Validation
Helper for unique constraint errors:

```typescript
import { createUniqueConstraintError } from '@/lib/validation'

const existing = await getUserByEmail(email)

if (existing) {
  return createUniqueConstraintError('email', email)
}
```

## Error Response Format

All errors follow a consistent format:

```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    details: [
      {
        field: "email",
        message: "Invalid email format",
        code: "invalid_string"
      }
    ],
    timestamp: "2024-01-01T00:00:00.000Z"
  }
}
```

## Success Response Format

All successful responses follow this format:

```typescript
{
  success: true,
  data: {
    // Response data
  }
}
```

## Error Codes

### Client Errors (4xx)
- `VALIDATION_ERROR` (400) - Input validation failed
- `INVALID_JSON` (400) - Malformed JSON
- `INVALID_UUID` (400) - Invalid UUID format
- `INVALID_DATE` (400) - Invalid date format
- `INVALID_DATE_RANGE` (400) - Invalid date range
- `INVALID_ENUM_VALUE` (400) - Invalid enum value
- `FOREIGN_KEY_VIOLATION` (400) - Referenced record doesn't exist
- `UNAUTHORIZED` (401) - Authentication required
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource conflict
- `UNIQUE_CONSTRAINT_VIOLATION` (409) - Duplicate value

### Server Errors (5xx)
- `INTERNAL_ERROR` (500) - Unexpected server error
- `DATABASE_ERROR` (500) - Database operation failed
- `EXTERNAL_SERVICE_ERROR` (502) - External service failed

## Best Practices

1. **Always validate input**: Use schemas for all API inputs
2. **Use typed responses**: Leverage TypeScript inference from schemas
3. **Log errors with context**: Include relevant information for debugging
4. **Return appropriate status codes**: Use correct HTTP status codes
5. **Provide helpful error messages**: Make errors actionable for clients
6. **Handle Supabase errors**: Convert database errors to standard format
7. **Validate business logic**: Check constraints beyond schema validation

## Testing

Validation schemas can be tested independently:

```typescript
import { schemas } from '@/lib/validation'

describe('createBooking schema', () => {
  it('should validate valid booking data', () => {
    const validData = {
      booking_type: 'accommodation',
      reference_id: '123e4567-e89b-12d3-a456-426614174000',
      start_date: '2024-01-01T00:00:00Z',
      end_date: '2024-01-05T00:00:00Z',
      guests: 2,
    }
    
    expect(() => schemas.createBooking.parse(validData)).not.toThrow()
  })

  it('should reject invalid date range', () => {
    const invalidData = {
      booking_type: 'accommodation',
      reference_id: '123e4567-e89b-12d3-a456-426614174000',
      start_date: '2024-01-05T00:00:00Z',
      end_date: '2024-01-01T00:00:00Z', // Before start date
      guests: 2,
    }
    
    expect(() => schemas.createBooking.parse(invalidData)).toThrow()
  })
})
```
