/**
 * Listing Skeleton Components
 * Provides skeleton screens for different listing types while data loads
 */

import { Skeleton } from './Skeleton'

/**
 * Accommodation Card Skeleton
 */
export function AccommodationCardSkeleton() {
  return (
    <div className="bg-white/5 rounded-3xl overflow-hidden">
      {/* Image skeleton */}
      <Skeleton variant="rectangular" height={200} className="w-full" />
      
      <div className="p-6 space-y-4">
        {/* Title */}
        <Skeleton variant="text" className="h-6 w-3/4" />
        
        {/* Location */}
        <Skeleton variant="text" className="h-4 w-1/2" />
        
        {/* Details row */}
        <div className="flex gap-4">
          <Skeleton variant="text" className="h-4 w-20" />
          <Skeleton variant="text" className="h-4 w-20" />
          <Skeleton variant="text" className="h-4 w-20" />
        </div>
        
        {/* Price and rating */}
        <div className="flex justify-between items-center">
          <Skeleton variant="text" className="h-6 w-24" />
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

/**
 * Flight Card Skeleton
 */
export function FlightCardSkeleton() {
  return (
    <div className="bg-white/5 rounded-3xl p-6 space-y-4">
      {/* Airline */}
      <Skeleton variant="text" className="h-5 w-32" />
      
      {/* Route */}
      <div className="flex items-center gap-4">
        <Skeleton variant="text" className="h-8 w-24" />
        <Skeleton variant="text" className="h-4 w-16" />
        <Skeleton variant="text" className="h-8 w-24" />
      </div>
      
      {/* Time and duration */}
      <div className="flex gap-6">
        <Skeleton variant="text" className="h-4 w-20" />
        <Skeleton variant="text" className="h-4 w-20" />
      </div>
      
      {/* Price */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <Skeleton variant="text" className="h-4 w-24" />
        <Skeleton variant="text" className="h-6 w-20" />
      </div>
    </div>
  )
}

/**
 * Event Card Skeleton
 */
export function EventCardSkeleton() {
  return (
    <div className="bg-white/5 rounded-3xl overflow-hidden">
      {/* Image skeleton */}
      <Skeleton variant="rectangular" height={180} className="w-full" />
      
      <div className="p-6 space-y-4">
        {/* Category badge */}
        <Skeleton variant="text" className="h-6 w-20 rounded-full" />
        
        {/* Title */}
        <Skeleton variant="text" className="h-6 w-full" />
        <Skeleton variant="text" className="h-6 w-2/3" />
        
        {/* Date and location */}
        <div className="space-y-2">
          <Skeleton variant="text" className="h-4 w-40" />
          <Skeleton variant="text" className="h-4 w-32" />
        </div>
        
        {/* Availability */}
        <Skeleton variant="text" className="h-4 w-28" />
      </div>
    </div>
  )
}

/**
 * Transport Card Skeleton
 */
export function TransportCardSkeleton() {
  return (
    <div className="bg-white/5 rounded-3xl p-6 space-y-4">
      {/* Provider and type */}
      <div className="flex justify-between">
        <Skeleton variant="text" className="h-5 w-32" />
        <Skeleton variant="text" className="h-5 w-20" />
      </div>
      
      {/* Route */}
      <div className="flex items-center gap-4">
        <Skeleton variant="text" className="h-6 w-28" />
        <Skeleton variant="text" className="h-4 w-12" />
        <Skeleton variant="text" className="h-6 w-28" />
      </div>
      
      {/* Schedule */}
      <div className="flex gap-6">
        <Skeleton variant="text" className="h-4 w-24" />
        <Skeleton variant="text" className="h-4 w-24" />
      </div>
      
      {/* Price and seats */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <Skeleton variant="text" className="h-6 w-20" />
        <Skeleton variant="text" className="h-4 w-24" />
      </div>
    </div>
  )
}

/**
 * Review Card Skeleton
 */
export function ReviewCardSkeleton() {
  return (
    <div className="bg-white/5 rounded-3xl p-6 space-y-4">
      {/* User info */}
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="text" className="h-4 w-24" />
        </div>
        <Skeleton variant="text" className="h-5 w-16" />
      </div>
      
      {/* Review title */}
      <Skeleton variant="text" className="h-6 w-3/4" />
      
      {/* Review content */}
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-2/3" />
      </div>
    </div>
  )
}

/**
 * List Skeleton - renders multiple card skeletons
 */
interface ListSkeletonProps {
  count?: number
  type: 'accommodation' | 'flight' | 'event' | 'transport' | 'review'
}

export function ListSkeleton({ count = 6, type }: ListSkeletonProps) {
  const SkeletonComponent = {
    accommodation: AccommodationCardSkeleton,
    flight: FlightCardSkeleton,
    event: EventCardSkeleton,
    transport: TransportCardSkeleton,
    review: ReviewCardSkeleton,
  }[type]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  )
}

/**
 * Detail Page Skeleton
 */
export function DetailPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero image */}
      <Skeleton variant="rectangular" height={400} className="w-full rounded-3xl" />
      
      {/* Title and rating */}
      <div className="space-y-4">
        <Skeleton variant="text" className="h-10 w-2/3" />
        <div className="flex gap-4">
          <Skeleton variant="text" className="h-5 w-24" />
          <Skeleton variant="text" className="h-5 w-32" />
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-3">
        <Skeleton variant="text" className="h-6 w-32" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-3/4" />
      </div>
      
      {/* Features grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-12 rounded-2xl" />
        ))}
      </div>
      
      {/* Booking section */}
      <div className="bg-white/5 rounded-3xl p-6 space-y-4">
        <Skeleton variant="text" className="h-8 w-40" />
        <Skeleton variant="text" className="h-12 w-full rounded-2xl" />
        <Skeleton variant="text" className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  )
}
