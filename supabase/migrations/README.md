# Database Migrations

This directory contains SQL migration files for the Diasporan database schema.

## Migration Files

The migrations are numbered sequentially and should be applied in order:

1. **20240101000000_create_users_profiles.sql** - User profile table extending auth.users
2. **20240101000001_create_dining_venues.sql** - Dining venues and restaurants
3. **20240101000002_create_accommodations.sql** - Hotels and lodging options
4. **20240101000003_create_flights.sql** - Flight information
5. **20240101000004_create_events.sql** - Events and activities
6. **20240101000005_create_transport_options.sql** - Transportation services
7. **20240101000006_create_bookings.sql** - Unified bookings table with foreign keys
8. **20240101000007_create_reviews.sql** - User reviews with automatic rating updates
9. **20240101000008_create_saved_items.sql** - User saved/favorited items
10. **20240101000009_create_safety_tables.sql** - Safety information and reports
11. **20240101000010_create_rls_policies.sql** - Row Level Security policies for all tables
12. **20240101000011_create_profile_trigger.sql** - Automatic profile creation on user signup

## Features

### Automatic Timestamps
All tables include `created_at` and `updated_at` timestamps. The `updated_at` field is automatically updated via triggers.

### Row Level Security (RLS)
All tables have RLS enabled. Policies need to be configured separately (see task 3 in the implementation plan).

### Indexes
Indexes are created on:
- Foreign keys for join performance
- Frequently filtered columns (city, country, dates)
- Search fields (origin, destination, category)
- Composite indexes for common query patterns

### Constraints
- Check constraints for valid ranges (ratings 1-5, price_range 1-4)
- Foreign key constraints with appropriate CASCADE rules
- Unique constraints where needed (review per booking, saved items)
- Date validation (end_date >= start_date)

### Triggers
- **update_updated_at_column()**: Automatically updates `updated_at` on row changes
- **update_listing_rating()**: Automatically recalculates average ratings when reviews are added/updated/deleted
- **handle_new_user()**: Automatically creates a profile record when a new user signs up

## Applying Migrations

### Using Supabase CLI

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push

# Or apply migrations remotely
supabase db push --db-url your-database-url
```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order
4. Execute each migration

### Local Development

```bash
# Start local Supabase
supabase start

# Migrations are automatically applied to local database
```

## Verification

After applying migrations, verify the schema:

```bash
# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts

# Or for remote database
supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

## Notes

- All tables use UUID primary keys with `gen_random_uuid()`
- Soft deletes are implemented via `deleted_at` timestamp on applicable tables
- JSONB fields are used for flexible data structures (preferences, metadata, schedules)
- Array fields are used for multi-value attributes (images, amenities, cuisine_types)
- Decimal types are used for precise monetary and rating values
- Geographic coordinates use appropriate precision (latitude: 10,8; longitude: 11,8)

## Next Steps

After applying these migrations:
1. Configure Row Level Security policies (Task 3)
2. Generate TypeScript types (Task 4)
3. Test the schema with sample data
