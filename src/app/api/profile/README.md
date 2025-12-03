# Profile API Documentation

This directory contains API routes for user profile management.

## Endpoints

### GET /api/profile
Get the current authenticated user's profile with statistics.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "phone": "+1234567890",
    "bio": "Travel enthusiast",
    "preferences": {},
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "total_bookings": 5,
    "total_reviews": 3,
    "total_saved_items": 10
  }
}
```

**Error Responses**:
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - Profile not found
- `500 Internal Server Error` - Server error

---

### PATCH /api/profile
Update the current user's profile information.

**Authentication**: Required

**Request Body**:
```json
{
  "full_name": "Jane Doe",
  "phone": "+1234567890",
  "bio": "Updated bio",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

All fields are optional. Only provided fields will be updated.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "avatar_url": "https://...",
    "phone": "+1234567890",
    "bio": "Updated bio",
    "preferences": {
      "theme": "dark",
      "notifications": true
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Invalid data
- `500 Internal Server Error` - Server error

---

### DELETE /api/profile
Delete the current user's account and all associated data.

**Authentication**: Required

**Warning**: This action is irreversible and will delete:
- User profile
- All bookings
- All reviews
- All saved items
- Authentication account

**Response**:
```json
{
  "success": true,
  "data": {
    "message": "Account deleted successfully"
  }
}
```

**Error Responses**:
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Deletion failed
- `500 Internal Server Error` - Server error

---

### POST /api/profile/upload
Upload a profile picture for the current user.

**Authentication**: Required

**Request**: `multipart/form-data`
- `file`: Image file (JPEG, PNG, or WebP)

**Constraints**:
- Maximum file size: 5MB
- Allowed formats: JPEG, JPG, PNG, WebP

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://xxxxx.supabase.co/storage/v1/object/public/avatars/...",
    "message": "Profile picture uploaded successfully"
  }
}
```

**Error Responses**:
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Missing file, invalid file type, or file too large
- `500 Internal Server Error` - Server error

---

## Usage Examples

### Fetch Profile (Client Component)

```typescript
'use client'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const response = await fetch('/api/profile')
      const data = await response.json()
      
      if (data.success) {
        setProfile(data.data)
      }
      setLoading(false)
    }
    
    fetchProfile()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>Profile not found</div>

  return (
    <div>
      <h1>{profile.full_name}</h1>
      <p>{profile.email}</p>
      <p>Bookings: {profile.total_bookings}</p>
    </div>
  )
}
```

### Update Profile

```typescript
async function updateProfile(data: {
  full_name?: string
  phone?: string
  bio?: string
  preferences?: Record<string, any>
}) {
  const response = await fetch('/api/profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('Profile updated:', result.data)
  } else {
    console.error('Update failed:', result.error)
  }
}

// Usage
updateProfile({
  full_name: 'Jane Doe',
  bio: 'Travel enthusiast',
})
```

### Upload Profile Picture

```typescript
async function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/profile/upload', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('Avatar uploaded:', result.data.url)
  } else {
    console.error('Upload failed:', result.error)
  }
}

// Usage with file input
function AvatarUpload() {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadAvatar(file)
    }
  }

  return <input type="file" accept="image/*" onChange={handleFileChange} />
}
```

### Delete Account

```typescript
async function deleteAccount() {
  if (!confirm('Are you sure? This action cannot be undone.')) {
    return
  }

  const response = await fetch('/api/profile', {
    method: 'DELETE',
  })

  const result = await response.json()
  
  if (result.success) {
    // Redirect to home page or login
    window.location.href = '/'
  } else {
    console.error('Deletion failed:', result.error)
  }
}
```

## Service Layer

The API routes use the profile service layer for business logic:

```typescript
import {
  getProfileServer,
  updateProfileServer,
  uploadProfilePictureServer,
  deleteAccount,
} from '@/lib/services/profile.service'
```

See `src/lib/services/profile.service.ts` for detailed service documentation.

## Security

- All endpoints require authentication via Supabase Auth
- Row Level Security (RLS) policies enforce data access control
- File uploads are validated for type and size
- Profile pictures are stored in a public Supabase Storage bucket
- Account deletion cascades to all related data

## Storage Setup

Before using the upload endpoint, ensure the `avatars` storage bucket is created:

See `supabase/STORAGE_SETUP.md` for detailed setup instructions.

## Related Files

- Service Layer: `src/lib/services/profile.service.ts`
- Type Definitions: `src/types/supabase.ts`
- Database Migration: `supabase/migrations/20240101000000_create_users_profiles.sql`
- Profile Trigger: `supabase/migrations/20240101000011_create_profile_trigger.sql`
- RLS Policies: `supabase/migrations/20240101000010_create_rls_policies.sql`
