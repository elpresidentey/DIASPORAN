/**
 * Cache Configuration Utilities
 * Provides standardized cache headers for different types of API responses
 */

export interface CacheConfig {
  maxAge: number // seconds
  staleWhileRevalidate: number // seconds
  public?: boolean
}

/**
 * Cache configurations for different resource types
 */
export const CACHE_CONFIGS = {
  // Static listing data - cache for 5 minutes, serve stale for 10 minutes
  LISTINGS: {
    maxAge: 300,
    staleWhileRevalidate: 600,
    public: true,
  },
  
  // Accommodation data - cache for 1 minute, serve stale for 2 minutes
  ACCOMMODATIONS: {
    maxAge: 60,
    staleWhileRevalidate: 120,
    public: true,
  },
  
  // Flight data - cache for 5 minutes (prices change frequently)
  FLIGHTS: {
    maxAge: 300,
    staleWhileRevalidate: 600,
    public: true,
  },
  
  // Event data - cache for 2 minutes
  EVENTS: {
    maxAge: 120,
    staleWhileRevalidate: 240,
    public: true,
  },
  
  // Transport data - cache for 5 minutes
  TRANSPORT: {
    maxAge: 300,
    staleWhileRevalidate: 600,
    public: true,
  },
  
  // User-specific data - no public cache, short private cache
  USER_DATA: {
    maxAge: 30,
    staleWhileRevalidate: 60,
    public: false,
  },
  
  // Bookings - no cache (always fresh)
  BOOKINGS: {
    maxAge: 0,
    staleWhileRevalidate: 0,
    public: false,
  },
  
  // Reviews - cache for 2 minutes
  REVIEWS: {
    maxAge: 120,
    staleWhileRevalidate: 240,
    public: true,
  },
  
  // Safety information - cache for 10 minutes
  SAFETY: {
    maxAge: 600,
    staleWhileRevalidate: 1200,
    public: true,
  },
} as const

/**
 * Generate Cache-Control header string from config
 */
export function getCacheHeader(config: CacheConfig): string {
  const parts: string[] = []
  
  if (config.public) {
    parts.push('public')
  } else {
    parts.push('private')
  }
  
  if (config.maxAge > 0) {
    parts.push(`s-maxage=${config.maxAge}`)
    parts.push(`max-age=${config.maxAge}`)
  } else {
    parts.push('no-cache')
    parts.push('no-store')
  }
  
  if (config.staleWhileRevalidate > 0) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`)
  }
  
  return parts.join(', ')
}

/**
 * Get cache headers object for Next.js Response
 */
export function getCacheHeaders(configKey: keyof typeof CACHE_CONFIGS): Record<string, string> {
  const config = CACHE_CONFIGS[configKey]
  return {
    'Cache-Control': getCacheHeader(config),
  }
}
