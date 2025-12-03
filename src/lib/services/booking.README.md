# Booking Service

The booking service provides comprehensive booking management functionality for the DettyConnect platform, handling all CRUD operations for bookings across different listing types (accommodations, events, transport, dining, flights).

## Features

- **List User Bookings**: Retrieve paginated list of user's bookings with filtering
- **Get Booking Details**: Fetch single booking by ID with ownership verification
- **Update Booking**: Modify booking details (dates, guests, special requests)
- **Cancel Booking**: Cancel bookings with automatic availability restoration
- **Status Management**: Change booking status with notifications (future)

## API Endpoints

### GET /api/bookings
Get paginated list of user's bookings.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `status` (string, optional): Filter by status (pending, confirmed, cancelled, completed)
- `booking_type` (string, optional): Filter by type (dining, accommodation, flight, event, transport)
- `startDate` (string, optional): Filter bookings starting from this date
- `endDate` (string, optional): Filter bookings up to this date

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "booking_type": "accommodation",
        "reference_id": "uuid",
        "status": "confirmed",
        "start_date": "2024-01-15",
        "end_date": "2024-01-20",
        "guests": 2,
        "total_price": 500.00,
        "currency": "USD",
        "created_at": "2024-01-01T00:00:00Z",
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /api/bookings/[id]
Get single booking details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "booking_type": "accommodation",
    "reference_id": "uuid",
    "status": "confirmed",
    "start_date": "2024-01-15",
    "end_date": "2024-01-20",
    "guests": 2,
    "total_price": 500.00,
    "currency": "USD",
    "special_requests": "Late check-in",
    "created_at": "2024-01-01T00:00:00Z",
    ...
  }
}
```

### PATCH /api/bookings/[id]
Update booking details.

**Request Body:**
```json
{
  "start_date": "2024-01-16",
  "end_date": "2024-01-21",
  "guests": 3,
  "special_requests": "Early check-in if possible"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "booking_type": "accommodation",
    "status": "confirmed",
    "start_date": "2024-01-16",
    "end_date": "2024-01-21",
    "guests": 3,
    "special_requests": "Early check-in if possible",
    "updated_at": "2024-01-02T00:00:00Z",
    ...
  }
}
```

### DELETE /api/bookings/[id]
Cancel a booking.

**Request Body (optional):**
```json
{
  "reason": "Change of plans"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Booking cancelled successfully"
  }
}
```

## Service Functions

### Client-Side Functions

#### `getUserBookings(userId, filters)`
Get paginated list of user's bookings.

```typescript
import { getUserBookings } from '@/lib/services/booking.service'

const { data, error } = await getUserBookings('user-id', {
  page: 1,
  limit: 20,
  status: 'confirmed',
  booking_type: 'accommodation'
})
```

#### `getBooking(bookingId, userId)`
Get single booking by ID.

```typescript
import { getBooking } from '@/lib/services/booking.service'

const { booking, error } = await getBooking('booking-id', 'user-id')
```

#### `updateBooking(bookingId, userId, updates)`
Update booking details.

```typescript
import { updateBooking } from '@/lib/services/booking.service'

const { booking, error } = await updateBooking('booking-id', 'user-id', {
  guests: 3,
  special_requests: 'Vegetarian meals'
})
```

#### `cancelBooking(bookingId, userId, reason?)`
Cancel a booking.

```typescript
import { cancelBooking } from '@/lib/services/booking.service'

const { success, error } = await cancelBooking('booking-id', 'user-id', 'Change of plans')
```

### Server-Side Functions

Use the `*Server` versions of functions in API routes:
- `getUserBookingsServer(userId, filters)`
- `getBookingServer(bookingId, userId)`
- `updateBookingServer(bookingId, userId, updates)`
- `cancelBookingServer(bookingId, userId, reason?)`

## Business Rules

### Booking Modification
- Only bookings with status `pending` or `confirmed` can be modified
- Cannot modify `cancelled` or `completed` bookings
- Date range validation: end_date must be after start_date

### Booking Cancellation
- Only bookings with status `pending` or `confirmed` can be cancelled
- Cannot cancel `completed` bookings
- Already `cancelled` bookings return an error
- Cancellation automatically restores availability for events and transport
- Accommodation and dining availability is checked dynamically

### Availability Restoration
When a booking is cancelled:
- **Events**: Available spots are incremented by the number of guests
- **Transport**: Available seats are incremented by the number of passengers
- **Accommodation/Dining**: No action needed (availability checked via non-cancelled bookings)
- **Flights**: No action needed (managed externally)

## Error Codes

- `UNAUTHORIZED`: Authentication required
- `BOOKING_NOT_FOUND`: Booking not found or user doesn't have permission
- `CANNOT_MODIFY`: Booking status doesn't allow modification
- `CANNOT_CANCEL`: Booking status doesn't allow cancellation
- `ALREADY_CANCELLED`: Booking is already cancelled
- `INVALID_DATE_RANGE`: End date must be after start date
- `INVALID_INPUT`: Missing or invalid input parameters
- `FETCH_FAILED`: Failed to fetch bookings from database
- `UPDATE_FAILED`: Failed to update booking
- `CANCELLATION_FAILED`: Failed to cancel booking
- `INTERNAL_ERROR`: Unexpected server error

## Future Enhancements

### Notifications (Requirement 9.4)
The service includes placeholder comments for notification functionality:
- Booking modification notifications
- Booking cancellation notifications
- Status change notifications
- Reminder notifications for upcoming bookings

These will be implemented when the notification service is created in a future task.

## Usage Examples

### Frontend Component Example

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getUserBookings, cancelBooking } from '@/lib/services/booking.service'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBookings() {
      const { data, error } = await getUserBookings('user-id', {
        status: 'confirmed'
      })
      
      if (data) {
        setBookings(data.data)
      }
      setLoading(false)
    }
    
    loadBookings()
  }, [])

  const handleCancel = async (bookingId: string) => {
    const { success, error } = await cancelBooking(bookingId, 'user-id')
    
    if (success) {
      // Refresh bookings list
      // Show success message
    }
  }

  // Render bookings...
}
```

### API Route Example

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getUserBookingsServer } from '@/lib/services/booking.service'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await getUserBookingsServer(user.id, {
    page: 1,
    limit: 20
  })

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ data })
}
```

## Testing

The booking service should be tested with:
- Unit tests for individual functions
- Property-based tests for booking operations
- Integration tests with actual database
- RLS policy verification

See the test files in `/tests` directory for examples.
