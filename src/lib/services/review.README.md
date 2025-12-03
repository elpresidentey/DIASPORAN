# Review Service

Service layer for managing reviews and ratings in the DettyConnect platform.

## Features

- Create reviews with booking validation
- List reviews with pagination and filtering
- Update and delete reviews
- Automatic rating calculation via database triggers
- Client-side and server-side implementations

## Usage

### Creating a Review

```typescript
import { createReview } from '@/lib/services/review.service'

const { review, error } = await createReview(userId, {
  booking_id: 'booking-uuid',
  listing_type: 'accommodation',
  listing_id: 'listing-uuid',
  rating: 5,
  title: 'Amazing stay!',
  comment: 'The place was perfect...',
  images: ['url1', 'url2']
})
```

### Listing Reviews

```typescript
import { getReviews } from '@/lib/services/review.service'

const { data, error } = await getReviews({
  listing_type: 'dining',
  listing_id: 'venue-uuid',
  page: 1,
  limit: 10,
  min_rating: 4,
  sortBy: 'created_at',
  sortOrder: 'desc'
})
```

### Updating a Review

```typescript
import { updateReview } from '@/lib/services/review.service'

const { review, error } = await updateReview(reviewId, userId, {
  rating: 4,
  title: 'Updated title',
  comment: 'Updated comment'
})
```

### Deleting a Review

```typescript
import { deleteReview } from '@/lib/services/review.service'

const { success, error } = await deleteReview(reviewId, userId)
```

## Validation Rules

- Users can only review completed bookings
- One review per booking (enforced by unique constraint)
- Rating must be between 1 and 5
- Users can only update/delete their own reviews (enforced by RLS)

## Automatic Rating Updates

The database has triggers that automatically:
- Calculate average rating when a review is created
- Update average rating when a review is updated
- Recalculate average rating when a review is deleted

These triggers update the `average_rating` and `total_reviews` fields on:
- dining_venues
- accommodations
- events

## API Routes

The service is used by the following API routes:
- `POST /api/reviews` - Create a review
- `GET /api/reviews` - List reviews with filters
- `PATCH /api/reviews/[id]` - Update a review
- `DELETE /api/reviews/[id]` - Delete a review

## Error Codes

- `BOOKING_NOT_FOUND` - Booking doesn't exist or user doesn't have permission
- `BOOKING_NOT_COMPLETED` - Can only review completed bookings
- `REVIEW_EXISTS` - A review already exists for this booking
- `INVALID_RATING` - Rating must be between 1 and 5
- `CREATE_FAILED` - Failed to create review
- `FETCH_FAILED` - Failed to fetch reviews
- `NOT_FOUND` - Review not found
- `UPDATE_FAILED` - Failed to update review or no permission
- `DELETE_FAILED` - Failed to delete review or no permission
