# Accommodation Service

This service handles all accommodation listing and booking operations for the DettyConnect platform.

## Features

- **Listing Management**: Fetch accommodations with pagination and filtering
- **Search & Filter**: Search by location, price, amenities, property type, and more
- **Availability Checking**: Check if accommodation is available for specific date ranges
- **Booking Creation**: Create bookings with automatic cost calculation
- **Booking Cancellation**: Cancel bookings and automatically restore availability

## Service Functions

### Client-Side Functions

#### `getAccommodations(filters?: AccommodationFilters)`
Fetches paginated list of accommodations with optional filters.

**Filters:**
- `page`, `limit` - Pagination
- `city`, `country` - Location filters
- `minPrice`, `maxPrice` - Price range
- `rating` - Minimum rating
- `checkIn`, `checkOut` - Date range
- `guests` - Number of guests
- `bedrooms`, `bathrooms` - Property specifications
- `propertyType` - Type of property (apartment, house, etc.)
- `amenities` - Array of required amenities
- `sortBy`, `sortOrder` - Sorting options

**Returns:** `{ data: PaginatedResult<Accommodation> | null, error: AccommodationServiceError | null }`

#### `getAccommodation(id: string)`
Fetches a single accommodation by ID.

**Returns:** `{ accommodation: Accommodation | null, error: AccommodationServiceError | null }`

#### `checkAvailability(accommodationId: string, checkIn: string, checkOut: string)`
Checks if an accommodation is available for the specified date range.

**Returns:** `{ available: boolean, error: AccommodationServiceError | null }`

#### `calculateBookingCost(pricePerNight: number, checkIn: string, checkOut: string, guests: number)`
Calculates the total cost for a booking including service fees.

**Formula:** `(pricePerNight * nights) + 10% service fee`

**Returns:** `number` - Total cost

#### `createAccommodationBooking(userId, accommodationId, checkIn, checkOut, guests, specialRequests?)`
Creates a new accommodation booking.

**Validations:**
- Checks if accommodation exists
- Verifies guest count doesn't exceed max capacity
- Checks availability for date range
- Calculates total cost

**Returns:** `{ booking: Booking | null, error: AccommodationServiceError | null }`

#### `cancelAccommodationBooking(bookingId: string, userId: string)`
Cancels an existing booking and restores availability.

**Validations:**
- Verifies booking ownership
- Checks if booking can be cancelled (not already cancelled or completed)

**Returns:** `{ success: boolean, error: AccommodationServiceError | null }`

### Server-Side Functions

The following functions are server-side versions for use in API routes:
- `getAccommodationsServer(filters?: AccommodationFilters)`
- `getAccommodationServer(id: string)`

These use `createServerClient()` instead of `createClient()` for server-side rendering.

## API Routes

### GET /api/stays
Fetches paginated list of accommodations.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `city` - Filter by city
- `country` - Filter by country
- `minPrice` - Minimum price per night
- `maxPrice` - Maximum price per night
- `rating` - Minimum rating
- `checkIn` - Check-in date (ISO format)
- `checkOut` - Check-out date (ISO format)
- `guests` - Number of guests
- `bedrooms` - Minimum bedrooms
- `bathrooms` - Minimum bathrooms
- `propertyType` - Property type
- `amenities` - Comma-separated list of amenities
- `sortBy` - Sort field (default: created_at)
- `sortOrder` - Sort order: asc/desc (default: desc)

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

### GET /api/stays/[id]
Fetches a single accommodation by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    ...
  }
}
```

### POST /api/bookings
Creates a new booking (supports multiple booking types).

**Request Body (for accommodations):**
```json
{
  "booking_type": "accommodation",
  "reference_id": "accommodation-id",
  "start_date": "2024-01-01",
  "end_date": "2024-01-05",
  "guests": 2,
  "special_requests": "Early check-in please"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "user_id": "...",
    "booking_type": "accommodation",
    "status": "pending",
    "total_price": 450.00,
    ...
  }
}
```

### DELETE /api/bookings/[id]
Cancels a booking.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Booking cancelled successfully"
  }
}
```

## Error Codes

- `FETCH_FAILED` - Failed to fetch accommodations
- `NOT_FOUND` - Accommodation not found
- `AVAILABILITY_CHECK_FAILED` - Failed to check availability
- `EXCEEDS_CAPACITY` - Number of guests exceeds maximum capacity
- `NOT_AVAILABLE` - Accommodation not available for selected dates
- `BOOKING_FAILED` - Failed to create booking
- `BOOKING_NOT_FOUND` - Booking not found or no permission
- `CANNOT_CANCEL` - Cannot cancel booking (already cancelled or completed)
- `CANCELLATION_FAILED` - Failed to cancel booking

## Usage Examples

### Fetching Accommodations
```typescript
import { getAccommodations } from '@/lib/services/accommodation.service'

const { data, error } = await getAccommodations({
  city: 'Lagos',
  minPrice: 50,
  maxPrice: 200,
  guests: 2,
  amenities: ['wifi', 'pool'],
  page: 1,
  limit: 20
})

if (error) {
  console.error('Error:', error.message)
} else {
  console.log('Accommodations:', data.data)
  console.log('Total:', data.pagination.total)
}
```

### Creating a Booking
```typescript
import { createAccommodationBooking } from '@/lib/services/accommodation.service'

const { booking, error } = await createAccommodationBooking(
  userId,
  accommodationId,
  '2024-01-01',
  '2024-01-05',
  2,
  'Early check-in please'
)

if (error) {
  console.error('Booking failed:', error.message)
} else {
  console.log('Booking created:', booking.id)
  console.log('Total cost:', booking.total_price)
}
```

### Checking Availability
```typescript
import { checkAvailability } from '@/lib/services/accommodation.service'

const { available, error } = await checkAvailability(
  accommodationId,
  '2024-01-01',
  '2024-01-05'
)

if (error) {
  console.error('Error checking availability:', error.message)
} else if (available) {
  console.log('Accommodation is available!')
} else {
  console.log('Accommodation is not available for these dates')
}
```

### Cancelling a Booking
```typescript
import { cancelAccommodationBooking } from '@/lib/services/accommodation.service'

const { success, error } = await cancelAccommodationBooking(bookingId, userId)

if (error) {
  console.error('Cancellation failed:', error.message)
} else {
  console.log('Booking cancelled successfully')
}
```

## Requirements Validation

This implementation satisfies the following requirements:

- **4.1**: Search accommodations by date range and location ✓
- **4.2**: Filter by amenities ✓
- **4.3**: View accommodation details with pricing ✓
- **4.4**: Create bookings with cost calculation ✓
- **4.5**: Cancel bookings with availability restoration ✓

## Notes

- All dates should be in ISO 8601 format (YYYY-MM-DD)
- Availability is checked by looking for overlapping bookings with 'confirmed' or 'pending' status
- Cancelled bookings automatically restore availability (no explicit restoration needed)
- Service fee is 10% of the base cost
- All monetary values are stored as decimals
- Soft-deleted accommodations (deleted_at IS NOT NULL) are excluded from results
