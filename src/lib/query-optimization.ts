/**
 * Query Optimization Utilities
 * Provides helpers for optimizing Supabase queries
 */

/**
 * Column selection presets for different use cases
 * Selecting only needed columns reduces payload size and improves performance
 */

export const COLUMN_PRESETS = {
  // Accommodation columns
  ACCOMMODATION_LIST: [
    'id',
    'name',
    'description',
    'property_type',
    'city',
    'country',
    'bedrooms',
    'bathrooms',
    'max_guests',
    'price_per_night',
    'currency',
    'images',
    'average_rating',
    'total_reviews',
  ].join(','),
  
  ACCOMMODATION_DETAIL: '*',
  
  ACCOMMODATION_CARD: [
    'id',
    'name',
    'city',
    'country',
    'price_per_night',
    'currency',
    'images',
    'average_rating',
    'bedrooms',
    'bathrooms',
  ].join(','),
  
  // Flight columns
  FLIGHT_LIST: [
    'id',
    'airline',
    'flight_number',
    'origin_airport',
    'destination_airport',
    'departure_time',
    'arrival_time',
    'duration_minutes',
    'price',
    'currency',
    'class_type',
    'available_seats',
  ].join(','),
  
  FLIGHT_DETAIL: '*',
  
  FLIGHT_CARD: [
    'id',
    'airline',
    'origin_airport',
    'destination_airport',
    'departure_time',
    'arrival_time',
    'price',
    'currency',
  ].join(','),
  
  // Event columns
  EVENT_LIST: [
    'id',
    'title',
    'description',
    'category',
    'start_date',
    'end_date',
    'city',
    'country',
    'capacity',
    'available_spots',
    'images',
    'average_rating',
  ].join(','),
  
  EVENT_DETAIL: '*',
  
  EVENT_CARD: [
    'id',
    'title',
    'category',
    'start_date',
    'city',
    'images',
    'available_spots',
  ].join(','),
  
  // Transport columns
  TRANSPORT_LIST: [
    'id',
    'provider',
    'transport_type',
    'route_name',
    'origin',
    'destination',
    'departure_time',
    'arrival_time',
    'duration_minutes',
    'price',
    'currency',
    'available_seats',
  ].join(','),
  
  TRANSPORT_DETAIL: '*',
  
  // Booking columns
  BOOKING_LIST: [
    'id',
    'booking_type',
    'reference_id',
    'status',
    'start_date',
    'end_date',
    'guests',
    'total_price',
    'currency',
    'created_at',
  ].join(','),
  
  BOOKING_DETAIL: '*',
  
  // Review columns
  REVIEW_LIST: [
    'id',
    'user_id',
    'rating',
    'title',
    'comment',
    'created_at',
  ].join(','),
  
  REVIEW_DETAIL: '*',
  
  // User profile columns
  PROFILE_PUBLIC: [
    'id',
    'full_name',
    'avatar_url',
    'bio',
  ].join(','),
  
  PROFILE_PRIVATE: '*',
  
  // Saved items columns
  SAVED_ITEM_LIST: [
    'id',
    'item_type',
    'item_id',
    'notes',
    'created_at',
  ].join(','),
} as const

/**
 * Get column selection string for a specific use case
 */
export function getColumns(preset: keyof typeof COLUMN_PRESETS): string {
  return COLUMN_PRESETS[preset]
}

/**
 * Build optimized query with column selection
 */
export function selectColumns<T>(
  query: any,
  preset: keyof typeof COLUMN_PRESETS
): any {
  const columns = COLUMN_PRESETS[preset]
  return query.select(columns)
}

/**
 * Query performance hints
 */
export const QUERY_HINTS = {
  // Use single() when expecting exactly one result
  USE_SINGLE: 'Use .single() for queries that return exactly one row',
  
  // Use maybeSingle() when expecting 0 or 1 results
  USE_MAYBE_SINGLE: 'Use .maybeSingle() for queries that may return 0 or 1 rows',
  
  // Limit results for list queries
  LIMIT_RESULTS: 'Always use .limit() or .range() for list queries',
  
  // Use indexes
  USE_INDEXES: 'Ensure WHERE clauses use indexed columns',
  
  // Avoid N+1 queries
  AVOID_N_PLUS_ONE: 'Use joins or batch queries instead of multiple sequential queries',
  
  // Select specific columns
  SELECT_COLUMNS: 'Select only needed columns instead of using SELECT *',
} as const

/**
 * Batch query helper to avoid N+1 queries
 */
export async function batchQuery<T, R>(
  items: T[],
  queryFn: (batch: T[]) => Promise<R[]>,
  batchSize: number = 50
): Promise<R[]> {
  const results: R[] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await queryFn(batch)
    results.push(...batchResults)
  }
  
  return results
}

/**
 * Query timing helper for performance monitoring
 */
export async function timeQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now()
  const result = await queryFn()
  const duration = performance.now() - start
  
  // Log slow queries (> 1 second)
  if (duration > 1000) {
    console.warn(`Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`)
  }
  
  return { result, duration }
}
