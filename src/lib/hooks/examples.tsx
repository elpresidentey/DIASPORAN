/**
 * Real-time Hooks Usage Examples
 * 
 * This file contains example implementations showing how to use
 * the real-time subscription hooks in various scenarios.
 */

'use client'

import { useState, useEffect } from 'react'
import {
  useRealtimeDiningVenues,
  useRealtimeUserBookings,
  useRealtimeListingReviews,
  useRealtimeAccommodations,
} from './index'

// ============================================================================
// Example 1: Live Venue Updates
// ============================================================================

export function LiveVenueList() {
  const [venues, setVenues] = useState<any[]>([])

  const { isConnected, latestUpdate, error } = useRealtimeDiningVenues({
    filter: 'city=eq.Lagos',
    onInsert: (venue) => {
      setVenues(prev => [...prev, venue])
      console.log('New venue added:', venue.name)
    },
    onUpdate: (venue) => {
      setVenues(prev => prev.map(v => v.id === venue.id ? venue : v))
      console.log('Venue updated:', venue.name)
    },
    onDelete: (venue) => {
      setVenues(prev => prev.filter(v => v.id !== venue.id))
      console.log('Venue removed:', venue.name)
    }
  })

  return (
    <div>
      <div className="status-bar">
        {isConnected ? (
          <span className="text-green-600">🟢 Live Updates Active</span>
        ) : (
          <span className="text-red-600">🔴 Offline</span>
        )}
        {error && <span className="text-red-600">Error: {error.message}</span>}
      </div>

      {latestUpdate && latestUpdate.listing && (
        <div className="notification">
          Latest: {latestUpdate.type} - {'name' in latestUpdate.listing ? latestUpdate.listing.name : 'Unknown'}
        </div>
      )}

      <div className="venue-grid">
        {venues.map(venue => (
          <div key={venue.id} className="venue-card">
            <h3>{venue.name}</h3>
            <p>{venue.description}</p>
            <p>Rating: {venue.average_rating} ⭐</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Example 2: User Bookings with Status Notifications
// ============================================================================

export function MyBookingsWithNotifications({ userId }: { userId: string }) {
  const [bookings, setBookings] = useState<any[]>([])
  const [notification, setNotification] = useState<string | null>(null)

  const { isConnected } = useRealtimeUserBookings(userId, {
    onInsert: (booking) => {
      setBookings(prev => [...prev, booking])
      setNotification(`New booking created: ${booking.booking_type}`)
    },
    onStatusChange: (booking, oldStatus) => {
      setBookings(prev => prev.map(b => b.id === booking.id ? booking : b))
      
      if (booking.status === 'confirmed') {
        setNotification('✅ Your booking has been confirmed!')
      } else if (booking.status === 'cancelled') {
        setNotification('❌ Your booking has been cancelled')
      }
    }
  })

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <div>
      <h2>My Bookings {isConnected && '(Live)'}</h2>
      
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}

      <div className="bookings-list">
        {bookings.map(booking => (
          <div key={booking.id} className="booking-card">
            <h3>{booking.booking_type}</h3>
            <p>Status: {booking.status}</p>
            <p>Date: {new Date(booking.start_date).toLocaleDateString()}</p>
            <p>Total: ${booking.total_price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Example 3: Live Reviews for a Listing
// ============================================================================

export function LiveReviewsFeed({ 
  listingId, 
  listingType 
}: { 
  listingId: string
  listingType: 'dining' | 'accommodation' | 'event' | 'transport'
}) {
  const [reviews, setReviews] = useState<any[]>([])
  const [averageRating, setAverageRating] = useState(0)

  const { isConnected, updates } = useRealtimeListingReviews(
    listingId,
    listingType,
    {
      onInsert: (review) => {
        setReviews(prev => [review, ...prev])
        recalculateRating([review, ...reviews])
      },
      onUpdate: (review) => {
        setReviews(prev => prev.map(r => r.id === review.id ? review : r))
        recalculateRating(reviews.map(r => r.id === review.id ? review : r))
      },
      onDelete: (review) => {
        const newReviews = reviews.filter(r => r.id !== review.id)
        setReviews(newReviews)
        recalculateRating(newReviews)
      },
      onRatingChange: (review, oldRating) => {
        console.log(`Rating changed from ${oldRating} to ${review.rating}`)
      }
    }
  )

  const recalculateRating = (reviewList: any[]) => {
    if (reviewList.length === 0) {
      setAverageRating(0)
      return
    }
    const sum = reviewList.reduce((acc, r) => acc + r.rating, 0)
    setAverageRating(sum / reviewList.length)
  }

  return (
    <div>
      <div className="reviews-header">
        <h2>Reviews {isConnected && '(Live)'}</h2>
        <div className="rating-summary">
          <span className="rating">{averageRating.toFixed(1)} ⭐</span>
          <span className="count">({reviews.length} reviews)</span>
        </div>
        <div className="update-count">
          {updates.length} updates received
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <span className="rating">{review.rating} ⭐</span>
              <span className="date">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <h4>{review.title}</h4>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Example 4: Accommodation Availability Monitor
// ============================================================================

export function AccommodationAvailabilityMonitor({ city }: { city: string }) {
  const [availableCount, setAvailableCount] = useState(0)
  const [recentChanges, setRecentChanges] = useState<string[]>([])

  const { isConnected, latestUpdate } = useRealtimeAccommodations({
    filter: `city=eq.${city}`,
    onUpdate: (accommodation, oldAccommodation) => {
      // Track availability changes
      const hasDeletedAt = 'deleted_at' in accommodation
      const oldHasDeletedAt = oldAccommodation && 'deleted_at' in oldAccommodation
      
      if (hasDeletedAt && oldHasDeletedAt) {
        const accWithDeleted = accommodation as any
        const oldAccWithDeleted = oldAccommodation as any
        
        if (accWithDeleted.deleted_at !== oldAccWithDeleted.deleted_at) {
          const name = 'name' in accommodation ? accommodation.name : 'Unknown'
          const message = accWithDeleted.deleted_at 
            ? `${name} is no longer available`
            : `${name} is now available`
          
          setRecentChanges(prev => [message, ...prev.slice(0, 9)])
        }
      }
    }
  })

  useEffect(() => {
    if (latestUpdate?.listing) {
      const hasDeletedAt = 'deleted_at' in latestUpdate.listing
      const listingWithDeleted = latestUpdate.listing as any
      // Update count based on deleted_at status
      if (latestUpdate.type === 'INSERT' && (!hasDeletedAt || !listingWithDeleted.deleted_at)) {
        setAvailableCount(prev => prev + 1)
      } else if (latestUpdate.type === 'DELETE' || (hasDeletedAt && listingWithDeleted.deleted_at)) {
        setAvailableCount(prev => Math.max(0, prev - 1))
      }
    }
  }, [latestUpdate])

  return (
    <div>
      <h2>Accommodations in {city}</h2>
      <div className="stats">
        <div className="stat-card">
          <span className="label">Available Properties</span>
          <span className="value">{availableCount}</span>
        </div>
        <div className="stat-card">
          <span className="label">Status</span>
          <span className="value">
            {isConnected ? '🟢 Live' : '🔴 Offline'}
          </span>
        </div>
      </div>

      <div className="recent-changes">
        <h3>Recent Changes</h3>
        {recentChanges.length === 0 ? (
          <p>No recent changes</p>
        ) : (
          <ul>
            {recentChanges.map((change, index) => (
              <li key={index}>{change}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Example 5: Manual Connection Control
// ============================================================================

export function ManualConnectionControl() {
  const [enabled, setEnabled] = useState(true)

  const { 
    isConnected, 
    isConnecting, 
    error, 
    reconnectAttempts,
    disconnect,
    reconnect,
    clearUpdates,
    updates
  } = useRealtimeDiningVenues({
    enabled,
    onInsert: (venue) => console.log('New venue:', venue)
  })

  return (
    <div>
      <div className="connection-status">
        <p>Status: {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}</p>
        <p>Reconnect Attempts: {reconnectAttempts}</p>
        {error && <p className="error">Error: {error.message}</p>}
        <p>Updates Received: {updates.length}</p>
      </div>

      <div className="controls">
        <button onClick={() => setEnabled(!enabled)}>
          {enabled ? 'Disable' : 'Enable'} Subscription
        </button>
        <button onClick={disconnect} disabled={!isConnected}>
          Disconnect
        </button>
        <button onClick={reconnect} disabled={isConnected}>
          Reconnect
        </button>
        <button onClick={clearUpdates}>
          Clear Updates
        </button>
      </div>
    </div>
  )
}
