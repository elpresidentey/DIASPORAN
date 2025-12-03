# Supabase Setup Guide for Diasporan

This guide will walk you through setting up Supabase for the Diasporan backend.

## Prerequisites

- Node.js 18+ installed
- Yarn package manager
- A Supabase account (free tier is sufficient for development)

## Step 1: Create Supabase Project

1. Visit [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create a new account
3. Click **"New Project"**
4. Fill in the project details:
   - **Organization**: Select or create an organization
   - **Name**: `diasporan` (or your preferred name)
   - **Database Password**: Generate a strong password (save this securely!)
   - **Region**: Choose the region closest to your target users
   - **Pricing Plan**: Select "Free" for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be provisioned

## Step 2: Get API Credentials

1. Once your project is ready, navigate to **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see the following credentials:

   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **API Keys**:
     - `anon` `public` - Safe to use in the browser
     - `service_role` - Keep this secret! Only use server-side

## Step 3: Configure Environment Variables

1. In the root of your project, create a file named `.env.local`
2. Copy the template from `.env.local.example`:

```bash
cp .env.local.example .env.local
```

3. Edit `.env.local` and add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

4. **Important**: Never commit `.env.local` to version control!

## Step 4: Verify Installation

The Supabase dependencies have already been installed:
- `@supabase/supabase-js` - Core Supabase client
- `@supabase/auth-helpers-nextjs` - Next.js authentication helpers

To verify, check your `package.json` or run:

```bash
yarn list --pattern "@supabase/*"
```

## Step 5: Test the Connection

Create a simple test to verify your Supabase connection works:

```typescript
// test-supabase.ts
import { createClient } from '@/lib/supabase/client'

async function testConnection() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Connection failed:', error)
  } else {
    console.log('Connection successful!')
  }
}

testConnection()
```

## What's Been Set Up

The following files have been created for you:

### Client Utilities
- `src/lib/supabase/client.ts` - Client-side Supabase client
- `src/lib/supabase/server.ts` - Server-side Supabase client
- `src/lib/supabase/middleware.ts` - Middleware Supabase client
- `src/lib/supabase/utils.ts` - Helper functions and error handling
- `src/lib/supabase/index.ts` - Central export point

### Type Definitions
- `src/types/supabase.ts` - Database type definitions (placeholder)

### Documentation
- `src/lib/supabase/README.md` - Detailed usage documentation
- `.env.local.example` - Environment variable template

## Step 6: Apply Database Migrations

The database schema and RLS policies have been created as migration files. To apply them:

### Option 1: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the sidebar
3. Click **"New query"**
4. Copy and paste the contents of each migration file in order:
   - `supabase/migrations/20240101000000_create_users_profiles.sql`
   - `supabase/migrations/20240101000001_create_dining_venues.sql`
   - `supabase/migrations/20240101000002_create_accommodations.sql`
   - `supabase/migrations/20240101000003_create_flights.sql`
   - `supabase/migrations/20240101000004_create_events.sql`
   - `supabase/migrations/20240101000005_create_transport_options.sql`
   - `supabase/migrations/20240101000006_create_bookings.sql`
   - `supabase/migrations/20240101000007_create_reviews.sql`
   - `supabase/migrations/20240101000008_create_saved_items.sql`
   - `supabase/migrations/20240101000009_create_safety_tables.sql`
   - `supabase/migrations/20240101000010_create_rls_policies.sql`
   - `supabase/migrations/20240101000011_create_profile_trigger.sql`
5. Click **"Run"** for each migration
6. Verify that tables appear in the **Table Editor**

### Option 2: Using Supabase CLI (Recommended for production)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link your project:
```bash
supabase link --project-ref your-project-ref
```

3. Push migrations to your database:
```bash
supabase db push
```

4. Verify migrations were applied:
```bash
supabase db diff
```

### Verify RLS Policies

After applying migrations, verify RLS policies are active:

1. Go to **Authentication** > **Policies** in Supabase dashboard
2. You should see policies for each table
3. Test policies by trying to query data with different user roles

For detailed RLS policy documentation, see `supabase/migrations/RLS_POLICIES.md`

## Step 7: Set Up Storage Buckets

After applying database migrations, you need to set up storage buckets for file uploads.

See the detailed guide: `supabase/STORAGE_SETUP.md`

Quick setup:
1. Create `avatars` bucket (public, 5MB limit)
2. Create `listing-images` bucket (public, 10MB limit)
3. Apply storage RLS policies from the guide

## Next Steps

Now that Supabase is configured and migrations are applied, you can proceed with:

1. ✅ **Task 1**: Set up Supabase project and configuration
2. ✅ **Task 2**: Create database schema and migrations
3. ✅ **Task 3**: Configure Row Level Security policies
4. ✅ **Task 4**: Generate TypeScript types from database schema
5. ✅ **Task 5**: Implement authentication system
6. ✅ **Task 6**: Implement profile management

## Usage Examples

### Client Component
```tsx
'use client'
import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createClient()
  // Use supabase client...
}
```

### Server Component
```tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function MyServerComponent() {
  const supabase = createServerClient()
  // Use supabase client...
}
```

### API Route
```ts
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerClient()
  // Use supabase client...
  return NextResponse.json({ data })
}
```

## Troubleshooting

### "Cannot find module '@/types/supabase'"
This is expected until you create the database schema and generate types. The placeholder type file is already in place.

### "NEXT_PUBLIC_SUPABASE_URL is not set"
Make sure you've created `.env.local` and added your credentials. Restart your dev server after adding environment variables.

### Authentication not working
Ensure you're using the correct client for your context:
- Client components: `createClient()`
- Server components: `createServerClient()`
- Middleware: `createMiddlewareClient()`

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router with Supabase](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase JavaScript Client Reference](https://supabase.com/docs/reference/javascript/introduction)

## Security Notes

⚠️ **Important Security Practices:**

1. Never commit `.env.local` to version control
2. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
3. Always use Row Level Security (RLS) policies on your tables
4. Validate all user input before database operations
5. Use the appropriate client for each context (client/server/middleware)

---

**Need Help?** Check the detailed documentation in `src/lib/supabase/README.md`
