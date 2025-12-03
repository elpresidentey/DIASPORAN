/**
 * Supabase Database Types
 * 
 * This file contains TypeScript types generated from the Supabase database schema.
 * Generated from migration files in supabase/migrations/
 * 
 * To regenerate these types from a live database:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Login to Supabase: supabase login
 * 3. Link your project: supabase link --project-ref your-project-ref
 * 4. Generate types: supabase gen types typescript --linked > src/types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          bio: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      dining_venues: {
        Row: {
          id: string
          name: string
          description: string
          cuisine_type: string[]
          price_range: number
          address: string
          city: string
          country: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          email: string | null
          website: string | null
          hours: Json | null
          capacity: number
          images: string[]
          amenities: string[]
          average_rating: number
          total_reviews: number
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          cuisine_type?: string[]
          price_range: number
          address: string
          city: string
          country: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          email?: string | null
          website?: string | null
          hours?: Json | null
          capacity?: number
          images?: string[]
          amenities?: string[]
          average_rating?: number
          total_reviews?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          cuisine_type?: string[]
          price_range?: number
          address?: string
          city?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          email?: string | null
          website?: string | null
          hours?: Json | null
          capacity?: number
          images?: string[]
          amenities?: string[]
          average_rating?: number
          total_reviews?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dining_venues_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      accommodations: {
        Row: {
          id: string
          name: string
          description: string
          property_type: string
          address: string
          city: string
          country: string
          latitude: number | null
          longitude: number | null
          bedrooms: number
          bathrooms: number
          max_guests: number
          price_per_night: number
          currency: string
          amenities: string[]
          images: string[]
          house_rules: string | null
          check_in_time: string | null
          check_out_time: string | null
          average_rating: number
          total_reviews: number
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          property_type: string
          address: string
          city: string
          country: string
          latitude?: number | null
          longitude?: number | null
          bedrooms?: number
          bathrooms?: number
          max_guests?: number
          price_per_night: number
          currency?: string
          amenities?: string[]
          images?: string[]
          house_rules?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          average_rating?: number
          total_reviews?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          property_type?: string
          address?: string
          city?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          bedrooms?: number
          bathrooms?: number
          max_guests?: number
          price_per_night?: number
          currency?: string
          amenities?: string[]
          images?: string[]
          house_rules?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          average_rating?: number
          total_reviews?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodations_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      flights: {
        Row: {
          id: string
          airline: string
          flight_number: string
          origin_airport: string
          destination_airport: string
          departure_time: string
          arrival_time: string
          duration_minutes: number
          aircraft_type: string | null
          available_seats: number
          price: number
          currency: string
          class_type: string
          layovers: Json[]
          baggage_allowance: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          airline: string
          flight_number: string
          origin_airport: string
          destination_airport: string
          departure_time: string
          arrival_time: string
          duration_minutes: number
          aircraft_type?: string | null
          available_seats?: number
          price: number
          currency?: string
          class_type: string
          layovers?: Json[]
          baggage_allowance?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          airline?: string
          flight_number?: string
          origin_airport?: string
          destination_airport?: string
          departure_time?: string
          arrival_time?: string
          duration_minutes?: number
          aircraft_type?: string | null
          available_seats?: number
          price?: number
          currency?: string
          class_type?: string
          layovers?: Json[]
          baggage_allowance?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          start_date: string
          end_date: string
          location: string
          address: string
          city: string
          country: string
          latitude: number | null
          longitude: number | null
          capacity: number
          available_spots: number
          ticket_types: Json[]
          images: string[]
          organizer_id: string | null
          average_rating: number
          total_reviews: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          start_date: string
          end_date: string
          location: string
          address: string
          city: string
          country: string
          latitude?: number | null
          longitude?: number | null
          capacity?: number
          available_spots?: number
          ticket_types?: Json[]
          images?: string[]
          organizer_id?: string | null
          average_rating?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          start_date?: string
          end_date?: string
          location?: string
          address?: string
          city?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          capacity?: number
          available_spots?: number
          ticket_types?: Json[]
          images?: string[]
          organizer_id?: string | null
          average_rating?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      transport_options: {
        Row: {
          id: string
          provider: string
          transport_type: string
          route_name: string
          origin: string
          destination: string
          departure_time: string
          arrival_time: string
          duration_minutes: number
          price: number
          currency: string
          schedule: Json | null
          vehicle_info: Json | null
          available_seats: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider: string
          transport_type: string
          route_name: string
          origin: string
          destination: string
          departure_time: string
          arrival_time: string
          duration_minutes: number
          price: number
          currency?: string
          schedule?: Json | null
          vehicle_info?: Json | null
          available_seats?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider?: string
          transport_type?: string
          route_name?: string
          origin?: string
          destination?: string
          departure_time?: string
          arrival_time?: string
          duration_minutes?: number
          price?: number
          currency?: string
          schedule?: Json | null
          vehicle_info?: Json | null
          available_seats?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          booking_type: 'dining' | 'accommodation' | 'flight' | 'event' | 'transport'
          reference_id: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          booking_date: string
          start_date: string
          end_date: string | null
          guests: number
          total_price: number
          currency: string
          payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
          payment_id: string | null
          special_requests: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
          cancelled_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          booking_type: 'dining' | 'accommodation' | 'flight' | 'event' | 'transport'
          reference_id: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          booking_date?: string
          start_date: string
          end_date?: string | null
          guests?: number
          total_price: number
          currency?: string
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          payment_id?: string | null
          special_requests?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          cancelled_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          booking_type?: 'dining' | 'accommodation' | 'flight' | 'event' | 'transport'
          reference_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          booking_date?: string
          start_date?: string
          end_date?: string | null
          guests?: number
          total_price?: number
          currency?: string
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          payment_id?: string | null
          special_requests?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          cancelled_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          booking_id: string
          listing_type: 'dining' | 'accommodation' | 'event' | 'transport'
          listing_id: string
          rating: number
          title: string
          comment: string
          images: string[]
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booking_id: string
          listing_type: 'dining' | 'accommodation' | 'event' | 'transport'
          listing_id: string
          rating: number
          title: string
          comment: string
          images?: string[]
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booking_id?: string
          listing_type?: 'dining' | 'accommodation' | 'event' | 'transport'
          listing_id?: string
          rating?: number
          title?: string
          comment?: string
          images?: string[]
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_items: {
        Row: {
          id: string
          user_id: string
          item_type: 'dining' | 'accommodation' | 'flight' | 'event' | 'transport'
          item_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_type: 'dining' | 'accommodation' | 'flight' | 'event' | 'transport'
          item_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_type?: 'dining' | 'accommodation' | 'flight' | 'event' | 'transport'
          item_id?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_items_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      safety_information: {
        Row: {
          id: string
          country: string
          city: string | null
          category: string
          title: string
          description: string
          emergency_contacts: Json[]
          safety_level: 'low' | 'moderate' | 'high' | 'critical' | null
          last_updated: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          country: string
          city?: string | null
          category: string
          title: string
          description: string
          emergency_contacts?: Json[]
          safety_level?: 'low' | 'moderate' | 'high' | 'critical' | null
          last_updated?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          country?: string
          city?: string | null
          category?: string
          title?: string
          description?: string
          emergency_contacts?: Json[]
          safety_level?: 'low' | 'moderate' | 'high' | 'critical' | null
          last_updated?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_information_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      safety_reports: {
        Row: {
          id: string
          user_id: string
          location: string
          latitude: number | null
          longitude: number | null
          category: string
          description: string
          severity: 'low' | 'moderate' | 'high' | 'critical'
          status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          location: string
          latitude?: number | null
          longitude?: number | null
          category: string
          description: string
          severity: 'low' | 'moderate' | 'high' | 'critical'
          status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          location?: string
          latitude?: number | null
          longitude?: number | null
          category?: string
          description?: string
          severity?: 'low' | 'moderate' | 'high' | 'critical'
          status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          created_at?: string
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<string, never>
        Returns: undefined
      }
      update_listing_rating: {
        Args: Record<string, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


// ============================================================================
// Additional TypeScript Interfaces for API Responses
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

/**
 * API error structure
 */
export interface ApiError {
  code: string
  message: string
  details?: any
  field?: string
}

/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationMeta
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Generic listing filters
 */
export interface ListingFilters {
  page?: number
  limit?: number
  city?: string
  country?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

/**
 * Booking filters
 */
export interface BookingFilters {
  page?: number
  limit?: number
  status?: Database['public']['Tables']['bookings']['Row']['status']
  booking_type?: Database['public']['Tables']['bookings']['Row']['booking_type']
  startDate?: string
  endDate?: string
}

/**
 * User profile with computed fields
 */
export type UserProfileWithStats = Database['public']['Tables']['users_profiles']['Row'] & {
  total_bookings?: number
  total_reviews?: number
  total_saved_items?: number
}

/**
 * Dining venue with related data
 */
export type DiningVenueWithDetails = Database['public']['Tables']['dining_venues']['Row'] & {
  creator?: Pick<Database['public']['Tables']['users_profiles']['Row'], 'id' | 'full_name' | 'avatar_url'>
  recent_reviews?: ReviewWithUser[]
}

/**
 * Accommodation with related data
 */
export type AccommodationWithDetails = Database['public']['Tables']['accommodations']['Row'] & {
  creator?: Pick<Database['public']['Tables']['users_profiles']['Row'], 'id' | 'full_name' | 'avatar_url'>
  recent_reviews?: ReviewWithUser[]
  availability?: AvailabilityInfo
}

/**
 * Event with related data
 */
export type EventWithDetails = Database['public']['Tables']['events']['Row'] & {
  organizer?: Pick<Database['public']['Tables']['users_profiles']['Row'], 'id' | 'full_name' | 'avatar_url'>
  recent_reviews?: ReviewWithUser[]
  is_sold_out?: boolean
}

/**
 * Booking with related listing data
 */
export type BookingWithDetails = Database['public']['Tables']['bookings']['Row'] & {
  listing?: DiningVenueWithDetails | AccommodationWithDetails | EventWithDetails | Database['public']['Tables']['flights']['Row'] | Database['public']['Tables']['transport_options']['Row']
  user?: Pick<Database['public']['Tables']['users_profiles']['Row'], 'id' | 'full_name' | 'email' | 'avatar_url'>
}

/**
 * Review with user information
 */
export type ReviewWithUser = Database['public']['Tables']['reviews']['Row'] & {
  user?: Pick<Database['public']['Tables']['users_profiles']['Row'], 'id' | 'full_name' | 'avatar_url'>
}

/**
 * Saved item with current listing data
 */
export type SavedItemWithListing = Database['public']['Tables']['saved_items']['Row'] & {
  listing?: DiningVenueWithDetails | AccommodationWithDetails | Database['public']['Tables']['flights']['Row'] | EventWithDetails | Database['public']['Tables']['transport_options']['Row']
  is_available?: boolean
}

/**
 * Availability information for accommodations
 */
export interface AvailabilityInfo {
  is_available: boolean
  blocked_dates?: string[]
  next_available_date?: string
}

/**
 * Flight search filters
 */
export interface FlightFilters extends ListingFilters {
  origin?: string
  destination?: string
  departureDate?: string
  returnDate?: string
  passengers?: number
  class?: string
  airline?: string
  maxStops?: number
}

/**
 * Accommodation search filters
 */
export interface AccommodationFilters extends ListingFilters {
  checkIn?: string
  checkOut?: string
  guests?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
  amenities?: string[]
}

/**
 * Dining venue search filters
 */
export interface DiningFilters extends ListingFilters {
  cuisineType?: string[]
  priceRange?: number[]
  capacity?: number
  amenities?: string[]
}

/**
 * Event search filters
 */
export interface EventFilters extends ListingFilters {
  category?: string
  startDate?: string
  endDate?: string
  hasAvailability?: boolean
}

/**
 * Transport search filters
 */
export interface TransportFilters extends ListingFilters {
  origin?: string
  destination?: string
  date?: string
  transportType?: string
  provider?: string
}

/**
 * Safety information filters
 */
export interface SafetyFilters {
  country?: string
  city?: string
  category?: string
  safetyLevel?: Database['public']['Tables']['safety_information']['Row']['safety_level']
}

/**
 * Create booking input
 */
export interface CreateBookingInput {
  booking_type: Database['public']['Tables']['bookings']['Row']['booking_type']
  reference_id: string
  start_date: string
  end_date?: string
  guests: number
  total_price: number
  currency?: string
  special_requests?: string
  metadata?: Json
}

/**
 * Update booking input
 */
export interface UpdateBookingInput {
  start_date?: string
  end_date?: string
  guests?: number
  special_requests?: string
  status?: Database['public']['Tables']['bookings']['Row']['status']
}

/**
 * Create review input
 */
export interface CreateReviewInput {
  booking_id: string
  listing_type: Database['public']['Tables']['reviews']['Row']['listing_type']
  listing_id: string
  rating: number
  title: string
  comment: string
  images?: string[]
}

/**
 * Update review input
 */
export interface UpdateReviewInput {
  rating?: number
  title?: string
  comment?: string
  images?: string[]
}

/**
 * Create listing input (generic)
 */
export type CreateListingInput<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

/**
 * Update listing input (generic)
 */
export type UpdateListingInput<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']

/**
 * Real-time subscription payload
 */
export interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T | null
  old: T | null
  errors: string[] | null
}

/**
 * Authentication session
 */
export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: AuthUser
}

/**
 * Authenticated user
 */
export interface AuthUser {
  id: string
  email: string
  email_confirmed_at?: string
  phone?: string
  created_at: string
  updated_at: string
  app_metadata: Record<string, any>
  user_metadata: Record<string, any>
}

/**
 * Type helpers for table names
 */
export type TableName = keyof Database['public']['Tables']

/**
 * Type helper to get Row type from table name
 */
export type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row']

/**
 * Type helper to get Insert type from table name
 */
export type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert']

/**
 * Type helper to get Update type from table name
 */
export type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update']
