# Real-time Subscription Hooks

This directory contains React hooks for managing Supabase real-time subscriptions with automatic reconnection, cleanup, and type safety.

## Overview

The real-time hooks provide a declarative way to subscribe to database changes in your React components. They handle:

- ✅ Automatic connection management
- ✅ Exponential backoff reconnection
- ✅ Cleanup on component unmount
- ✅ Type-safe payloads
- ✅ Event filtering
- ✅ Custom callbacks

## Hooks

### `useRealtimeSubscription`

Base hook for creating custom real-time subscriptions.

```tsx
import { useRealtimeSubscription } from '@/lib/hooks'

function MyComponent() {
  const { isConnected, error } = useRealtimeSubscription(
    {
      table: 'dining_venues',
      event: 'UPDATE',
      filter: 'city=eq.Lagos'
    },
    (payload) => {
      console.log('Data changed:', payload)
    }
  )
}
```

### `useRealtimeListings`

Subscribe to listing updates (dining venues, accommodations, events, flights, transport).

```tsx
import { useRealtimeListings } from '@/lib/hooks'

function VenueList() {
  const { isConnected, latestUpdate } = useRealtimeListings({
    listingType: 'dining_venues',
    filter: 'city=eq.Lagos',
    onInsert: (venue) => {
      console.log('New venue:', venue)
    },
    onUpdate: (venue, oldVenue) => {
      console.log('Venue updated:', venue)
    }
  })

  return (
    <div>
      {isConnected ? '🟢 Live' : '🔴 Offline'}
      {latestUpdate && (
        <div>Latest: {latestUpdate.type} - {latestUpdate.listing?.name}</div>
      )}
    </div>
  )
}
```

**Specialized hooks:**
- `useRealtimeDiningVenues(options)`
- `useRealtimeAccommodations(options)`
- `useRealtimeEvents(options)`
- `useRealtimeFlights(options)`
- `useRealtimeTransport(options)`

### `useRealtimeBookings`

Subscribe to booking updates with status change notifications.

```tsx
import { useRealtimeBookings } from '@/lib/hooks'
import { useAuth } from '@/contexts/AuthContext'

function MyBookings() {
  const { user } = useAuth()
  
  const { isConnected, latestUpdate } = useRealtimeBookings({
    userId: user?.id,
    onStatusChange: (booking, oldStatus) => {
      if (booking.status === 'confirmed') {
        showNotification('Booking confirmed!')
      }
    }
  })

  return <div>Bookings are {isConnected ? 'live' : 'offline'}</div>
}
```

**Specialized hooks:**
- `useRealtimeUserBookings(userId, options)` - User's bookings
- `useRealtimeBookingsByType(bookingType, options)` - Filter by type
- `useRealtimeBookingsByStatus(status, options)` - Filter by status

### `useRealtimeReviews`

Subscribe to review updates with rating change notifications.

```tsx
import { useRealtimeReviews } from '@/lib/hooks'

function VenueReviews({ venueId }) {
  const { latestUpdate, updates } = useRealtimeReviews({
    listingId: venueId,
    listingType: 'dining',
    onInsert: (review) => {
      console.log('New review:', review)
      refreshAverageRating()
    },
    onRatingChange: (review, oldRating) => {
      console.log(`Rating changed from ${oldRating} to ${review.rating}`)
    }
  })

  return (
    <div>
      <p>Total updates: {updates.length}</p>
      {latestUpdate && (
        <div>Latest review: {latestUpdate.review?.rating} stars</div>
      )}
    </div>
  )
}
```

**Specialized hooks:**
- `useRealtimeListingReviews(listingId, listingType, options)` - Reviews for a listing
- `useRealtimeUserReviews(userId, options)` - User's reviews
- `useRealtimeReviewsByType(listingType, options)` - Reviews by type

## Common Options

All hooks accept these common options:

```typescript
{
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'  // Default: '*'
  enabled?: boolean                              // Default: true
  filter?: string                                // PostgreSQL filter
  onInsert?: (data) => void
  onUpdate?: (data, oldData) => void
  onDelete?: (data) => void
}
```

## Return Values

All hooks return:

```typescript
{
  isConnected: boolean          // Connection status
  isConnecting: boolean         // Connecting state
  error: Error | null           // Connection error
  reconnectAttempts: number     // Number of reconnection attempts
  latestUpdate: Update | null   // Most recent update
  updates: Update[]             // History of updates (last 100)
  disconnect: () => void        // Manual disconnect
  reconnect: () => void         // Manual reconnect
  clearUpdates: () => void      // Clear update history
}
```

## Automatic Reconnection

The hooks implement exponential backoff for reconnection:

- Initial retry: 1 second
- Max retry delay: 30 seconds
- Formula: `min(1000 * 2^attempts, 30000)`

## Cleanup

Subscriptions are automatically cleaned up when:
- Component unmounts
- `enabled` prop changes to `false`
- Hook dependencies change

## Filtering

Use PostgreSQL filter syntax:

```tsx
// Single filter
filter: 'city=eq.Lagos'

// Multiple filters (AND)
filter: 'city=eq.Lagos,price_range=lte.3'

// Greater than
filter: 'price=gt.100'

// Less than or equal
filter: 'rating=lte.4'

// In list
filter: 'status=in.(confirmed,completed)'
```

## Performance Tips

1. **Use specific filters** to reduce data transfer
2. **Enable only when needed** using the `enabled` prop
3. **Limit update history** - hooks keep last 100 updates
4. **Use specialized hooks** for better type inference

## Example: Live Venue Dashboard

```tsx
'use client'

import { useRealtimeDiningVenues } from '@/lib/hooks'
import { useState } from 'react'

export default function LiveVenueDashboard() {
  const [venues, setVenues] = useState([])

  const { isConnected, latestUpdate } = useRealtimeDiningVenues({
    filter: 'city=eq.Lagos',
    onInsert: (venue) => {
      setVenues(prev => [...prev, venue])
    },
    onUpdate: (venue) => {
      setVenues(prev => 
        prev.map(v => v.id === venue.id ? venue : v)
      )
    },
    onDelete: (venue) => {
      setVenues(prev => prev.filter(v => v.id !== venue.id))
    }
  })

  return (
    <div>
      <div className="status">
        {isConnected ? '🟢 Live Updates' : '🔴 Offline'}
      </div>
      
      {latestUpdate && (
        <div className="notification">
          {latestUpdate.type}: {latestUpdate.listing?.name}
        </div>
      )}

      <div className="venues">
        {venues.map(venue => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  )
}
```

## Requirements Validation

These hooks implement the following requirements:

- **14.1**: Subscription establishes connection (Property 29)
- **14.2**: Data changes broadcast to subscribers (Property 28)
- **14.4**: Unsubscribe closes connection (Property 30)
- **14.5**: Multiple users receive simultaneous updates (Property 28)

## Testing

Property-based tests validate:
- Connection establishment
- Data broadcast to all subscribers
- Proper cleanup on unsubscribe
- Reconnection with exponential backoff
