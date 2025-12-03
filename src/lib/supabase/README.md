# Supabase Integration

This directory contains the Supabase client configuration and utilities for the DettyConnect application.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - Project name: `dettyconnect` (or your preferred name)
   - Database password: Choose a strong password
   - Region: Select the region closest to your users
4. Wait for the project to be created (this may take a few minutes)

### 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 3. Configure Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### 4. Install Supabase CLI (Optional but Recommended)

The Supabase CLI is useful for managing migrations and generating types:

```bash
npm install -g supabase
```

Then login and link your project:

```bash
supabase login
supabase link --project-ref your-project-ref
```

## Client Usage

### Client Components

Use the client-side Supabase client in components with the `'use client'` directive:

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function MyComponent() {
  const [data, setData] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('dining_venues')
        .select('*')
      
      if (data) setData(data)
    }
    
    fetchData()
  }, [])

  return <div>{/* render data */}</div>
}
```

### Server Components

Use the server-side Supabase client in Server Components:

```tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function MyServerComponent() {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('dining_venues')
    .select('*')

  return <div>{/* render data */}</div>
}
```

### API Routes

Use the server client in API routes:

```ts
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('dining_venues')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
```

### Middleware

Use the middleware client for authentication checks:

```ts
import { createMiddlewareClient } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient(req, res)
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return res
}
```

## Authentication

### Sign Up

```ts
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
})
```

### Sign In

```ts
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Sign Out

```ts
const { error } = await supabase.auth.signOut()
```

### Get Current User

```ts
const { data: { user } } = await supabase.auth.getUser()
```

## Real-time Subscriptions

Subscribe to database changes:

```ts
const channel = supabase
  .channel('dining-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'dining_venues'
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

// Don't forget to unsubscribe when done
channel.unsubscribe()
```

## Type Generation

After creating your database schema, generate TypeScript types:

```bash
supabase gen types typescript --linked > src/types/supabase.ts
```

This will update the `Database` type with your actual schema.

## Utilities

The `utils.ts` file provides helper functions:

- `handleSupabaseError()`: Converts Supabase errors to standardized format
- `createSuccessResponse()`: Creates standardized success responses
- `createErrorResponse()`: Creates standardized error responses
- `validateSupabaseEnv()`: Validates required environment variables
- `getSupabaseUrl()`: Gets Supabase URL from env
- `getSupabaseAnonKey()`: Gets Supabase anon key from env

## Security Best Practices

1. **Never expose service role key**: Only use it server-side
2. **Use Row Level Security (RLS)**: Enable RLS on all tables
3. **Validate input**: Always validate user input before database operations
4. **Use parameterized queries**: Supabase client handles this automatically
5. **Implement proper authentication**: Check user sessions before sensitive operations

## Next Steps

1. Create database schema (see task 2 in implementation plan)
2. Set up Row Level Security policies (see task 3)
3. Generate TypeScript types (see task 4)
4. Implement authentication system (see task 5)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
