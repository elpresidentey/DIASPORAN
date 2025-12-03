# Authentication System

## Overview

Diasporan now has a fully functional authentication system with signup, login, and logout capabilities.

## Features

✅ **User Registration** - Create new accounts with email and password
✅ **User Login** - Sign in with existing credentials  
✅ **User Logout** - Sign out from any page
✅ **Protected Routes** - Profile page requires authentication
✅ **Persistent Sessions** - Users stay logged in across page refreshes
✅ **Form Validation** - Email format, password length, required fields
✅ **Error Handling** - Clear error messages for failed auth attempts
✅ **Loading States** - Visual feedback during auth operations
✅ **Toast Notifications** - Success/error messages for auth actions
✅ **Responsive UI** - Auth buttons in both desktop and mobile nav

## How It Works

### Storage
- User data is stored in `localStorage` (client-side only)
- Passwords are stored separately (in production, use backend with hashing)
- Current user session persists across page reloads

### Components

**Auth Context** (`src/contexts/AuthContext.tsx`)
- Provides global auth state
- Manages current user
- Handles logout

**Auth Utilities** (`src/lib/auth.ts`)
- `signUp()` - Register new users
- `login()` - Authenticate existing users
- `logout()` - Clear current session
- `getCurrentUser()` - Get logged-in user
- `isAuthenticated()` - Check auth status

**Protected Pages**
- Profile page redirects to login if not authenticated
- Can easily protect other routes using the same pattern

### Usage

**Check if user is logged in:**
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome {user.firstName}!</div>;
}
```

**Logout:**
```tsx
import { useAuth } from '@/contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();
  
  return <button onClick={logout}>Logout</button>;
}
```

## Testing

1. **Sign Up**: Go to `/signup` and create an account
2. **Login**: Go to `/login` and sign in with your credentials
3. **Profile**: Visit `/profile` to see your user info
4. **Logout**: Click logout in the navbar or profile page

## Upgrading to Production

To use a real backend API:

1. Replace `localStorage` calls in `src/lib/auth.ts` with API calls
2. Add JWT token management
3. Implement secure password hashing on the backend
4. Add refresh token logic
5. Implement proper session management

Example API integration:
```typescript
export async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    return { success: true, user: data.user };
  }
  
  return { success: false, error: data.error };
}
```

## Security Notes

⚠️ **Current Implementation**
- Client-side only (demo purposes)
- Passwords stored in plain text in localStorage
- No encryption or hashing
- No server-side validation

✅ **Production Requirements**
- Backend API with secure authentication
- Password hashing (bcrypt, argon2)
- JWT tokens with expiration
- HTTPS only
- CSRF protection
- Rate limiting
- Input sanitization
