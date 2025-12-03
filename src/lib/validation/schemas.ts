/**
 * Validation Schemas
 * Zod schemas for validating API inputs across all endpoints
 */

import { z } from 'zod'

// ============================================================================
// Common Schemas
// ============================================================================

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' })

/**
 * Email validation schema
 */
export const emailSchema = z.string().email({ message: 'Invalid email format' })

/**
 * Phone number validation schema (international format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  .optional()

/**
 * URL validation schema
 */
export const urlSchema = z.string().url({ message: 'Invalid URL format' }).optional()

/**
 * Date string validation (ISO 8601)
 */
export const dateStringSchema = z.string().datetime({ message: 'Invalid date format (ISO 8601 required)' })

/**
 * Date range validation - ensures end date is after start date
 */
export const dateRangeSchema = z
  .object({
    start_date: dateStringSchema,
    end_date: dateStringSchema,
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: 'End date must be after start date',
    path: ['end_date'],
  })

/**
 * Pagination parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// ============================================================================
// Enum Schemas
// ============================================================================

/**
 * Booking type enum
 */
export const bookingTypeSchema = z.enum(['dining', 'accommodation', 'flight', 'event', 'transport'])

/**
 * Booking status enum
 */
export const bookingStatusSchema = z.enum(['pending', 'confirmed', 'cancelled', 'completed'])

/**
 * Payment status enum
 */
export const paymentStatusSchema = z.enum(['pending', 'paid', 'refunded', 'failed'])

/**
 * Listing type enum
 */
export const listingTypeSchema = z.enum(['dining', 'accommodation', 'flight', 'event', 'transport'])

/**
 * Safety severity enum
 */
export const safetySeveritySchema = z.enum(['low', 'medium', 'high', 'critical'])

/**
 * Safety report status enum
 */
export const safetyReportStatusSchema = z.enum(['pending', 'investigating', 'resolved', 'dismissed'])

// ============================================================================
// Authentication Schemas
// ============================================================================

/**
 * User registration schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required').max(255),
})

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

/**
 * Password reset schema
 */
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// ============================================================================
// Profile Schemas
// ============================================================================

/**
 * Profile update schema
 */
export const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(255).optional(),
  phone: phoneSchema,
  bio: z.string().max(1000).optional(),
  preferences: z.record(z.string(), z.any()).optional(),
})

/**
 * Emergency contact schema
 */
export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Contact name is required').max(255),
  relationship: z.string().min(1, 'Relationship is required').max(100),
  phone: z.string().min(1, 'Phone number is required'),
  email: emailSchema.optional(),
})

/**
 * Emergency contacts array schema
 */
export const emergencyContactsSchema = z.object({
  contacts: z.array(emergencyContactSchema).min(1, 'At least one emergency contact is required'),
})

// ============================================================================
// Booking Schemas
// ============================================================================

/**
 * Create booking schema
 */
export const createBookingSchema = z
  .object({
    booking_type: bookingTypeSchema,
    reference_id: uuidSchema,
    start_date: dateStringSchema,
    end_date: dateStringSchema.optional(),
    guests: z.number().int().positive('Number of guests must be positive'),
    special_requests: z.string().max(1000).optional(),
    ticket_type: z.string().optional(), // For events
  })
  .refine(
    (data) => {
      // Accommodation bookings require end_date
      if (data.booking_type === 'accommodation' && !data.end_date) {
        return false
      }
      return true
    },
    {
      message: 'End date is required for accommodation bookings',
      path: ['end_date'],
    }
  )
  .refine(
    (data) => {
      // Validate date range if end_date is provided
      if (data.end_date) {
        return new Date(data.end_date) > new Date(data.start_date)
      }
      return true
    },
    {
      message: 'End date must be after start date',
      path: ['end_date'],
    }
  )

/**
 * Update booking schema
 */
export const updateBookingSchema = z
  .object({
    start_date: dateStringSchema.optional(),
    end_date: dateStringSchema.optional(),
    guests: z.number().int().positive().optional(),
    special_requests: z.string().max(1000).optional(),
  })
  .refine(
    (data) => {
      // If both dates provided, validate range
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) > new Date(data.start_date)
      }
      return true
    },
    {
      message: 'End date must be after start date',
      path: ['end_date'],
    }
  )

/**
 * Booking filters schema
 */
export const bookingFiltersSchema = paginationSchema.extend({
  status: bookingStatusSchema.optional(),
  booking_type: bookingTypeSchema.optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
})

// ============================================================================
// Review Schemas
// ============================================================================

/**
 * Create review schema
 */
export const createReviewSchema = z.object({
  booking_id: uuidSchema,
  listing_type: listingTypeSchema,
  listing_id: uuidSchema,
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().min(1, 'Title is required').max(200),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(2000),
  images: z.array(z.string().url()).max(10, 'Maximum 10 images allowed').optional(),
})

/**
 * Update review schema
 */
export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(1).max(200).optional(),
  comment: z.string().min(10).max(2000).optional(),
  images: z.array(z.string().url()).max(10).optional(),
})

/**
 * Review filters schema
 */
export const reviewFiltersSchema = paginationSchema.extend({
  listing_type: listingTypeSchema.optional(),
  listing_id: uuidSchema.optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
})

// ============================================================================
// Saved Items Schemas
// ============================================================================

/**
 * Save item schema
 */
export const saveItemSchema = z.object({
  item_type: listingTypeSchema,
  item_id: uuidSchema,
  notes: z.string().max(500).optional(),
})

/**
 * Saved items filters schema
 */
export const savedItemsFiltersSchema = paginationSchema.extend({
  item_type: listingTypeSchema.optional(),
})

// ============================================================================
// Safety Schemas
// ============================================================================

/**
 * Safety report schema
 */
export const createSafetyReportSchema = z.object({
  location: z.string().min(1, 'Location is required').max(255),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  category: z.string().min(1, 'Category is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  severity: safetySeveritySchema,
})

/**
 * Safety information filters schema
 */
export const safetyInfoFiltersSchema = z.object({
  country: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
})

// ============================================================================
// Listing Schemas (Common)
// ============================================================================

/**
 * Common listing filters schema
 */
export const listingFiltersSchema = paginationSchema.extend({
  city: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

/**
 * Accommodation filters schema
 */
export const accommodationFiltersSchema = listingFiltersSchema.extend({
  start_date: dateStringSchema.optional(),
  end_date: dateStringSchema.optional(),
  bedrooms: z.coerce.number().int().positive().optional(),
  bathrooms: z.coerce.number().int().positive().optional(),
  max_guests: z.coerce.number().int().positive().optional(),
  amenities: z.array(z.string()).optional(),
})

/**
 * Flight filters schema
 */
export const flightFiltersSchema = paginationSchema.extend({
  origin_airport: z.string().optional(),
  destination_airport: z.string().optional(),
  departure_date: dateStringSchema.optional(),
  airline: z.string().optional(),
  class_type: z.string().optional(),
  maxPrice: z.coerce.number().positive().optional(),
})

/**
 * Event filters schema
 */
export const eventFiltersSchema = listingFiltersSchema.extend({
  category: z.string().optional(),
  start_date: dateStringSchema.optional(),
  end_date: dateStringSchema.optional(),
})

// ============================================================================
// Admin Schemas
// ============================================================================

/**
 * Admin listing creation schema (generic)
 */
export const adminCreateListingSchema = z.object({
  listing_type: listingTypeSchema,
  data: z.record(z.string(), z.any()), // Specific validation happens in service layer
})

/**
 * Admin listing update schema
 */
export const adminUpdateListingSchema = z.object({
  data: z.record(z.string(), z.any()),
})

/**
 * Admin soft delete schema
 */
export const adminSoftDeleteSchema = z.object({
  reason: z.string().max(500).optional(),
})

// ============================================================================
// Export all schemas
// ============================================================================

export const schemas = {
  // Common
  uuid: uuidSchema,
  email: emailSchema,
  phone: phoneSchema,
  url: urlSchema,
  dateString: dateStringSchema,
  dateRange: dateRangeSchema,
  pagination: paginationSchema,

  // Enums
  bookingType: bookingTypeSchema,
  bookingStatus: bookingStatusSchema,
  paymentStatus: paymentStatusSchema,
  listingType: listingTypeSchema,
  safetySeverity: safetySeveritySchema,
  safetyReportStatus: safetyReportStatusSchema,

  // Auth
  register: registerSchema,
  login: loginSchema,
  passwordResetRequest: passwordResetRequestSchema,
  passwordReset: passwordResetSchema,

  // Profile
  updateProfile: updateProfileSchema,
  emergencyContact: emergencyContactSchema,
  emergencyContacts: emergencyContactsSchema,

  // Bookings
  createBooking: createBookingSchema,
  updateBooking: updateBookingSchema,
  bookingFilters: bookingFiltersSchema,

  // Reviews
  createReview: createReviewSchema,
  updateReview: updateReviewSchema,
  reviewFilters: reviewFiltersSchema,

  // Saved Items
  saveItem: saveItemSchema,
  savedItemsFilters: savedItemsFiltersSchema,

  // Safety
  createSafetyReport: createSafetyReportSchema,
  safetyInfoFilters: safetyInfoFiltersSchema,

  // Listings
  listingFilters: listingFiltersSchema,
  accommodationFilters: accommodationFiltersSchema,
  flightFilters: flightFiltersSchema,
  eventFilters: eventFiltersSchema,

  // Admin
  adminCreateListing: adminCreateListingSchema,
  adminUpdateListing: adminUpdateListingSchema,
  adminSoftDelete: adminSoftDeleteSchema,
}
