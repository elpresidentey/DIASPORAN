/**
 * Flight Service
 * Handles all flight search and saved flights operations
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Database, FlightFilters, PaginatedResult } from '@/types/supabase'

type Flight = Database['public']['Tables']['flights']['Row']
type FlightUpdate = Database['public']['Tables']['flights']['Update']
type SavedItem = Database['public']['Tables']['saved_items']['Row']

export interface FlightServiceError {
  code: string
  message: string
  details?: any
}

/**
 * Get paginated list of flights with filters
 */
export async function getFlights(
  filters: FlightFilters = {}
): Promise<{ data: PaginatedResult<Flight> | null; error: FlightServiceError | null }> {
  const supabase = createClient()

  const {
    page = 1,
    limit = 20,
    origin,
    destination,
    departureDate,
    minPrice,
    maxPrice,
    airline,
    class: classType,
    maxStops,
    sortBy = 'departure_time',
    sortOrder = 'asc',
  } = filters

  let query = supabase
    .from('flights')
    .select('*', { count: 'exact' })

  // Apply filters
  if (origin) {
    query = query.ilike('origin_airport', `%${origin}%`)
  }

  if (destination) {
    query = query.ilike('destination_airport', `%${destination}%`)
  }

  if (departureDate) {
    // Filter flights on the departure date
    const startOfDay = new Date(departureDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(departureDate)
    endOfDay.setHours(23, 59, 59, 999)
    
    query = query
      .gte('departure_time', startOfDay.toISOString())
      .lte('departure_time', endOfDay.toISOString())
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice)
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice)
  }

  if (airline) {
    query = query.ilike('airline', `%${airline}%`)
  }

  if (classType) {
    query = query.eq('class_type', classType)
  }

  if (maxStops !== undefined) {
    // Filter by number of layovers
    // This is a simplified check - in production you'd use a more sophisticated query
    query = query.filter('layovers', 'cs', `{length:${maxStops}}`)
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return {
      data: null,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch flights',
        details: error,
      },
    }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    data: {
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
    error: null,
  }
}

/**
 * Get single flight by ID
 */
export async function getFlight(
  id: string
): Promise<{ flight: Flight | null; error: FlightServiceError | null }> {
  const supabase = createClient()

  const { data: flight, error } = await supabase
    .from('flights')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return {
      flight: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Flight not found',
        details: error,
      },
    }
  }

  return { flight, error: null }
}

/**
 * Save a flight to user's saved items
 */
export async function saveFlight(
  userId: string,
  flightId: string,
  notes?: string
): Promise<{ savedItem: SavedItem | null; error: FlightServiceError | null }> {
  const supabase = createClient()

  // First verify the flight exists
  const { flight, error: flightError } = await getFlight(flightId)

  if (flightError || !flight) {
    return {
      savedItem: null,
      error: flightError || {
        code: 'FLIGHT_NOT_FOUND',
        message: 'Flight not found',
      },
    }
  }

  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', userId)
    .eq('item_type', 'flight')
    .eq('item_id', flightId)
    .single()

  if (existing) {
    return {
      savedItem: null,
      error: {
        code: 'ALREADY_SAVED',
        message: 'Flight is already saved',
      },
    }
  }

  // Create saved item
  const { data: savedItem, error: saveError } = await supabase
    .from('saved_items')
    .insert({
      user_id: userId,
      item_type: 'flight',
      item_id: flightId,
      notes: notes || null,
    } as Database['public']['Tables']['saved_items']['Insert'])
    .select()
    .single()

  if (saveError) {
    return {
      savedItem: null,
      error: {
        code: 'SAVE_FAILED',
        message: 'Failed to save flight',
        details: saveError,
      },
    }
  }

  return { savedItem, error: null }
}

/**
 * Remove a flight from user's saved items
 */
export async function unsaveFlight(
  userId: string,
  flightId: string
): Promise<{ success: boolean; error: FlightServiceError | null }> {
  const supabase = createClient()

  const { error } = await supabase
    .from('saved_items')
    .delete()
    .eq('user_id', userId)
    .eq('item_type', 'flight')
    .eq('item_id', flightId)

  if (error) {
    return {
      success: false,
      error: {
        code: 'UNSAVE_FAILED',
        message: 'Failed to remove saved flight',
        details: error,
      },
    }
  }

  return { success: true, error: null }
}

/**
 * Get user's saved flights
 */
export async function getSavedFlights(
  userId: string
): Promise<{ flights: Flight[]; error: FlightServiceError | null }> {
  const supabase = createClient()

  // Get saved flight IDs
  const { data: savedItems, error: savedError } = await supabase
    .from('saved_items')
    .select('item_id')
    .eq('user_id', userId)
    .eq('item_type', 'flight' as Database['public']['Tables']['saved_items']['Row']['item_type'])

  if (savedError) {
    return {
      flights: [],
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch saved flights',
        details: savedError,
      },
    }
  }

  if (!savedItems || savedItems.length === 0) {
    return { flights: [], error: null }
  }

  const flightIds = savedItems.map(item => item.item_id)

  // Get flight details
  const { data: flights, error: flightsError } = await supabase
    .from('flights')
    .select('*')
    .in('id', flightIds)

  if (flightsError) {
    return {
      flights: [],
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch flight details',
        details: flightsError,
      },
    }
  }

  return { flights: flights || [], error: null }
}

/**
 * Update flight prices (admin/system operation)
 */
export async function updateFlightPrice(
  flightId: string,
  newPrice: number
): Promise<{ flight: Flight | null; error: FlightServiceError | null }> {
  const supabase = createClient()

  const { data: flight, error } = await supabase
    .from('flights')
    .update({
      price: newPrice,
      updated_at: new Date().toISOString(),
    } as Database['public']['Tables']['flights']['Update'])
    .eq('id', flightId)
    .select()
    .single()

  if (error) {
    return {
      flight: null,
      error: {
        code: 'UPDATE_FAILED',
        message: 'Failed to update flight price',
        details: error,
      },
    }
  }

  return { flight, error: null }
}

/**
 * Server-side version of getFlights for use in API routes
 */
export async function getFlightsServer(
  filters: FlightFilters = {}
): Promise<{ data: PaginatedResult<Flight> | null; error: FlightServiceError | null }> {
  const supabase = createServerClient()

  const {
    page = 1,
    limit = 20,
    origin,
    destination,
    departureDate,
    minPrice,
    maxPrice,
    airline,
    class: classType,
    maxStops,
    sortBy = 'departure_time',
    sortOrder = 'asc',
  } = filters

  let query = supabase
    .from('flights')
    .select('*', { count: 'exact' })

  // Apply filters
  if (origin) {
    query = query.ilike('origin_airport', `%${origin}%`)
  }

  if (destination) {
    query = query.ilike('destination_airport', `%${destination}%`)
  }

  if (departureDate) {
    const startOfDay = new Date(departureDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(departureDate)
    endOfDay.setHours(23, 59, 59, 999)
    
    query = query
      .gte('departure_time', startOfDay.toISOString())
      .lte('departure_time', endOfDay.toISOString())
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice)
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice)
  }

  if (airline) {
    query = query.ilike('airline', `%${airline}%`)
  }

  if (classType) {
    query = query.eq('class_type', classType)
  }

  if (maxStops !== undefined) {
    query = query.filter('layovers', 'cs', `{length:${maxStops}}`)
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return {
      data: null,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch flights',
        details: error,
      },
    }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    data: {
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
    error: null,
  }
}

/**
 * Server-side version of getFlight for use in API routes
 */
export async function getFlightServer(
  id: string
): Promise<{ flight: Flight | null; error: FlightServiceError | null }> {
  const supabase = createServerClient()

  const { data: flight, error } = await supabase
    .from('flights')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return {
      flight: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Flight not found',
        details: error,
      },
    }
  }

  return { flight, error: null }
}
