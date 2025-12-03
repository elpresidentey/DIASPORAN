# Design Document

## Overview

The DettyConnect backend architecture leverages Supabase as the primary Backend-as-a-Service (BaaS) platform, providing PostgreSQL database, authentication, real-time subscriptions, storage, and edge functions. The system follows a hybrid architecture where Next.js API routes handle complex business logic and orchestration, while direct Supabase client calls handle simple CRUD operations and real-time subscriptions.

The architecture prioritizes:
- **Security-first design** with Row Level Security (RLS) policies
- **Real-time capabilities** for live updates across clients
- **Type safety** with TypeScript throughout the stack
- **Performance** through efficient queries, caching, and edge deployment
- **Scalability** leveraging Supabase's managed infrastructure

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Hooks      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
             │ Supabase Client                │ API Routes
             │                                │
             ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Platform                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Auth                           │   │
│  │  - JWT tokens  - Session management  - OAuth        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           PostgreSQL Database + RLS                  │   │
│  │  - Tables  - Policies  - Functions  - Triggers      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Realtime                       │   │
│  │  - WebSocket connections  - Change subscriptions    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Storage                        │   │
│  │  - File uploads  - Image optimization  - CDN        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: Next.js 14+ with App Router, React 18+, TypeScript
- **Backend**: Supabase (PostgreSQL 15+, PostgREST, Realtime)
- **Authentication**: Supabase Auth with JWT
- **Storage**: Supabase Storage with CDN
- **API Layer**: Next.js API Routes (App Router route handlers)
- **Real-time**: Supabase Realtime (WebSocket-based)
- **Type Generation**: Supabase CLI for database types
- **Testing**: Vitest for unit tests, fast-check for property-based tests

## Components and Interfaces

### Database Schema

#### Core Tables

**users_profiles**
```sql
- id: uuid (FK to auth.users)
- email: text
- full_name: text
- avatar_url: text
- phone: text
- bio: text
- preferences: jsonb
- created_at: timestamptz
- updated_at: timestamptz
```

**dining_venues**
```sql
- id: uuid (PK)
- name: text
- description: text
- cuisine_type: text[]
- price_range: int (1-4)
- address: text
- city: text
- country: text
- latitude: decimal
- longitude: decimal
- phone: text
- email: text
- website: text
- hours: jsonb
- capacity: int
- images: text[]
- amenities: text[]
- average_rating: decimal
- total_reviews: int
- created_by: uuid (FK)
- created_at: timestamptz
- updated_at: timestamptz
- deleted_at: timestamptz
```

**accommodations**
```sql
- id: uuid (PK)
- name: text
- description: text
- property_type: text
- address: text
- city: text
- country: text
- latitude: decimal
- longitude: decimal
- bedrooms: int
- bathrooms: int
- max_guests: int
- price_per_night: decimal
- currency: text
- amenities: text[]
- images: text[]
- house_rules: text
- check_in_time: time
- check_out_time: time
- average_rating: decimal
- total_reviews: int
- created_by: uuid (FK)
- created_at: timestamptz
- updated_at: timestamptz
- deleted_at: timestamptz
```

**flights**
```sql
- id: uuid (PK)
- airline: text
- flight_number: text
- origin_airport: text
- destination_airport: text
- departure_time: timestamptz
- arrival_time: timestamptz
- duration_minutes: int
- aircraft_type: text
- available_seats: int
- price: decimal
- currency: text
- class_type: text
- layovers: jsonb[]
- baggage_allowance: jsonb
- created_at: timestamptz
- updated_at: timestamptz
```

**events**
```sql
- id: uuid (PK)
- title: text
- description: text
- category: text
- start_date: timestamptz
- end_date: timestamptz
- location: text
- address: text
- city: text
- country: text
- latitude: decimal
- longitude: decimal
- capacity: int
- available_spots: int
- ticket_types: jsonb[]
- images: text[]
- organizer_id: uuid (FK)
- average_rating: decimal
- total_reviews: int
- created_at: timestamptz
- updated_at: timestamptz
- deleted_at: timestamptz
```

**transport_options**
```sql
- id: uuid (PK)
- provider: text
- transport_type: text (bus, train, car, etc)
- route_name: text
- origin: text
- destination: text
- departure_time: time
- arrival_time: time
- duration_minutes: int
- price: decimal
- currency: text
- schedule: jsonb
- vehicle_info: jsonb
- available_seats: int
- created_at: timestamptz
- updated_at: timestamptz
```

**bookings**
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- booking_type: text (dining, accommodation, flight, event, transport)
- reference_id: uuid (FK to respective table)
- status: text (pending, confirmed, cancelled, completed)
- booking_date: timestamptz
- start_date: timestamptz
- end_date: timestamptz
- guests: int
- total_price: decimal
- currency: text
- payment_status: text
- payment_id: text
- special_requests: text
- metadata: jsonb
- created_at: timestamptz
- updated_at: timestamptz
- cancelled_at: timestamptz
```

**reviews**
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- booking_id: uuid (FK)
- listing_type: text
- listing_id: uuid
- rating: int (1-5)
- title: text
- comment: text
- images: text[]
- helpful_count: int
- created_at: timestamptz
- updated_at: timestamptz
```

**saved_items**
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- item_type: text
- item_id: uuid
- notes: text
- created_at: timestamptz
```

**safety_information**
```sql
- id: uuid (PK)
- country: text
- city: text
- category: text
- title: text
- description: text
- emergency_contacts: jsonb[]
- safety_level: text
- last_updated: timestamptz
- created_by: uuid (FK)
- created_at: timestamptz
- updated_at: timestamptz
```

**safety_reports**
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- location: text
- latitude: decimal
- longitude: decimal
- category: text
- description: text
- severity: text
- status: text
- created_at: timestamptz
- resolved_at: timestamptz
```

### Supabase Client Interface

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const createClient = () => {
  return createClientComponentClient<Database>()
}

// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
```

### API Route Interfaces

```typescript
// app/api/bookings/route.ts
export async function POST(request: Request): Promise<Response>
export async function GET(request: Request): Promise<Response>

// app/api/bookings/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response>
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response>
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response>
```

### Service Layer Interfaces

```typescript
// lib/services/booking.service.ts
interface BookingService {
  createBooking(data: CreateBookingInput): Promise<Booking>
  getBooking(id: string, userId: string): Promise<Booking | null>
  getUserBookings(userId: string, filters?: BookingFilters): Promise<Booking[]>
  updateBooking(id: string, userId: string, data: UpdateBookingInput): Promise<Booking>
  cancelBooking(id: string, userId: string, reason?: string): Promise<Booking>
  validateAvailability(bookingData: CreateBookingInput): Promise<boolean>
}

// lib/services/listing.service.ts
interface ListingService<T> {
  getListings(filters: ListingFilters): Promise<PaginatedResult<T>>
  getListing(id: string): Promise<T | null>
  createListing(data: CreateListingInput<T>): Promise<T>
  updateListing(id: string, data: UpdateListingInput<T>): Promise<T>
  deleteListing(id: string): Promise<void>
  searchListings(query: string, filters: ListingFilters): Promise<PaginatedResult<T>>
}
```

## Data Models

### TypeScript Types

```typescript
// types/database.ts
export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  bio: string | null
  preferences: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface DiningVenue {
  id: string
  name: string
  description: string
  cuisine_type: string[]
  price_range: number
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  phone: string | null
  email: string | null
  website: string | null
  hours: Record<string, any>
  capacity: number
  images: string[]
  amenities: string[]
  average_rating: number
  total_reviews: number
  created_by: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Booking {
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
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
  cancelled_at: string | null
}

export interface Review {
  id: string
  user_id: string
  booking_id: string
  listing_type: string
  listing_id: string
  rating: number
  title: string
  comment: string
  images: string[]
  helpful_count: number
  created_at: string
  updated_at: string
}

// types/api.ts
export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

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
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Authentication Properties

Property 1: Account creation succeeds for valid credentials
*For any* valid registration credentials (email, password meeting requirements), creating an account should succeed and return a user ID
**Validates: Requirements 1.1**

Property 2: Valid credentials authenticate successfully
*For any* user with valid credentials, login should return a valid session token
**Validates: Requirements 1.2**

Property 3: Token refresh maintains authentication
*For any* expired session with a valid refresh token, refreshing should return a new valid session token
**Validates: Requirements 1.3**

Property 4: Password reset generates secure link
*For any* password reset request, a secure reset link should be generated with proper expiration
**Validates: Requirements 1.4**

Property 5: Logout invalidates session
*For any* valid session, logging out should make that session token invalid for subsequent requests
**Validates: Requirements 1.5**

### Profile Management Properties

Property 6: Account creation initializes profile
*For any* new user account, a profile record should be created with default values
**Validates: Requirements 2.1**

Property 7: Profile update round-trip
*For any* profile update, retrieving the profile should return the updated values
**Validates: Requirements 2.2**

Property 8: Image upload persists reference
*For any* valid image upload, the file should be stored and the profile should contain the storage URL
**Validates: Requirements 2.3**

Property 9: Profile response completeness
*For any* profile request, the response should contain all required fields (email, name, preferences, statistics)
**Validates: Requirements 2.4**

Property 10: Account deletion cascades
*For any* user account deletion, all associated data (bookings, reviews, saved items) should be removed
**Validates: Requirements 2.5**

### Listing and Search Properties

Property 11: Pagination consistency
*For any* listing request with pagination parameters, results should be properly paginated with correct page metadata
**Validates: Requirements 3.1, 4.1, 5.1, 6.1, 7.1**

Property 12: Filter accuracy
*For any* search with filters, all returned results should match the specified filter criteria
**Validates: Requirements 3.2, 4.2, 5.2, 6.2**

Property 13: Detail response completeness
*For any* listing detail request, the response should contain all required fields for that listing type
**Validates: Requirements 3.3, 4.3, 5.3, 6.3, 7.2**

### Booking Properties

Property 14: Booking creation with availability
*For any* valid booking request where availability exists, a booking record should be created successfully
**Validates: Requirements 3.4, 4.4, 7.3**

Property 15: Booking cost calculation accuracy
*For any* booking, the total cost should equal the unit price multiplied by quantity (nights, guests, tickets) plus any fees
**Validates: Requirements 4.4**

Property 16: Cancellation restores availability
*For any* booking cancellation, the available capacity should increase by the booking quantity
**Validates: Requirements 4.5, 9.3**

Property 17: Event registration decrements capacity
*For any* event registration, the available spots should decrease by the number of tickets purchased
**Validates: Requirements 6.4**

Property 18: Booking modification round-trip
*For any* booking modification, retrieving the booking should reflect the changes
**Validates: Requirements 9.2**

Property 19: User bookings completeness
*For any* user, retrieving their bookings should return all bookings associated with that user
**Validates: Requirements 9.1, 7.5**

### Saved Items Properties

Property 20: Save item creates record
*For any* listing and user, saving the item should create a retrievable saved item record
**Validates: Requirements 5.4, 10.1**

Property 21: Remove item deletes record
*For any* saved item, removing it should result in it no longer appearing in the user's saved items
**Validates: Requirements 10.2**

Property 22: Saved items show current data
*For any* saved listing that has been updated, viewing saved items should show the current listing data
**Validates: Requirements 10.4**

Property 23: Unavailable items marked
*For any* saved listing that becomes unavailable (deleted or sold out), it should be marked as unavailable in saved items
**Validates: Requirements 10.5**

### Review Properties

Property 24: Review requires completed booking
*For any* review submission, it should only succeed if the user has a completed booking for that listing
**Validates: Requirements 11.1**

Property 25: Review update changes average rating
*For any* review update where the rating changes, the listing's average rating should be recalculated correctly
**Validates: Requirements 11.3**

Property 26: Review deletion recalculates rating
*For any* review deletion, the listing's average rating should be recalculated without that review
**Validates: Requirements 11.4**

Property 27: New review updates aggregate immediately
*For any* new review submission, the listing's average rating and review count should update immediately
**Validates: Requirements 11.5**

### Real-time Properties

Property 28: Data changes broadcast to subscribers
*For any* data change on a subscribed channel, all active subscribers should receive the update
**Validates: Requirements 3.5, 14.2, 14.5**

Property 29: Subscription establishes connection
*For any* subscription request, a real-time connection should be established successfully
**Validates: Requirements 14.1**

Property 30: Unsubscribe closes connection
*For any* unsubscribe action, the connection should be closed and no further updates received
**Validates: Requirements 14.4**

### Data Validation Properties

Property 31: Invalid data rejected
*For any* data insertion with invalid fields (wrong type, missing required, out of range), the operation should be rejected
**Validates: Requirements 15.1**

Property 32: Foreign key integrity enforced
*For any* insertion with a foreign key, it should fail if the referenced record doesn't exist
**Validates: Requirements 15.2**

Property 33: Unique constraints enforced
*For any* insertion with a duplicate value on a unique field, the operation should be rejected with appropriate error
**Validates: Requirements 15.3**

Property 34: Date range validation
*For any* date range input, the system should reject ranges where end date is before start date
**Validates: Requirements 15.4**

Property 35: Enum validation
*For any* field with enumerated values, only values in the allowed set should be accepted
**Validates: Requirements 15.5**

### Security Properties

Property 36: Unauthenticated requests rejected
*For any* API request without a valid authentication token, the request should be rejected with 401 status
**Validates: Requirements 13.1**

Property 37: Row-level security enforced
*For any* database query, users should only access records they are authorized to view based on RLS policies
**Validates: Requirements 13.2**

Property 38: Error responses structured
*For any* error condition, the API response should have proper structure (error code, message) and appropriate HTTP status
**Validates: Requirements 13.4**

### Admin Properties

Property 39: Admin listing creation attributed
*For any* listing created by an administrator, the created_by field should reference the admin user
**Validates: Requirements 12.1**

Property 40: Soft delete preserves data
*For any* admin listing deletion, the record should be soft-deleted (deleted_at set) and future bookings cancelled
**Validates: Requirements 12.3**

Property 41: Admin queries include deleted
*For any* admin listing query, results should include soft-deleted items
**Validates: Requirements 12.5**

### Safety Properties

Property 42: Safety info location-specific
*For any* safety information request for a location, the response should contain information specific to that location
**Validates: Requirements 8.1**

Property 43: Emergency contacts persist
*For any* emergency contact save operation, retrieving the profile should return the saved contacts
**Validates: Requirements 8.2**

Property 44: Safety reports create records
*For any* safety concern report, a record should be created with timestamp and location data
**Validates: Requirements 8.4**

Property 45: Safety updates immediate
*For any* safety information update by admin, the changes should be immediately visible to users
**Validates: Requirements 8.5**

## Error Handling

### Error Categories

1. **Authentication Errors**
   - Invalid credentials (401)
   - Expired token (401)
   - Insufficient permissions (403)

2. **Validation Errors**
   - Missing required fields (400)
   - Invalid data format (400)
   - Constraint violations (400)

3. **Resource Errors**
   - Not found (404)
   - Already exists (409)
   - Gone/deleted (410)

4. **Business Logic Errors**
   - Insufficient availability (409)
   - Invalid booking dates (400)
   - Review without booking (403)

5. **System Errors**
   - Database errors (500)
   - Storage errors (500)
   - External service errors (502)

### Error Response Format

```typescript
interface ErrorResponse {
  success: false
  error: {
    code: string // Machine-readable error code
    message: string // Human-readable message
    details?: any // Additional context
    field?: string // Field that caused validation error
  }
}
```

### Error Handling Strategy

- **Client-side**: Supabase client automatically handles auth token refresh and retries
- **API Routes**: Try-catch blocks with structured error responses
- **Database**: RLS policies return empty results instead of errors for unauthorized access
- **Validation**: Zod schemas for request validation with detailed error messages
- **Logging**: All errors logged with context (user ID, request ID, timestamp)

## Testing Strategy

### Unit Testing

Unit tests will cover:
- Service layer functions with mocked Supabase client
- API route handlers with mocked requests
- Validation schemas and utility functions
- Error handling and edge cases
- Business logic calculations (pricing, availability)

Testing framework: Vitest with @supabase/supabase-js mocked

### Property-Based Testing

Property-based tests will verify universal properties using fast-check library configured to run minimum 100 iterations per test.

Each property-based test will:
- Be tagged with format: `**Feature: backend-api-implementation, Property {number}: {property_text}**`
- Use generators to create random valid inputs
- Verify the property holds across all generated inputs
- Test edge cases through generator configuration

Property tests will cover:
- Authentication flows (login, logout, token refresh)
- CRUD operations (create, read, update, delete)
- Data validation and constraints
- Pagination and filtering
- Booking calculations and availability
- Review rating calculations
- Real-time update propagation

### Integration Testing

Integration tests will:
- Use a test Supabase project with isolated database
- Test complete user flows (signup → profile → booking → review)
- Verify RLS policies with different user roles
- Test real-time subscriptions with actual WebSocket connections
- Verify file upload and storage operations

### Database Testing

Database tests will verify:
- Schema migrations apply correctly
- RLS policies enforce correct access control
- Triggers and functions execute as expected
- Foreign key constraints maintain referential integrity
- Indexes improve query performance

## Implementation Notes

### Supabase Setup

1. **Project Configuration**
   - Create Supabase project
   - Configure authentication providers
   - Set up storage buckets (avatars, listing-images)
   - Enable Realtime for required tables

2. **Database Schema**
   - Run migration files to create tables
   - Create indexes for frequently queried columns
   - Set up foreign key relationships
   - Configure cascade delete rules

3. **Row Level Security**
   - Enable RLS on all tables
   - Create policies for user data access
   - Create admin policies for management operations
   - Test policies with different user roles

4. **Type Generation**
   - Use Supabase CLI to generate TypeScript types
   - Keep types in sync with schema changes
   - Use generated types throughout application

### Performance Considerations

- **Caching**: Use Next.js cache for static listing data
- **Pagination**: Implement cursor-based pagination for large datasets
- **Indexes**: Create indexes on foreign keys and frequently filtered columns
- **Query Optimization**: Use select() to fetch only needed columns
- **Real-time**: Subscribe only to necessary channels, unsubscribe on unmount
- **Image Optimization**: Use Supabase image transformations for thumbnails

### Security Considerations

- **Environment Variables**: Store Supabase keys in .env.local
- **RLS Policies**: Never bypass RLS, even in admin operations
- **Input Validation**: Validate all user input before database operations
- **SQL Injection**: Use parameterized queries (Supabase client handles this)
- **CORS**: Configure allowed origins in Supabase dashboard
- **Rate Limiting**: Implement rate limiting for public endpoints
