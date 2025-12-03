# Reviews API

Complete API implementation for the reviews system in Diasporan.

## Endpoints

### POST /api/reviews
Create a new review for a completed booking.

**Authentication:** Required

**Request Body:**
```json
{
  "booking_id": "uuid",
  "listing_type": "dining" | "accommodation" | "event" | "transport",
  "listing_id": "uuid",
  "rating": 1-5,
  "title": "string",
  "comment": "string",
  "images": ["url1", "url2"] // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "booking_id": "uuid",
    "listing_type": "dining",
    "listing_id": "uuid",
    "rating": 5,
    "title": "Amazing experience!",
    "comment": "Detailed review...",
    "images": [],
    "helpful_count": 0,
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

**Validation:**
- User must have a completed booking for the listing
- Only one review per booking
- Rating must be between 1 and 5
- All required fields must be provided

### GET /api/reviews
List reviews with filters and pagination.

**Authentication:** Not required

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 20, max: 100) - Items per page
- `listing_type` - Filter by listing type
- `listing_id` - Filter by specific listing
- `user_id` - Filter by user
- `min_rating` - Minimum rating filter
- `max_rating` - Maximum rating filter
- `sortBy` - Sort field (created_at, rating, helpful_count)
- `sortOrder` - Sort direction (asc, desc)

**Response (200):**
```json
{
  "success": true,
  "data": [...reviews],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /api/reviews/[id]
Get a specific review by ID.

**Authentication:** Not required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    ...review fields
  }
}
```

### PATCH /api/reviews/[id]
Update a review (user must own the review).

**Authentication:** Required

**Request Body:**
```json
{
  "rating": 4,        // optional
  "title": "string",  // optional
  "comment": "string", // optional
  "images": []        // optional
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    ...updated review
  }
}
```

### DELETE /api/reviews/[id]
Delete a review (user must own the review).

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

## Automatic Rating Updates

The system uses database triggers to automatically update listing ratings:

1. **On Review Insert**: Adds the new rating to the average and increments review count
2. **On Review Update**: Recalculates average if rating changed
3. **On Review Delete**: Recalculates average without the deleted review

These updates happen immediately and affect the following tables:
- `dining_venues`
- `accommodations`
- `events`

## Security

- Row Level Security (RLS) enforces that users can only update/delete their own reviews
- All users can view reviews (public data)
- Authentication required for create, update, and delete operations
- Booking validation ensures users can only review bookings they completed

## Error Codes

- `UNAUTHORIZED` (401) - Authentication required
- `VALIDATION_ERROR` (400) - Invalid input data
- `BOOKING_NOT_FOUND` (404) - Booking doesn't exist or no permission
- `BOOKING_NOT_COMPLETED` (403) - Can only review completed bookings
- `REVIEW_EXISTS` (409) - Review already exists for this booking
- `INVALID_RATING` (400) - Rating must be 1-5
- `NOT_FOUND` (404) - Review not found
- `UPDATE_FAILED` (403) - Failed to update or no permission
- `DELETE_FAILED` (403) - Failed to delete or no permission
- `INTERNAL_ERROR` (500) - Unexpected server error

## Requirements Validated

This implementation satisfies the following requirements:

- **11.1**: Review submission validates completed booking
- **11.2**: Paginated review listing with filters
- **11.3**: Review updates recalculate average rating
- **11.4**: Review deletion recalculates rating
- **11.5**: New reviews update aggregate rating immediately

## Database Triggers

The following triggers are automatically executed:

1. `update_rating_on_review_insert` - After INSERT
2. `update_rating_on_review_update` - After UPDATE (when rating changes)
3. `update_rating_on_review_delete` - After DELETE

These triggers call the `update_listing_rating()` function which:
- Calculates new average rating
- Counts total reviews
- Updates the appropriate listing table
