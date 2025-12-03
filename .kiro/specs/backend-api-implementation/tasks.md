    # Implementation Plan

- [x] 1. Set up Supabase project and configuration





  - Create Supabase project and obtain API keys
  - Install Supabase dependencies (@supabase/supabase-js, @supabase/auth-helpers-nextjs)
  - Configure environment variables for Supabase URL and keys
  - Create Supabase client utilities for client and server components
  - _Requirements: 1.1, 1.2, 13.1_

- [x] 2. Create database schema and migrations





  - Create migration file for users_profiles table
  - Create migration file for dining_venues table
  - Create migration file for accommodations table
  - Create migration file for flights table
  - Create migration file for events table
  - Create migration file for transport_options table
  - Create migration file for bookings table with foreign keys
  - Create migration file for reviews table
  - Create migration file for saved_items table
  - Create migration file for safety_information and safety_reports tables
  - Add indexes for frequently queried columns (city, country, dates, user_id)
  - _Requirements: 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1_

- [x] 3. Configure Row Level Security policies









  - Enable RLS on all tables
  - Create RLS policies for users_profiles (users can read/update own profile)
  - Create RLS policies for bookings (users can read/update own bookings)
  - Create RLS policies for reviews (users can create/update own reviews, all can read)
  - Create RLS policies for saved_items (users can manage own saved items)
  - Create RLS policies for listings (all can read, admins can write)
  - Create RLS policies for safety_reports (users can create own, admins can read all)
  - Test RLS policies with different user roles
  - _Requirements: 13.2_

- [x] 3.1 Write property test for RLS enforcement






  - **Property 37: Row-level security enforced**
  - **Validates: Requirements 13.2**


- [x] 4. Generate TypeScript types from database schema




  - Install Supabase CLI
  - Run type generation command to create Database types
  - Create types/supabase.ts with generated types
  - Create additional TypeScript interfaces for API responses
  - _Requirements: All_

- [x] 5. Implement authentication system





  - Create auth service with signup, login, logout functions
  - Implement password reset functionality
  - Implement token refresh logic
  - Create auth middleware for API routes
  - Update AuthContext to use Supabase auth
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_


- [x] 5.1 Write property test for account creation




  - **Property 1: Account creation succeeds for valid credentials**
  - **Validates: Requirements 1.1**

- [x] 5.2 Write property test for authentication






  - **Property 2: Valid credentials authenticate successfully**
  - **Validates: Requirements 1.2**

- [x] 5.3 Write property test for token refresh






  - **Property 3: Token refresh maintains authentication**
  - **Validates: Requirements 1.3**

- [ ]* 5.4 Write property test for logout
  - **Property 5: Logout invalidates session**
  - **Validates: Requirements 1.5**

- [ ]* 5.5 Write property test for unauthenticated requests
  - **Property 36: Unauthenticated requests rejected**
  - **Validates: Requirements 13.1**

- [x] 6. Implement profile management






  - Create profile service with CRUD operations
  - Implement profile initialization on user signup
  - Create API route for profile updates (PATCH /api/profile)
  - Create API route for profile retrieval (GET /api/profile)
  - Implement profile picture upload to Supabase Storage
  - Create storage bucket for avatars with public access
  - Implement account deletion with cascade
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 6.1 Write property test for profile initialization
  - **Property 6: Account creation initializes profile**
  - **Validates: Requirements 2.1**

- [ ]* 6.2 Write property test for profile update round-trip
  - **Property 7: Profile update round-trip**
  - **Validates: Requirements 2.2**

- [ ]* 6.3 Write property test for image upload
  - **Property 8: Image upload persists reference**
  - **Validates: Requirements 2.3**

- [ ]* 6.4 Write property test for profile completeness
  - **Property 9: Profile response completeness**
  - **Validates: Requirements 2.4**

- [ ]* 6.5 Write property test for account deletion cascade
  - **Property 10: Account deletion cascades**
  - **Validates: Requirements 2.5**

- [ ] 7. Implement dining venues feature
  - Create dining service with listing operations
  - Create API route for dining listings with pagination (GET /api/dining)
  - Create API route for single venue details (GET /api/dining/[id])
  - Implement search and filter functionality
  - Create API route for dining reservations (POST /api/bookings)
  - Set up Realtime subscription for venue updates
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 7.1 Write property test for pagination
  - **Property 11: Pagination consistency**
  - **Validates: Requirements 3.1**

- [ ]* 7.2 Write property test for filter accuracy
  - **Property 12: Filter accuracy**
  - **Validates: Requirements 3.2**

- [ ]* 7.3 Write property test for detail completeness
  - **Property 13: Detail response completeness**
  - **Validates: Requirements 3.3**

- [ ]* 7.4 Write property test for booking creation
  - **Property 14: Booking creation with availability**
  - **Validates: Requirements 3.4**

- [ ]* 7.5 Write property test for real-time updates
  - **Property 28: Data changes broadcast to subscribers**
  - **Validates: Requirements 3.5**

- [x] 8. Implement accommodations feature





  - Create accommodations service with listing operations
  - Create API route for accommodation listings (GET /api/stays)
  - Create API route for accommodation details (GET /api/stays/[id])
  - Implement date range search and availability checking
  - Implement amenity filtering
  - Create booking API with cost calculation
  - Implement booking cancellation with availability restoration
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 8.1 Write property test for date range filtering
  - **Property 12: Filter accuracy**
  - **Validates: Requirements 4.1, 4.2**

- [ ]* 8.2 Write property test for booking cost calculation
  - **Property 15: Booking cost calculation accuracy**
  - **Validates: Requirements 4.4**

- [ ]* 8.3 Write property test for cancellation availability restoration
  - **Property 16: Cancellation restores availability**
  - **Validates: Requirements 4.5**

- [x] 9. Implement flights feature





  - Create flights service with search operations
  - Create API route for flight search (GET /api/flights)
  - Create API route for flight details (GET /api/flights/[id])
  - Implement filter functionality (price, airline, time)
  - Implement saved flights functionality
  - Create price update mechanism
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 9.1 Write property test for flight search filtering
  - **Property 12: Filter accuracy**
  - **Validates: Requirements 5.1, 5.2**

- [ ]* 9.2 Write property test for save item
  - **Property 20: Save item creates record**
  - **Validates: Requirements 5.4**

- [x] 10. Implement events feature





  - Create events service with listing operations
  - Create API route for events listings (GET /api/events)
  - Create API route for event details (GET /api/events/[id])
  - Implement category filtering
  - Create event registration API with capacity management
  - Implement capacity decrement on registration
  - Implement sold-out status when capacity reaches zero
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 10.1 Write property test for event whregistration capacity
  - **Property 17: Event registration decrements capacity**
  - **Validates: Requirements 6.4**

- [x] 11. Implement transport feature





  - Create transport service with search operations
  - Create API route for transport search (GET /api/transport)
  - Create API route for transport details (GET /api/transport/[id])
  - Create transport booking API
  - Implement schedule update mechanism with notifications
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 12. Implement bookings management





  - Create bookings service with CRUD operations
  - Create API route for user bookings list (GET /api/bookings)
  - Create API route for booking details (GET /api/bookings/[id])
  - Create API route for booking modification (PATCH /api/bookings/[id])
  - Create API route for booking cancellation (DELETE /api/bookings/[id])
  - Implement booking status change notifications
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ]* 12.1 Write property test for booking modification
  - **Property 18: Booking modification round-trip**
  - **Validates: Requirements 9.2**

- [ ]* 12.2 Write property test for user bookings completeness
  - **Property 19: User bookings completeness**
  - **Validates: Requirements 9.1**

- [ ]* 12.3 Write property test for cancellation
  - **Property 16: Cancellation restores availability**
  - **Validates: Requirements 9.3**

- [x] 13. Implement saved items feature





  - Create saved items service
  - Create API route for saving items (POST /api/saved)
  - Create API route for removing saved items (DELETE /api/saved/[id])
  - Create API route for listing saved items (GET /api/saved)
  - Implement current data fetching for saved listings
  - Implement unavailable item marking
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 13.1 Write property test for save and remove
  - **Property 21: Remove item deletes record**
  - **Validates: Requirements 10.2**

- [ ]* 13.2 Write property test for saved items current data
  - **Property 22: Saved items show current data**
  - **Validates: Requirements 10.4**

- [ ]* 13.3 Write property test for unavailable marking
  - **Property 23: Unavailable items marked**
  - **Validates: Requirements 10.5**

- [x] 14. Implement reviews system





  - Create reviews service with CRUD operations
  - Create API route for submitting reviews (POST /api/reviews)
  - Implement booking validation for review submission
  - Create API route for listing reviews (GET /api/reviews)
  - Create API route for updating reviews (PATCH /api/reviews/[id])
  - Create API route for deleting reviews (DELETE /api/reviews/[id])
  - Implement average rating calculation and update
  - Create database trigger for automatic rating updates
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ]* 14.1 Write property test for review booking requirement
  - **Property 24: Review requires completed booking**
  - **Validates: Requirements 11.1**

- [ ]* 14.2 Write property test for rating update
  - **Property 25: Review update changes average rating**
  - **Validates: Requirements 11.3**

- [ ]* 14.3 Write property test for rating recalculation
  - **Property 26: Review deletion recalculates rating**
  - **Validates: Requirements 11.4**

- [ ]* 14.4 Write property test for immediate rating update
  - **Property 27: New review updates aggregate immediately**
  - **Validates: Requirements 11.5**

- [x] 15. Implement safety features





  - Create safety service
  - Create API route for safety information (GET /api/safety)
  - Implement location-specific safety info retrieval
  - Create API route for saving emergency contacts (POST /api/profile/emergency-contacts)
  - Create API route for safety reports (POST /api/safety/reports)
  - Implement safety alert storage and notifications
  - Create admin API for updating safety information
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 15.1 Write property test for location-specific info
  - **Property 42: Safety info location-specific**
  - **Validates: Requirements 8.1**

- [ ]* 15.2 Write property test for emergency contacts persistence
  - **Property 43: Emergency contacts persist**
  - **Validates: Requirements 8.2**

- [ ]* 15.3 Write property test for safety report creation
  - **Property 44: Safety reports create records**
  - **Validates: Requirements 8.4**

- [ ]* 15.4 Write property test for immediate updates
  - **Property 45: Safety updates immediate**
  - **Validates: Requirements 8.5**

- [x] 16. Implement admin management features






  - Create admin service with elevated permissions
  - Create admin middleware for route protection
  - Create API routes for admin listing management (POST/PATCH/DELETE /api/admin/listings)
  - Implement listing creation with admin attribution
  - Implement soft delete functionality
  - Create admin query endpoints that include soft-deleted items
  - Implement media upload to Supabase Storage
  - Create storage buckets for listing images
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 16.1 Write property test for admin attribution
  - **Property 39: Admin listing creation attributed**
  - **Validates: Requirements 12.1**

- [ ]* 16.2 Write property test for soft delete
  - **Property 40: Soft delete preserves data**
  - **Validates: Requirements 12.3**

- [ ]* 16.3 Write property test for admin queries
  - **Property 41: Admin queries include deleted**
  - **Validates: Requirements 12.5**

- [x] 17. Implement data validation and error handling





  - Install and configure Zod for schema validation
  - Create validation schemas for all API inputs
  - Implement request validation middleware
  - Create standardized error response utility
  - Implement error logging with context
  - Add validation for date ranges
  - Add validation for enum values
  - Add validation for foreign key references
  - Add validation for unique constraints
  - _Requirements: 13.4, 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ]* 17.1 Write property test for invalid data rejection
  - **Property 31: Invalid data rejected**
  - **Validates: Requirements 15.1**

- [ ]* 17.2 Write property test for foreign key integrity
  - **Property 32: Foreign key integrity enforced**
  - **Validates: Requirements 15.2**

- [ ]* 17.3 Write property test for unique constraints
  - **Property 33: Unique constraints enforced**
  - **Validates: Requirements 15.3**

- [ ]* 17.4 Write property test for date range validation
  - **Property 34: Date range validation**
  - **Validates: Requirements 15.4**

- [ ]* 17.5 Write property test for enum validation
  - **Property 35: Enum validation**
  - **Validates: Requirements 15.5**

- [ ]* 17.6 Write property test for error response structure
  - **Property 38: Error responses structured**
  - **Validates: Requirements 13.4**
-

- [x] 18. Implement real-time subscriptions




  - Create real-time hooks for data subscriptions
  - Implement subscription management (subscribe/unsubscribe)
  - Create useRealtimeListings hook for listing updates
  - Create useRealtimeBookings hook for booking updates
  - Create useRealtimeReviews hook for review updates
  - Implement automatic reconnection logic
  - Add subscription cleanup on component unmount
  - _Requirements: 14.1, 14.2, 14.4, 14.5_

- [ ]* 18.1 Write property test for subscription establishment
  - **Property 29: Subscription establishes connection**
  - **Validates: Requirements 14.1**

- [ ]* 18.2 Write property test for broadcast to subscribers
  - **Property 28: Data changes broadcast to subscribers**
  - **Validates: Requirements 14.2, 14.5**

- [ ]* 18.3 Write property test for unsubscribe
  - **Property 30: Unsubscribe closes connection**
  - **Validates: Requirements 14.4**

- [x] 19. Implement caching and performance optimizations





  - Add Next.js cache configuration for API routes
  - Implement cache headers for static listing data
  - Add database indexes for performance
  - Implement cursor-based pagination for large datasets
  - Optimize Supabase queries to select only needed columns
  - Implement image optimization with Supabase transformations
  - Add loading states and skeleton screens to frontend
  - _Requirements: 13.3_

- [x] 20. Update frontend to use Supabase backend





  - Update dining page to fetch from API
  - Update stays page to fetch from API
  - Update flights page to fetch from API
  - Update events page to fetch from API
  - Update transport page to fetch from API
  - Update profile page to use profile API
  - Update login/signup pages to use Supabase auth
  - Add real-time subscriptions to relevant pages
  - Add error handling and loading states
  - _Requirements: All_

- [x] 21. Final checkpoint - Ensure all tests pass






  - Ensure all tests pass, ask the user if questions arise.
