# Event Service

This service handles all event listing and registration operations for the DettyConnect platform.

## Features

- Event listing with pagination and filtering
- Event detail retrieval
- Event registration with capacity management
- Registration cancellation with capacity restoration
- Sold-out status management

## Functions

### `getEvents(filters?: EventFilters)`

Get paginated list of events with optional filters.

**Filters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `city` - Filter by city
- `country` - Filter by country
- `category` - Filter by event category
- `startDate` - Filter events starting from this date
- `endDate` - Filter events ending before this date
- `hasAvailability` - Only show events with available spots
- `rating` - Minimum average rating
- `sortBy` - Sort field (default: 'start_date')
- `sortOrder` - Sort order: 'asc' or 'desc' (default: 'asc')

**Returns:** `{ data: PaginatedResult<Event> | null, error: EventServiceError | null }`

### `getEvent(id: string)`

Get single event by ID.

**Returns:** `{ event: Event | null, error: EventServiceError | null }`

### `registerForEvent(userId, eventId, tickets, ticketType?, specialRequests?)`

Register for an event (create booking).

**Parameters:**
- `userId` - User ID
- `eventId` - Event ID
- `tickets` - Number of tickets/spots to register
- `ticketType` - Optional ticket type
- `specialRequests` - Optional special requests

**Returns:** `{ booking: Booking | null, error: EventServiceError | null }`

**Features:**
- Validates event exists and has capacity
- Checks for sold-out status
- Calculates total price from ticket types
- Creates booking record
- Decrements available spots atomically
- Rolls back booking if capacity update fails

### `cancelEventRegistration(bookingId, userId)`

Cancel event registration and restore capacity.

**Returns:** `{ success: boolean, error: EventServiceError | null }`

**Features:**
- Verifies booking ownership
- Prevents cancellation of already cancelled/completed bookings
- Updates booking status to cancelled
- Restores available spots to event

### Server-side Functions

- `getEventsServer(filters?)` - Server-side version for API routes
- `getEventServer(id)` - Server-side version for API routes

## Usage Examples

### Client-side

```typescript
import { getEvents, getEvent, registerForEvent } from '@/lib/services/event.service'

// Get events with filters
const { data, error } = await getEvents({
  city: 'Lagos',
  category: 'music',
  hasAvailability: true,
  page: 1,
  limit: 10,
})

// Get single event
const { event, error } = await getEvent('event-id')

// Register for event
const { booking, error } = await registerForEvent(
  'user-id',
  'event-id',
  2, // 2 tickets
  'VIP',
  'Wheelchair accessible seating please'
)
```

### API Routes

```typescript
import { getEventsServer, getEventServer } from '@/lib/services/event.service'

// In API route handler
const { data, error } = await getEventsServer(filters)
```

## Error Codes

- `FETCH_FAILED` - Failed to fetch events from database
- `NOT_FOUND` - Event not found
- `EVENT_NOT_FOUND` - Event not found during registration
- `INSUFFICIENT_CAPACITY` - Not enough available spots
- `SOLD_OUT` - Event is sold out
- `REGISTRATION_FAILED` - Failed to create booking
- `CAPACITY_UPDATE_FAILED` - Failed to update event capacity
- `BOOKING_NOT_FOUND` - Booking not found or unauthorized
- `CANNOT_CANCEL` - Booking cannot be cancelled (already cancelled/completed)
- `CANCELLATION_FAILED` - Failed to cancel booking

## API Endpoints

### GET /api/events

Get paginated list of events.

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `city` - Filter by city
- `country` - Filter by country
- `category` - Filter by category
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `hasAvailability` - Filter by availability (true/false)
- `rating` - Minimum rating
- `sortBy` - Sort field
- `sortOrder` - Sort order (asc/desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /api/events/[id]

Get single event details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "description": "...",
    "category": "...",
    "start_date": "...",
    "end_date": "...",
    "capacity": 100,
    "available_spots": 50,
    ...
  }
}
```

### POST /api/bookings

Create event registration (booking).

**Request Body:**
```json
{
  "booking_type": "event",
  "reference_id": "event-id",
  "start_date": "2024-01-01T00:00:00Z",
  "guests": 2,
  "ticket_type": "VIP",
  "special_requests": "..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "user_id": "...",
    "booking_type": "event",
    "reference_id": "...",
    "status": "pending",
    "guests": 2,
    "total_price": 100,
    ...
  }
}
```

## Requirements Validation

This service implements the following requirements:

- **6.1** - Browse events with pagination and filtering
- **6.2** - Filter events by category
- **6.3** - View event details with full information
- **6.4** - Register for events with capacity verification and decrement
- **6.5** - Mark events as sold out when capacity reaches zero

## Notes

- Event capacity is managed atomically to prevent race conditions
- Bookings are rolled back if capacity update fails
- Cancelled registrations automatically restore available spots
- Soft-deleted events are excluded from listings
- Server-side functions should be used in API routes for proper authentication context
