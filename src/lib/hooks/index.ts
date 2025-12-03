/**
 * Real-time Hooks
 * 
 * Collection of React hooks for managing Supabase real-time subscriptions
 * with automatic reconnection, cleanup, and type safety.
 */

export {
  useRealtimeSubscription,
  type ChangeEventType,
  type SubscriptionConfig,
  type SubscriptionState,
} from './useRealtimeSubscription'

export {
  useRealtimeListings,
  useRealtimeDiningVenues,
  useRealtimeAccommodations,
  useRealtimeEvents,
  useRealtimeFlights,
  useRealtimeTransport,
  type ListingType,
  type ListingUpdate,
  type UseRealtimeListingsOptions,
} from './useRealtimeListings'

export {
  useRealtimeBookings,
  useRealtimeUserBookings,
  useRealtimeBookingsByType,
  useRealtimeBookingsByStatus,
  type BookingUpdate,
  type UseRealtimeBookingsOptions,
} from './useRealtimeBookings'

export {
  useRealtimeReviews,
  useRealtimeListingReviews,
  useRealtimeUserReviews,
  useRealtimeReviewsByType,
  type ReviewUpdate,
  type UseRealtimeReviewsOptions,
} from './useRealtimeReviews'
