# TypeScript Types Documentation

This directory contains TypeScript type definitions for the Diasporan application.

## Files

### `supabase.ts`

Contains comprehensive TypeScript types for the Supabase database schema and API responses.

#### Database Types

The `Database` interface provides type-safe access to all database tables:

```typescript
import { Database } from '@/types/supabase'

// Access table types
type UserProfile = Database['public']['Tables']['users_profiles']['Row']
type DiningVenue = Database['public']['Tables']['dining_venues']['Row']
type Booking = Database['public']['Tables']['bookings']['Row']
```

Each table has three type variants:
- **Row**: Complete row data (all fields)
- **Insert**: Data required to insert a new row (optional fields marked)
- **Update**: Data for updating a row (all fields optional)

#### Type Helpers

Use the provided type helpers for cleaner code:

```typescript
import { TableRow, TableInsert, TableUpdate } from '@/types/supabase'

// Instead of Database['public']['Tables']['bookings']['Row']
type Booking = TableRow<'bookings'>

// Instead of Database['public']['Tables']['bookings']['Insert']
type NewBooking = TableInsert<'bookings'>

// Instead of Database['public']['Tables']['bookings']['Update']
type BookingUpdate = TableUpdate<'bookings'>
```

#### API Response Types

Standard API response wrappers:

```typescript
import { ApiResponse, PaginatedResult } from '@/types/supabase'

// Single item response
const response: ApiResponse<UserProfile> = {
  success: true,
  data: { /* user profile */ }
}

// Paginated list response
const listings: PaginatedResult<DiningVenue> = {
  data: [/* venues */],
  pagination: {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5,
    hasNext: true,
    hasPrev: false
  }
}
```

#### Extended Types with Relations

Types that include related data:

```typescript
import { 
  DiningVenueWithDetails,
  BookingWithDetails,
  ReviewWithUser,
  SavedItemWithListing 
} from '@/types/supabase'

// Venue with creator info and reviews
const venue: DiningVenueWithDetails = {
  ...venueData,
  creator: { id: '...', full_name: 'John Doe', avatar_url: '...' },
  recent_reviews: [/* reviews with user info */]
}

// Booking with full listing details
const booking: BookingWithDetails = {
  ...bookingData,
  listing: { /* full venue/accommodation/event data */ },
  user: { /* user info */ }
}
```

#### Filter Types

Type-safe filters for search and listing queries:

```typescript
import { 
  ListingFilters,
  FlightFilters,
  AccommodationFilters,
  DiningFilters,
  EventFilters,
  BookingFilters 
} from '@/types/supabase'

// Generic listing filters
const filters: ListingFilters = {
  page: 1,
  limit: 20,
  city: 'Lagos',
  minPrice: 50,
  maxPrice: 200,
  rating: 4,
  sortBy: 'average_rating',
  sortOrder: 'desc'
}

// Accommodation-specific filters
const accommodationFilters: AccommodationFilters = {
  ...filters,
  checkIn: '2024-01-15',
  checkOut: '2024-01-20',
  guests: 2,
  bedrooms: 1,
  amenities: ['wifi', 'pool']
}
```

#### Input Types

Type-safe input for create and update operations:

```typescript
import { CreateBookingInput, UpdateBookingInput } from '@/types/supabase'

// Create a new booking
const newBooking: CreateBookingInput = {
  booking_type: 'dining',
  reference_id: 'venue-id',
  start_date: '2024-01-15T19:00:00Z',
  guests: 4,
  total_price: 150.00,
  currency: 'USD'
}

// Update an existing booking
const updates: UpdateBookingInput = {
  guests: 6,
  special_requests: 'Window seat please'
}
```

## Usage Examples

### With Supabase Client

```typescript
import { createClient } from '@/lib/supabase/client'
import { TableRow, TableInsert } from '@/types/supabase'

const supabase = createClient()

// Type-safe query
const { data, error } = await supabase
  .from('dining_venues')
  .select('*')
  .eq('city', 'Lagos')

// data is automatically typed as TableRow<'dining_venues'>[]

// Type-safe insert
const newVenue: TableInsert<'dining_venues'> = {
  name: 'New Restaurant',
  description: 'Great food',
  cuisine_type: ['Nigerian'],
  price_range: 3,
  address: '123 Main St',
  city: 'Lagos',
  country: 'Nigeria',
  capacity: 50
}

await supabase.from('dining_venues').insert(newVenue)
```

### In API Routes

```typescript
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ApiResponse, PaginatedResult, TableRow } from '@/types/supabase'

export async function GET(request: Request) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
  
  if (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error.message
      }
    }
    return NextResponse.json(response, { status: 500 })
  }
  
  const response: ApiResponse<TableRow<'bookings'>[]> = {
    success: true,
    data
  }
  
  return NextResponse.json(response)
}
```

### With React Components

```typescript
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TableRow } from '@/types/supabase'

export default function BookingsList() {
  const [bookings, setBookings] = useState<TableRow<'bookings'>[]>([])
  const supabase = createClient()
  
  useEffect(() => {
    async function fetchBookings() {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setBookings(data)
    }
    
    fetchBookings()
  }, [])
  
  return (
    <div>
      {bookings.map(booking => (
        <div key={booking.id}>
          {booking.booking_type} - {booking.status}
        </div>
      ))}
    </div>
  )
}
```

## Regenerating Types

If you make changes to the database schema, regenerate the types:

### From Live Database

```bash
# Link your Supabase project (one time)
npx supabase link --project-ref your-project-ref

# Generate types
npx supabase gen types typescript --linked > src/types/supabase.ts
```

### From Local Database

```bash
# Start local Supabase
npx supabase start

# Generate types
npx supabase gen types typescript --local > src/types/supabase.ts
```

After regenerating, you may need to manually add back the additional API response types at the end of the file.

## Best Practices

1. **Always use the type helpers** (`TableRow`, `TableInsert`, `TableUpdate`) for cleaner code
2. **Use specific filter types** instead of generic objects for better type safety
3. **Wrap API responses** in `ApiResponse<T>` for consistent error handling
4. **Use extended types** (e.g., `BookingWithDetails`) when you need related data
5. **Keep types in sync** with database schema by regenerating after migrations

## Type Safety Tips

- TypeScript will catch mismatched field names and types at compile time
- Use `satisfies` operator for type checking without losing inference:
  ```typescript
  const filters = {
    city: 'Lagos',
    minPrice: 50
  } satisfies ListingFilters
  ```
- Enable strict mode in `tsconfig.json` for maximum type safety
- Use `NonNullable<T>` when you know a nullable field has a value

## Resources

- [Supabase TypeScript Support](https://supabase.com/docs/guides/api/generating-types)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js with TypeScript](https://nextjs.org/docs/basic-features/typescript)
