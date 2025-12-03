# Performance Optimization Guide

This document describes the performance optimizations implemented in the DettyConnect backend API.

## Overview

Performance optimizations have been implemented across multiple layers:
- **Caching**: HTTP cache headers for API responses
- **Query Optimization**: Column selection and efficient queries
- **Pagination**: Cursor-based and offset-based pagination
- **Image Optimization**: Supabase Storage transformations
- **Database Indexes**: Optimized indexes for common queries

## 1. Caching Strategy

### Cache Configuration (`src/lib/cache.ts`)

Standardized cache headers are applied to all API routes based on data volatility:

| Resource Type | Max Age | Stale While Revalidate | Public |
|--------------|---------|------------------------|--------|
| Listings | 5 min | 10 min | Yes |
| Accommodations | 1 min | 2 min | Yes |
| Flights | 5 min | 10 min | Yes |
| Events | 2 min | 4 min | Yes |
| Transport | 5 min | 10 min | Yes |
| Reviews | 2 min | 4 min | Yes |
| Safety Info | 10 min | 20 min | Yes |
| User Data | 30 sec | 1 min | No |
| Bookings | No cache | No cache | No |

### Usage

```typescript
import { getCacheHeaders } from '@/lib/cache'

return NextResponse.json(data, {
  status: 200,
  headers: getCacheHeaders('LISTINGS'),
})
```

### Cache Invalidation

- **Client-side**: Use `cache: 'no-store'` in fetch for fresh data
- **Server-side**: Revalidate paths after mutations using Next.js `revalidatePath()`
- **Real-time**: Supabase Realtime subscriptions bypass cache

## 2. Query Optimization

### Column Selection (`src/lib/query-optimization.ts`)

Selecting only needed columns reduces payload size and improves performance:

```typescript
import { COLUMN_PRESETS } from '@/lib/query-optimization'

// List view - minimal columns
const { data } = await supabase
  .from('accommodations')
  .select(COLUMN_PRESETS.ACCOMMODATION_LIST)

// Detail view - all columns
const { data } = await supabase
  .from('accommodations')
  .select(COLUMN_PRESETS.ACCOMMODATION_DETAIL)

// Card view - optimized for UI cards
const { data } = await supabase
  .from('accommodations')
  .select(COLUMN_PRESETS.ACCOMMODATION_CARD)
```

### Query Performance Tips

1. **Use indexes**: Ensure WHERE clauses use indexed columns
2. **Limit results**: Always use `.limit()` or `.range()` for list queries
3. **Avoid N+1**: Use joins or batch queries instead of loops
4. **Use single()**: For queries returning exactly one row
5. **Select specific columns**: Avoid `SELECT *` in production

### Batch Queries

Avoid N+1 queries by batching:

```typescript
import { batchQuery } from '@/lib/query-optimization'

const results = await batchQuery(
  items,
  async (batch) => {
    const ids = batch.map(item => item.id)
    const { data } = await supabase
      .from('table')
      .select('*')
      .in('id', ids)
    return data || []
  },
  50 // batch size
)
```

## 3. Pagination

### Offset-Based Pagination (`src/lib/pagination.ts`)

Standard pagination for most list views:

```typescript
import { getOffsetRange, buildPaginationMeta } from '@/lib/pagination'

const { from, to } = getOffsetRange(page, limit)

const { data, count } = await supabase
  .from('table')
  .select('*', { count: 'exact' })
  .range(from, to)

const meta = buildPaginationMeta(page, limit, count || 0)
```

### Cursor-Based Pagination

For large datasets and infinite scroll:

```typescript
import { decodeCursor, buildCursorPaginationMeta } from '@/lib/pagination'

let query = supabase.from('table').select('*').limit(limit)

if (cursor) {
  const decoded = decodeCursor(cursor)
  if (decoded) {
    query = query
      .lt('created_at', decoded.timestamp)
      .neq('id', decoded.id)
  }
}

const { data } = await query.order('created_at', { ascending: false })
const meta = buildCursorPaginationMeta(data, limit, cursor)
```

### Pagination Limits

- Default limit: 20 items
- Maximum limit: 100 items
- Minimum page: 1

## 4. Image Optimization

### Supabase Storage Transformations (`src/lib/image-optimization.ts`)

Optimize images using Supabase's built-in transformations:

```typescript
import { getOptimizedImageUrl, IMAGE_PRESETS } from '@/lib/image-optimization'

// Using presets
const thumbnailUrl = getOptimizedImageUrl(imageUrl, IMAGE_PRESETS.THUMBNAIL)
const cardUrl = getOptimizedImageUrl(imageUrl, IMAGE_PRESETS.CARD)
const detailUrl = getOptimizedImageUrl(imageUrl, IMAGE_PRESETS.DETAIL)

// Custom options
const customUrl = getOptimizedImageUrl(imageUrl, {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp',
  resize: 'cover',
})
```

### Image Presets

| Preset | Width | Height | Quality | Format | Use Case |
|--------|-------|--------|---------|--------|----------|
| THUMBNAIL | 150 | 150 | 80 | webp | List thumbnails |
| CARD | 400 | 300 | 85 | webp | Card images |
| DETAIL | 1200 | 800 | 90 | webp | Detail pages |
| AVATAR | 200 | 200 | 85 | webp | User avatars |

### Responsive Images

Generate srcset for responsive images:

```typescript
import { generateSrcSet } from '@/lib/image-optimization'

const srcset = generateSrcSet(imageUrl, [400, 800, 1200, 1600])
// Returns: "url?width=400 400w, url?width=800 800w, ..."
```

## 5. Database Indexes

### Existing Indexes

All tables have indexes on frequently queried columns:

**Accommodations**:
- `city`, `country`, `property_type`
- `price_per_night`, `max_guests`, `average_rating`
- `deleted_at` (for soft delete queries)
- `amenities` (GIN index for array contains)

**Flights**:
- `origin_airport`, `destination_airport`
- `departure_time`, `arrival_time`
- `airline`, `price`, `class_type`, `available_seats`
- Composite: `(origin_airport, destination_airport, departure_time)`

**Events**:
- `city`, `country`, `category`
- `start_date`, `end_date`, `available_spots`
- `organizer_id`, `deleted_at`
- Composite: `(start_date, end_date)`

**Bookings**:
- `user_id`, `booking_type`, `status`
- `reference_id`, `start_date`, `end_date`

**Reviews**:
- `user_id`, `listing_type`, `listing_id`
- `booking_id`, `rating`

### Index Usage Tips

1. **Use indexed columns in WHERE clauses**
2. **Order by indexed columns when possible**
3. **Composite indexes for common filter combinations**
4. **GIN indexes for JSONB and array queries**

## 6. Performance Monitoring

### Query Timing

Use the `timeQuery` helper to monitor slow queries:

```typescript
import { timeQuery } from '@/lib/query-optimization'

const { result, duration } = await timeQuery('getAccommodations', async () => {
  return await getAccommodations(filters)
})

// Automatically logs queries > 1 second
```

### Metrics to Monitor

- **Response time**: API route execution time
- **Query time**: Database query duration
- **Cache hit rate**: Percentage of cached responses
- **Payload size**: Response body size
- **Database connections**: Active connection count

## 7. Best Practices

### API Routes

1. ✅ Apply appropriate cache headers
2. ✅ Validate pagination parameters
3. ✅ Select only needed columns
4. ✅ Use indexes in WHERE clauses
5. ✅ Implement proper error handling
6. ✅ Return structured responses

### Services

1. ✅ Use column presets for queries
2. ✅ Implement batch operations
3. ✅ Avoid N+1 queries
4. ✅ Use transactions for multi-step operations
5. ✅ Handle errors gracefully

### Frontend

1. ✅ Use optimized image URLs
2. ✅ Implement pagination
3. ✅ Show loading states
4. ✅ Use skeleton screens
5. ✅ Implement infinite scroll for large lists
6. ✅ Cache API responses client-side

## 8. Performance Checklist

- [x] Cache headers on all API routes
- [x] Column selection presets
- [x] Pagination utilities
- [x] Image optimization helpers
- [x] Database indexes
- [ ] Query performance monitoring
- [ ] Response compression (handled by Next.js)
- [ ] CDN configuration (handled by Vercel/deployment)
- [ ] Database connection pooling (handled by Supabase)

## 9. Future Optimizations

### Potential Improvements

1. **Redis caching**: Add Redis for frequently accessed data
2. **GraphQL**: Consider GraphQL for flexible queries
3. **Edge functions**: Move some logic to edge for lower latency
4. **Database replicas**: Read replicas for scaling reads
5. **Full-text search**: PostgreSQL full-text search or Algolia
6. **Rate limiting**: Implement rate limiting for public endpoints
7. **Compression**: Brotli compression for responses
8. **Prefetching**: Prefetch related data

### Monitoring Tools

- **Supabase Dashboard**: Query performance, connection pool
- **Vercel Analytics**: Response times, cache hit rates
- **Sentry**: Error tracking and performance monitoring
- **Custom logging**: Application-level metrics

## 10. Troubleshooting

### Slow Queries

1. Check if indexes are being used: `EXPLAIN ANALYZE`
2. Verify column selection (avoid SELECT *)
3. Check for N+1 queries
4. Review filter complexity
5. Consider pagination limits

### Cache Issues

1. Verify cache headers are set
2. Check cache-control in browser DevTools
3. Test with `cache: 'no-store'` to bypass
4. Verify CDN configuration

### Image Loading

1. Use appropriate presets for use case
2. Implement lazy loading
3. Use srcset for responsive images
4. Consider WebP/AVIF format support
5. Monitor Supabase Storage bandwidth

## References

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Supabase Performance](https://supabase.com/docs/guides/platform/performance)
- [Supabase Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
