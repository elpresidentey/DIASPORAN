# Diasporan Database Schema Overview

## Schema Design Principles

The Diasporan database follows these design principles:

1. **Security First**: Row Level Security (RLS) enabled on all tables
2. **Data Integrity**: Foreign keys, check constraints, and unique constraints
3. **Performance**: Strategic indexes on frequently queried columns
4. **Auditability**: Timestamps on all tables with automatic updates
5. **Soft Deletes**: Preservation of data with `deleted_at` timestamps
6. **Flexibility**: JSONB fields for extensible data structures

## Table Relationships

```
auth.users (Supabase Auth)
    ↓
users_profiles (1:1)
    ↓
    ├── bookings (1:N) ──→ dining_venues, accommodations, flights, events, transport_options
    ├── reviews (1:N) ──→ bookings (1:1)
    ├── saved_items (1:N)
    ├── safety_reports (1:N)
    └── created listings (1:N) ──→ dining_venues, accommodations, events, safety_information
```

## Core Tables

### users_profiles
Extends Supabase Auth with additional user information.

**Key Fields:**
- Profile information (name, avatar, bio, phone)
- User preferences (JSONB)
- Timestamps

**Relationships:**
- 1:1 with auth.users
- 1:N with bookings, reviews, saved_items, safety_reports

### Listing Tables

#### dining_venues
Restaurants and dining establishments.

**Key Fields:**
- Basic info (name, description, address, location)
- Cuisine types (array)
- Price range (1-4)
- Capacity and hours
- Images and amenities (arrays)
- Average rating and review count

**Indexes:**
- city, country, cuisine_type, price_range, average_rating, deleted_at

#### accommodations
Hotels, apartments, and lodging options.

**Key Fields:**
- Property details (type, bedrooms, bathrooms, max_guests)
- Pricing (price_per_night, currency)
- Amenities (array)
- Check-in/out times
- House rules

**Indexes:**
- city, country, property_type, price_per_night, max_guests, average_rating, amenities, deleted_at

#### flights
Available flight options.

**Key Fields:**
- Flight details (airline, flight_number, aircraft_type)
- Route (origin_airport, destination_airport)
- Schedule (departure_time, arrival_time, duration)
- Pricing and availability
- Layovers and baggage (JSONB)

**Indexes:**
- origin_airport, destination_airport, departure_time, airline, price, class_type
- Composite: (origin, destination, departure_time)

#### events
Events and activities.

**Key Fields:**
- Event details (title, description, category)
- Schedule (start_date, end_date)
- Location and address
- Capacity management (capacity, available_spots)
- Ticket types (JSONB array)
- Organizer reference

**Indexes:**
- city, country, category, start_date, end_date, available_spots, organizer_id, deleted_at
- Composite: (start_date, end_date)

#### transport_options
Transportation services (bus, train, car, etc.).

**Key Fields:**
- Provider and transport type
- Route (origin, destination, route_name)
- Schedule (departure_time, arrival_time, duration)
- Pricing and availability
- Vehicle information (JSONB)

**Indexes:**
- origin, destination, transport_type, provider, departure_time, price, available_seats
- Composite: (origin, destination)

## Transaction Tables

### bookings
Unified table for all booking types.

**Key Fields:**
- User reference
- Booking type (dining, accommodation, flight, event, transport)
- Reference to specific listing
- Status (pending, confirmed, cancelled, completed)
- Date range (start_date, end_date)
- Pricing (total_price, currency)
- Payment information
- Special requests and metadata (JSONB)

**Indexes:**
- user_id, booking_type, reference_id, status, start_date, end_date, payment_status
- Composite: (user_id, status), (user_id, booking_type), (booking_type, reference_id)

**Constraints:**
- Foreign key to users_profiles with CASCADE delete
- Check constraint: end_date >= start_date
- Status enum validation
- Payment status enum validation

### reviews
User reviews for listings.

**Key Fields:**
- User and booking references
- Listing type and ID
- Rating (1-5)
- Title and comment
- Images (array)
- Helpful count

**Indexes:**
- user_id, booking_id, listing_type, listing_id, rating, created_at
- Composite: (listing_type, listing_id)

**Constraints:**
- Unique constraint: one review per booking
- Foreign keys with CASCADE delete
- Rating check: 1-5

**Triggers:**
- Automatically updates listing average_rating and total_reviews on insert/update/delete

### saved_items
User's favorited listings.

**Key Fields:**
- User reference
- Item type and ID
- Optional notes

**Indexes:**
- user_id, item_type, item_id, created_at
- Composite: (user_id, item_type)

**Constraints:**
- Unique constraint: (user_id, item_type, item_id)
- Foreign key to users_profiles with CASCADE delete

## Safety Tables

### safety_information
Location-specific safety guidelines and emergency contacts.

**Key Fields:**
- Location (country, city)
- Category and title
- Description
- Emergency contacts (JSONB array)
- Safety level (low, moderate, high, critical)
- Last updated timestamp

**Indexes:**
- country, city, category, safety_level, last_updated
- Composite: (country, city)

### safety_reports
User-submitted safety concerns.

**Key Fields:**
- User reference
- Location (text and coordinates)
- Category and description
- Severity level
- Status (pending, reviewing, resolved, dismissed)
- Resolution timestamp

**Indexes:**
- user_id, location, category, severity, status, created_at
- Spatial: (latitude, longitude)

## Database Functions

### update_updated_at_column()
Trigger function that automatically updates the `updated_at` timestamp on row modifications.

**Applied to:**
- All tables with `updated_at` field

### update_listing_rating()
Trigger function that recalculates average rating and total review count for listings.

**Applied to:**
- reviews table (INSERT, UPDATE, DELETE)

**Updates:**
- dining_venues.average_rating and total_reviews
- accommodations.average_rating and total_reviews
- events.average_rating and total_reviews

## Data Types

### JSONB Fields
Used for flexible, structured data:
- `users_profiles.preferences` - User settings and preferences
- `dining_venues.hours` - Operating hours by day
- `flights.layovers` - Array of layover information
- `flights.baggage_allowance` - Baggage rules
- `events.ticket_types` - Array of ticket options
- `transport_options.schedule` - Schedule information
- `transport_options.vehicle_info` - Vehicle details
- `bookings.metadata` - Additional booking data
- `safety_information.emergency_contacts` - Array of contact info

### Array Fields
Used for multi-value attributes:
- `TEXT[]` - images, amenities, cuisine_type
- `JSONB[]` - layovers, ticket_types, emergency_contacts

### Numeric Precision
- `DECIMAL(10, 2)` - Monetary values (prices)
- `DECIMAL(3, 2)` - Ratings (0.00 to 5.00)
- `DECIMAL(10, 8)` - Latitude
- `DECIMAL(11, 8)` - Longitude

## Performance Optimizations

### Indexes Strategy
1. **Single Column**: Frequently filtered fields (city, country, dates)
2. **Composite**: Common query patterns (route searches, user bookings)
3. **GIN**: Array and JSONB fields (amenities, cuisine_type)
4. **Spatial**: Geographic queries (latitude, longitude)

### Query Optimization
- Foreign key indexes for efficient joins
- Partial indexes on deleted_at for soft-deleted records
- Covering indexes for common SELECT patterns

## Security Model

### Row Level Security (RLS)
All tables have RLS enabled. Policies to be configured in Task 3:

**User Data:**
- Users can read/update their own profiles
- Users can manage their own bookings, reviews, saved items

**Public Data:**
- All users can read listings (dining, accommodations, flights, events, transport)
- Only authenticated users can create bookings and reviews

**Admin Data:**
- Admins can create/update/delete listings
- Admins can view all safety reports
- Admin queries include soft-deleted items

## Migration Order

Migrations must be applied in sequence due to foreign key dependencies:

1. users_profiles (depends on auth.users)
2. Listing tables (independent)
3. bookings (depends on users_profiles)
4. reviews (depends on users_profiles and bookings)
5. saved_items (depends on users_profiles)
6. safety tables (depends on users_profiles)

## Next Steps

1. Apply migrations to Supabase project
2. Configure RLS policies (Task 3)
3. Generate TypeScript types (Task 4)
4. Seed test data
5. Verify schema with verify_schema.sql
