/**
 * Example: Optimized Listing Page
 * 
 * This example demonstrates how to use the performance optimizations:
 * - Image optimization
 * - Pagination
 * - Loading states with skeleton screens
 * - Cursor-based pagination for infinite scroll
 */

'use client'

import { useState, useEffect } from 'react'
import { getOptimizedImageUrl, IMAGE_PRESETS } from '@/lib/image-optimization'
import { ListSkeleton, AccommodationCardSkeleton } from '@/components/ui/ListingSkeleton'

interface Accommodation {
  id: string
  name: string
  city: string
  country: string
  price_per_night: number
  currency: string
  images: string[]
  average_rating: number
  bedrooms: number
  bathrooms: number
}

interface PaginatedResponse {
  data: Accommodation[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * Example 1: Basic Listing Page with Pagination
 */
export function OptimizedListingPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginatedResponse['pagination'] | null>(null)

  useEffect(() => {
    async function fetchAccommodations() {
      setLoading(true)
      try {
        // API route automatically applies cache headers
        const response = await fetch(`/api/stays?page=${page}&limit=20`)
        const result = await response.json()
        
        if (result.success) {
          setAccommodations(result.data.data)
          setPagination(result.data.pagination)
        }
      } catch (error) {
        console.error('Failed to fetch accommodations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodations()
  }, [page])

  if (loading) {
    return <ListSkeleton count={6} type="accommodation" />
  }

  return (
    <div className="space-y-8">
      {/* Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations.map((accommodation) => (
          <AccommodationCard key={accommodation.id} accommodation={accommodation} />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={!pagination.hasPrev}
            className="px-6 py-2 bg-white/10 rounded-full disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-6 py-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!pagination.hasNext}
            className="px-6 py-2 bg-white/10 rounded-full disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Example 2: Accommodation Card with Optimized Images
 */
function AccommodationCard({ accommodation }: { accommodation: Accommodation }) {
  // Get optimized image URL for card display
  const cardImageUrl = accommodation.images[0]
    ? getOptimizedImageUrl(accommodation.images[0], IMAGE_PRESETS.CARD)
    : '/placeholder.jpg'

  return (
    <div className="bg-white/5 rounded-3xl overflow-hidden hover:bg-white/10 transition-colors">
      {/* Optimized Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={cardImageUrl}
          alt={accommodation.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">{accommodation.name}</h3>
        
        <p className="text-white/60">
          {accommodation.city}, {accommodation.country}
        </p>

        <div className="flex gap-4 text-sm text-white/60">
          <span>{accommodation.bedrooms} bedrooms</span>
          <span>{accommodation.bathrooms} bathrooms</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold">
              {accommodation.currency} {accommodation.price_per_night}
            </span>
            <span className="text-white/60"> / night</span>
          </div>
          
          {accommodation.average_rating > 0 && (
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>{accommodation.average_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Example 3: Infinite Scroll with Cursor-Based Pagination
 */
export function InfiniteScrollListingPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | undefined>()

  const loadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const url = cursor
        ? `/api/stays?cursor=${cursor}&limit=20`
        : '/api/stays?limit=20'
      
      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setAccommodations(prev => [...prev, ...result.data.data])
        setCursor(result.data.pagination.nextCursor)
        setHasMore(result.data.pagination.hasNext)
      }
    } catch (error) {
      console.error('Failed to load more:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-8">
      {/* Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations.map((accommodation) => (
          <AccommodationCard key={accommodation.id} accommodation={accommodation} />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <AccommodationCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* End of Results */}
      {!hasMore && accommodations.length > 0 && (
        <p className="text-center text-white/60">
          You&apos;ve reached the end of the results
        </p>
      )}
    </div>
  )
}

/**
 * Example 4: Detail Page with Optimized Images
 */
export function OptimizedDetailPage({ id }: { id: string }) {
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAccommodation() {
      setLoading(true)
      try {
        const response = await fetch(`/api/stays/${id}`)
        const result = await response.json()
        
        if (result.success) {
          setAccommodation(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch accommodation:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodation()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-96 bg-white/5 rounded-3xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-10 bg-white/5 rounded-lg animate-pulse w-2/3" />
          <div className="h-4 bg-white/5 rounded-lg animate-pulse w-1/2" />
        </div>
      </div>
    )
  }

  if (!accommodation) {
    return <div>Accommodation not found</div>
  }

  // Get optimized images for different sizes
  const heroImage = accommodation.images[0]
    ? getOptimizedImageUrl(accommodation.images[0], IMAGE_PRESETS.DETAIL)
    : '/placeholder.jpg'

  const thumbnails = accommodation.images.slice(1, 5).map(img =>
    getOptimizedImageUrl(img, IMAGE_PRESETS.THUMBNAIL)
  )

  return (
    <div className="space-y-8">
      {/* Hero Image - Optimized for detail view */}
      <div className="relative h-96 rounded-3xl overflow-hidden">
        <img
          src={heroImage}
          alt={accommodation.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Gallery - Optimized thumbnails */}
      <div className="flex gap-4 overflow-x-auto">
        {thumbnails.map((thumb, index) => (
          <img
            key={index}
            src={thumb}
            alt={`${accommodation.name} ${index + 2}`}
            className="w-24 h-24 rounded-lg object-cover"
            loading="lazy"
          />
        ))}
      </div>

      {/* Details */}
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">{accommodation.name}</h1>
        <p className="text-xl text-white/60">
          {accommodation.city}, {accommodation.country}
        </p>
        {/* ... rest of the details ... */}
      </div>
    </div>
  )
}

/**
 * Example 5: Using Query Optimization in API Route
 * 
 * This would be in an API route file:
 * 
 * ```typescript
 * import { createServerClient } from '@/lib/supabase/server'
 * import { COLUMN_PRESETS } from '@/lib/query-optimization'
 * import { getCacheHeaders } from '@/lib/cache'
 * import { getOffsetRange, buildPaginationMeta } from '@/lib/pagination'
 * 
 * export async function GET(request: NextRequest) {
 *   const supabase = createServerClient()
 *   const { searchParams } = new URL(request.url)
 *   
 *   const page = parseInt(searchParams.get('page') || '1')
 *   const limit = parseInt(searchParams.get('limit') || '20')
 *   
 *   // Use optimized column selection
 *   const { from, to } = getOffsetRange(page, limit)
 *   
 *   const { data, count } = await supabase
 *     .from('accommodations')
 *     .select(COLUMN_PRESETS.ACCOMMODATION_LIST, { count: 'exact' })
 *     .is('deleted_at', null)
 *     .range(from, to)
 *   
 *   const pagination = buildPaginationMeta(page, limit, count || 0)
 *   
 *   return NextResponse.json(
 *     { success: true, data: { data, pagination } },
 *     { headers: getCacheHeaders('ACCOMMODATIONS') }
 *   )
 * }
 * ```
 */
