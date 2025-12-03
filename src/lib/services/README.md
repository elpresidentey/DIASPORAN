# Authentication Service

This directory contains the authentication service implementation using Supabase Auth.

## Overview

The authentication system provides secure user authentication with the following features:

- **Email/Password Authentication**: Sign up and sign in with email and password
- **Session Management**: Automatic token refresh and session persistence
- **Password Reset**: Secure password reset flow via email
- **Auth State Management**: Real-time auth state synchronization across the app
- **Protected Routes**: Middleware for protecting API routes and pages

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Client)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Login Page   │  │ Signup Page  │  │  AuthContext │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                            ▼                                 │
│                  ┌──────────────────┐                        │
│                  │  Auth Service    │                        │
│                  └────────┬─────────┘                        │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Auth                             │
│  - JWT Token Management                                      │
│  - Session Persistence                                       │
│  - Email Verification                                        │
│  - Password Reset                                            │
└─────────────────────────────────────────────────────────────┘
```

## Files

### `auth.service.ts`

Core authentication service with the following functions:

- `signUp(data)` - Create a new user account
- `signIn(data)` - Authenticate an existing user
- `signOut()` - Sign out the current user
- `getSession()` - Get the current session
- `getCurrentUser()` - Get the current user
- `resetPassword(email)` - Request a password reset email
- `updatePassword(newPassword)` - Update user password
- `refreshSession()` - Manually refresh the session
- `onAuthStateChange(callback)` - Listen to auth state changes

## Usage

### Sign Up

```typescript
import { signUp } from '@/lib/services/auth.service'

const result = await signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  firstName: 'John',
  lastName: 'Doe',
})

if (result.user && !result.error) {
  console.log('User created:', result.user)
} else {
  console.error('Error:', result.error?.message)
}
```

### Sign In

```typescript
import { signIn } from '@/lib/services/auth.service'

const result = await signIn({
  email: 'user@example.com',
  password: 'securePassword123',
})

if (result.user && !result.error) {
  console.log('User authenticated:', result.user)
} else {
  console.error('Error:', result.error?.message)
}
```

### Sign Out

```typescript
import { signOut } from '@/lib/services/auth.service'

const { error } = await signOut()

if (!error) {
  console.log('User signed out')
}
```

### Get Current User

```typescript
import { getCurrentUser } from '@/lib/services/auth.service'

const { user, error } = await getCurrentUser()

if (user) {
  console.log('Current user:', user)
}
```

### Password Reset

```typescript
import { resetPassword } from '@/lib/services/auth.service'

const { error } = await resetPassword('user@example.com')

if (!error) {
  console.log('Password reset email sent')
}
```

### Using Auth Context

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function MyComponent() {
  const { user, session, loading, signOut } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please sign in</div>
  }

  return (
    <div>
      <p>Welcome, {user.user_metadata?.first_name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## API Route Protection

### Require Authentication

```typescript
import { requireAuth } from '@/lib/middleware/auth.middleware'
import { NextResponse } from 'next/server'

export async function GET() {
  const authResult = await requireAuth()

  if (authResult.error) {
    return authResult.error
  }

  // User is authenticated
  const user = authResult.user

  return NextResponse.json({
    success: true,
    data: { user },
  })
}
```

### Require Admin

```typescript
import { requireAdmin } from '@/lib/middleware/auth.middleware'
import { NextResponse } from 'next/server'

export async function POST() {
  const authResult = await requireAdmin()

  if (authResult.error) {
    return authResult.error
  }

  // User is authenticated and is an admin
  const user = authResult.user

  return NextResponse.json({
    success: true,
    data: { message: 'Admin action completed' },
  })
}
```

### Optional Authentication

```typescript
import { optionalAuth } from '@/lib/middleware/auth.middleware'
import { NextResponse } from 'next/server'

export async function GET() {
  const { user } = await optionalAuth()

  // User may or may not be authenticated
  const data = user ? getPersonalizedData(user) : getPublicData()

  return NextResponse.json({
    success: true,
    data,
  })
}
```

## Session Management

Supabase automatically handles:

- **Token Refresh**: Access tokens are automatically refreshed before expiration
- **Session Persistence**: Sessions are stored in cookies and persist across page reloads
- **Multi-tab Sync**: Auth state is synchronized across browser tabs
- **Secure Storage**: Tokens are stored securely in HTTP-only cookies

## Security Features

- **JWT Tokens**: Secure JSON Web Tokens for authentication
- **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies to prevent XSS attacks
- **Row Level Security**: Database-level security policies enforce access control
- **Password Hashing**: Passwords are securely hashed using bcrypt
- **Email Verification**: Optional email verification for new accounts
- **Rate Limiting**: Built-in rate limiting to prevent brute force attacks

## Error Handling

All auth functions return a consistent error structure:

```typescript
interface AuthResponse {
  user: User | null
  session: Session | null
  error: AuthError | null
}
```

Common error codes:

- `invalid_credentials` - Invalid email or password
- `email_exists` - Email already registered
- `weak_password` - Password doesn't meet requirements
- `invalid_token` - Invalid or expired token
- `user_not_found` - User doesn't exist

## Environment Variables

Required environment variables (in `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing

The authentication system can be tested using:

1. **Unit Tests**: Test individual auth functions with mocked Supabase client
2. **Integration Tests**: Test complete auth flows with test Supabase project
3. **Property-Based Tests**: Verify auth properties hold across various inputs

Example test:

```typescript
import { signUp, signIn } from '@/lib/services/auth.service'

test('user can sign up and sign in', async () => {
  const userData = {
    email: 'test@example.com',
    password: 'testPassword123',
    firstName: 'Test',
    lastName: 'User',
  }

  // Sign up
  const signUpResult = await signUp(userData)
  expect(signUpResult.user).toBeTruthy()
  expect(signUpResult.error).toBeNull()

  // Sign in
  const signInResult = await signIn({
    email: userData.email,
    password: userData.password,
  })
  expect(signInResult.user).toBeTruthy()
  expect(signInResult.error).toBeNull()
})
```

## Best Practices

1. **Always check for errors**: Check the `error` property before using `user` or `session`
2. **Use AuthContext**: Use the `useAuth` hook in client components for reactive auth state
3. **Protect sensitive routes**: Use auth middleware for API routes that require authentication
4. **Handle loading states**: Show loading indicators while auth state is being determined
5. **Redirect after auth**: Redirect users to appropriate pages after sign in/out
6. **Clear sensitive data**: Clear any sensitive data when user signs out
7. **Validate on server**: Always validate auth on the server, never trust client-side checks

## Troubleshooting

### Session not persisting

- Ensure cookies are enabled in the browser
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
- Verify that the Supabase project is configured correctly

### Token refresh failing

- Check that the refresh token is valid
- Ensure the Supabase project is not paused
- Verify network connectivity

### Auth state not updating

- Ensure `AuthProvider` wraps your app in `layout.tsx`
- Check that you're using the `useAuth` hook correctly
- Verify that auth state change listeners are set up

## Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
