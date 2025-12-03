/**
 * Type Usage Examples
 * 
 * This file demonstrates how to use the generated Supabase types.
 * These examples are for reference only and are not executed.
 */

import { 
  Database, 
  TableRow, 
  TableInsert, 
  TableUpdate,
  ApiResponse,
  PaginatedResult,
  DiningVenueWithDetails,
  BookingWithDetails,
  CreateBookingInput,
  ListingFilters,
  AccommodationFilters
} from './supabase'

// ============================================================================
// Example 1: Using Table Types
// ============================================================================

// Get the Row type for a table
type UserProfile = TableRow<'users_profiles'>
type DiningVenue = TableRow<'dining_venues'>
type Booking = TableRow<'bookings'>

// Example user profile
const exampleProfile: UserProfile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'user@example.com',
  full_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg',
  phone: '+1234567890',
  bio: 'Travel enthusiast',
  preferences: { theme: 'dark', notifications: true },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

// ============================================================================
// Example 2: Insert Types
// ============================================================================

// Get the Insert type for creating new records
type NewDiningVenue = TableInsert<'dining_venues'>

const newVenue: NewDiningVenue = {
  name: 'Amazing Restaurant',
  description: 'Best food in town',
  cuisine_type: ['Nigerian', 'Continental'],
  price_range: 3,
  address: '123 Main Street',
  city: 'Lagos',
  country: 'Nigeria',
  capacity: 50,
  // Optional fields can be omitted
  // id, created_at, updated_at will be auto-generated
}

// ============================================================================
// Example 3: Update Types
// ============================================================================

// Get the Update type for updating records
type VenueUpdate = TableUpdate<'dining_venues'>

const venueUpdate: VenueUpdate = {
  // All fields are optional for updates
  name: 'Updated Restaurant Name',
  capacity: 75,
  // Only include fields you want to update
}

// ============================================================================
// Example 4: API Response Wrappers
// ============================================================================

// Single item response
const profileResponse: ApiResponse<UserProfile> = {
  success: true,
  data: exampleProfile
}

// Error response
const errorResponse: ApiResponse<never> = {
  success: false,
  error: {
    code: 'NOT_FOUND',
    message: 'User not found',
    field: 'id'
  }
}

// Paginated response
const venuesResponse: PaginatedResult<DiningVenue> = {
  data: [
    // Array of dining venues
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5,
    hasNext: true,
    hasPrev: false
  }
}

// ============================================================================
// Example 5: Extended Types with Relations
// ============================================================================

// Venue with creator and reviews
const venueWithDetails: DiningVenueWithDetails = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Amazing Restaurant',
  description: 'Best food in town',
  cuisine_type: ['Nigerian', 'Continental'],
  price_range: 3,
  address: '123 Main Street',
  city: 'Lagos',
  country: 'Nigeria',
  latitude: 6.5244,
  longitude: 3.3792,
  phone: '+234123456789',
  email: 'info@restaurant.com',
  website: 'https://restaurant.com',
  hours: { monday: '9am-10pm', tuesday: '9am-10pm' },
  capacity: 50,
  average_rating: 4.5,
  total_reviews: 25,
  images: ['image1.jpg', 'image2.jpg'],
  amenities: ['wifi', 'parking'],
  created_by: 'admin-id',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  deleted_at: null,
  // Extended fields
  creator: {
    id: 'creator-id',
    full_name: 'Admin User',
    avatar_url: 'https://example.com/admin.jpg'
  },
  recent_reviews: [
    {
      id: 'review-id',
      user_id: 'user-id',
      booking_id: 'booking-id',
      listing_type: 'dining',
      listing_id: 'venue-id',
      rating: 5,
      title: 'Excellent!',
      comment: 'Great food and service',
      images: [],
      helpful_count: 10,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      user: {
        id: 'user-id',
        full_name: 'Jane Smith',
        avatar_url: 'https://example.com/jane.jpg'
      }
    }
  ]
}

// Booking with full details
const bookingWithDetails: BookingWithDetails = {
  id: 'booking-id',
  user_id: 'user-id',
  booking_type: 'dining',
  reference_id: 'venue-id',
  status: 'confirmed',
  booking_date: '2024-01-01T00:00:00Z',
  start_date: '2024-01-15T19:00:00Z',
  end_date: null,
  guests: 4,
  total_price: 150.00,
  currency: 'USD',
  payment_status: 'paid',
  payment_id: 'payment-123',
  special_requests: 'Window seat please',
  metadata: { source: 'mobile_app' },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  cancelled_at: null,
  // Extended fields
  listing: venueWithDetails,
  user: {
    id: 'user-id',
    full_name: 'John Doe',
    email: 'john@example.com',
    avatar_url: 'https://example.com/john.jpg'
  }
}

// ============================================================================
// Example 6: Input Types for API Operations
// ============================================================================

// Create a new booking
const createBooking: CreateBookingInput = {
  booking_type: 'accommodation',
  reference_id: 'accommodation-id',
  start_date: '2024-01-15T14:00:00Z',
  end_date: '2024-01-20T11:00:00Z',
  guests: 2,
  total_price: 500.00,
  currency: 'USD',
  special_requests: 'Early check-in if possible',
  metadata: {
    promo_code: 'WELCOME10',
    referral_source: 'google'
  }
}

// ============================================================================
// Example 7: Filter Types
// ============================================================================

// Generic listing filters
const listingFilters: ListingFilters = {
  page: 1,
  limit: 20,
  city: 'Lagos',
  country: 'Nigeria',
  minPrice: 50,
  maxPrice: 200,
  rating: 4,
  sortBy: 'average_rating',
  sortOrder: 'desc',
  search: 'restaurant'
}

// Accommodation-specific filters
const accommodationFilters: AccommodationFilters = {
  ...listingFilters,
  checkIn: '2024-01-15',
  checkOut: '2024-01-20',
  guests: 2,
  bedrooms: 1,
  bathrooms: 1,
  propertyType: 'apartment',
  amenities: ['wifi', 'pool', 'parking']
}

// ============================================================================
// Example 8: Using with Supabase Client
// ============================================================================

/*
import { createClient } from '@/lib/supabase/client'

async function fetchDiningVenues() {
  const supabase = createClient()
  
  // TypeScript knows the return type automatically
  const { data, error } = await supabase
    .from('dining_venues')
    .select('*')
    .eq('city', 'Lagos')
    .order('average_rating', { ascending: false })
  
  // data is typed as TableRow<'dining_venues'>[] | null
  if (data) {
    data.forEach(venue => {
      console.log(venue.name) // TypeScript autocomplete works!
    })
  }
}

async function createBooking(input: CreateBookingInput) {
  const supabase = createClient()
  
  const bookingData: TableInsert<'bookings'> = {
    user_id: 'current-user-id',
    ...input
  }
  
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single()
  
  return data // Typed as TableRow<'bookings'> | null
}

async function updateProfile(userId: string, updates: TableUpdate<'users_profiles'>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('users_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return data
}
*/

// ============================================================================
// Example 9: Type Guards and Narrowing
// ============================================================================

function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true; data: T } {
  return response.success === true && response.data !== undefined
}

function handleResponse<T>(response: ApiResponse<T>) {
  if (isSuccessResponse(response)) {
    // TypeScript knows response.data exists here
    console.log(response.data)
  } else {
    // TypeScript knows response.error exists here
    console.error(response.error?.message)
  }
}

// ============================================================================
// Example 10: Utility Types
// ============================================================================

// Extract specific fields from a table type
type UserBasicInfo = Pick<TableRow<'users_profiles'>, 'id' | 'full_name' | 'avatar_url'>

// Make all fields required
type RequiredBooking = Required<TableRow<'bookings'>>

// Make all fields optional
type PartialVenue = Partial<TableRow<'dining_venues'>>

// Omit specific fields
type VenueWithoutTimestamps = Omit<TableRow<'dining_venues'>, 'created_at' | 'updated_at'>

// ============================================================================
// Export examples for reference
// ============================================================================

export type {
  UserProfile,
  DiningVenue,
  Booking,
  NewDiningVenue,
  VenueUpdate,
  UserBasicInfo,
  RequiredBooking,
  PartialVenue,
  VenueWithoutTimestamps
}

export {
  exampleProfile,
  newVenue,
  venueUpdate,
  profileResponse,
  errorResponse,
  venuesResponse,
  venueWithDetails,
  bookingWithDetails,
  createBooking,
  listingFilters,
  accommodationFilters,
  isSuccessResponse,
  handleResponse
}
