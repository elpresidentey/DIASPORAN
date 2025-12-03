# Transport Service

This service handles all transport-related operations including searching for transport options, viewing details, creating bookings, and managing schedules.

## Features

- Search and filter transport options
- View detailed transport information
- Create transport bookings
- Cancel bookings with seat restoration
- Update transport schedules (admin/system operation)
- Get user's transport booking history

## API Endpoints

### GET /api/transport
Search for transport options with filters.

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 20) - Number of results per page
- `origin` (string) - Filter by origin location
- `destination` (string) - Filter by destination location
- `date` (string) - Filter by travel date (YYYY-MM-DD)
- `transportType` or `type` (string) - Filter by transport type (bus, train, car, etc.)
- `provider` (string) - Filter by provider name
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `sortBy` (string, default: 'departure_time') - Field to sort by
- `sortOrder` ('asc' | 'desc', default: 'asc') - Sort order

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "provider": "Express Bus Co",
        "transport_type": "bus",
        "route_name": "Lagos-Abuja Express",
        "origin": "Lagos",
        "destination": "Abuja",
        "departure_time": "08:00:00",
        "arrival_time": "16:00:00",
        "duration_minutes": 480,
        "price": 5000,
        "currency": "NGN",
        "schedule": {},
        "vehicle_info": {},
        "available_seats": 45,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /api/transport/[id]
Get detailed information about a specific transport option.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "provider": "Express Bus Co",
    "transport_type": "bus",
    "route_name": "Lagos-Abuja Express",
    "origin": "Lagos",
    "destination": "Abuja",
    "departure_time": "08:00:00",
    "arrival_time": "16:00:00",
    "duration_minutes": 480,
    "price": 5000,
    "currency": "NGN",
    "schedule": {
      "days": ["Monday", "Wednesday", "Friday"],
      "frequency": "3x per week"
    },
    "vehicle_info": {
      "type": "Luxury Coach",
      "amenities": ["AC", "WiFi", "Reclining Seats"]
    },
    "available_seats": 45,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/bookings
Create a transport booking.

**Request Body:**
```json
{
  "booking_type": "transport",
  "reference_id": "transport-uuid",
  "start_date": "2024-02-15",
  "guests": 2,
  "special_requests": "Window seats preferred"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "booking-uuid",
    "user_id": "user-uuid",
    "booking_type": "transport",
    "reference_id": "transport-uuid",
    "status": "pending",
    "start_date": "2024-02-15",
    "guests": 2,
    "total_price": 10000,
    "currency": "NGN",
    "special_requests": "Window seats preferred",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

## Service Functions

### Client-Side Functions

#### `getTransportOptions(filters?: TransportFilters)`
Search for transport options with optional filters.

```typescript
import { getTransportOptions } from '@/lib/services/transport.service'

const { data, error } = await getTransportOptions({
  origin: 'Lagos',
  destination: 'Abuja',
  transportType: 'bus',
  page: 1,
  limit: 20
})
```

#### `getTransportOption(id: string)`
Get details of a specific transport option.

```typescript
import { getTransportOption } from '@/lib/services/transport.service'

const { transport, error } = await getTransportOption('transport-id')
```

#### `createTransportBooking(userId, transportId, travelDate, passengers, specialRequests?)`
Create a new transport booking.

```typescript
import { createTransportBooking } from '@/lib/services/transport.service'

const { booking, error } = await createTransportBooking(
  'user-id',
  'transport-id',
  '2024-02-15',
  2,
  'Window seats preferred'
)
```

#### `cancelTransportBooking(bookingId, userId)`
Cancel a transport booking and restore available seats.

```typescript
import { cancelTransportBooking } from '@/lib/services/transport.service'

const { success, error } = await cancelTransportBooking('booking-id', 'user-id')
```

#### `getUserTransportBookings(userId)`
Get all transport bookings for a user.

```typescript
import { getUserTransportBookings } from '@/lib/services/transport.service'

const { bookings, error } = await getUserTransportBookings('user-id')
```

### Server-Side Functions

#### `getTransportOptionsServer(filters?: TransportFilters)`
Server-side version for use in API routes.

```typescript
import { getTransportOptionsServer } from '@/lib/services/transport.service'

const { data, error } = await getTransportOptionsServer(filters)
```

#### `getTransportOptionServer(id: string)`
Server-side version for use in API routes.

```typescript
import { getTransportOptionServer } from '@/lib/services/transport.service'

const { transport, error } = await getTransportOptionServer(id)
```

#### `updateTransportSchedule(transportId, scheduleUpdate)`
Update transport schedule (admin/system operation). This would typically trigger notifications to affected users.

```typescript
import { updateTransportSchedule } from '@/lib/services/transport.service'

const { transport, error } = await updateTransportSchedule('transport-id', {
  departure_time: '09:00:00',
  arrival_time: '17:00:00',
  duration_minutes: 480
})
```

## Error Codes

- `FETCH_FAILED` - Failed to fetch transport options
- `NOT_FOUND` - Transport option not found
- `TRANSPORT_NOT_FOUND` - Transport option not found when creating booking
- `INSUFFICIENT_SEATS` - Not enough seats available
- `BOOKING_FAILED` - Failed to create booking
- `SEAT_UPDATE_FAILED` - Failed to update available seats
- `BOOKING_NOT_FOUND` - Booking not found or unauthorized
- `CANNOT_CANCEL` - Booking cannot be cancelled (already cancelled or completed)
- `CANCELLATION_FAILED` - Failed to cancel booking
- `UPDATE_FAILED` - Failed to update transport schedule

## Requirements Validation

This service implements the following requirements:

- **7.1**: Search for transport options matching route and time preferences
- **7.2**: View transport details including schedule, pricing, and vehicle information
- **7.3**: Create transport bookings with seat management
- **7.4**: Update transport schedules (with notification mechanism placeholder)
- **7.5**: View booking history for transport

## Notes

- Available seats are automatically decremented when bookings are created
- Cancelled bookings restore available seats
- Schedule updates would trigger notifications in a production implementation
- The service uses Row Level Security (RLS) policies for data access control
- All operations are type-safe using generated Supabase types
