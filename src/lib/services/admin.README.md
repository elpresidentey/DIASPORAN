# Admin Service

The Admin Service provides administrative operations for managing listings and media uploads in the DettyConnect platform.

## Features

- **Admin Authorization**: Verify admin privileges before performing operations
- **Listing Management**: Create, update, and soft-delete listings
- **Media Upload**: Upload and delete media files to Supabase Storage
- **Admin Queries**: Query listings including soft-deleted items
- **Booking Cancellation**: Automatically cancel future bookings when listings are deleted

## Admin Privileges

Admin status is determined by checking the `is_admin` flag in the user's profile preferences:

```typescript
// In users_profiles table
{
  preferences: {
    is_admin: true
  }
}
```

## Service Functions

### `isAdmin(userId: string): Promise<boolean>`

Check if a user has admin privileges.

```typescript
const adminStatus = await isAdmin(userId)
if (adminStatus) {
  // User is an admin
}
```

### `createListing(userId: string, input: CreateListingInput)`

Create a new listing with admin attribution.

```typescript
const result = await createListing(userId, {
  type: 'dining_venues',
  data: {
    name: 'Amazing Restaurant',
    description: 'Great food and atmosphere',
    city: 'Lagos',
    country: 'Nigeria',
    // ... other fields
  }
})
```

**Requirements Validated**: 12.1

### `updateListing(userId: string, input: UpdateListingInput)`

Update an existing listing.

```typescript
const result = await updateListing(userId, {
  type: 'accommodations',
  id: 'listing-uuid',
  data: {
    price_per_night: 150.00,
    amenities: ['wifi', 'pool', 'gym']
  }
})
```

**Requirements Validated**: 12.2

### `softDeleteListing(userId: string, input: DeleteListingInput)`

Soft delete a listing and cancel future bookings.

```typescript
const result = await softDeleteListing(userId, {
  type: 'events',
  id: 'event-uuid'
})
```

**Requirements Validated**: 12.3

### `restoreListing(userId: string, input: DeleteListingInput)`

Restore a soft-deleted listing.

```typescript
const result = await restoreListing(userId, {
  type: 'dining_venues',
  id: 'venue-uuid'
})
```

### `getAdminListings(userId: string, type: ListingType, filters: AdminListingFilters)`

Get listings with admin privileges (includes soft-deleted items).

```typescript
const result = await getAdminListings(userId, 'accommodations', {
  includeDeleted: true,
  page: 1,
  limit: 20,
  city: 'Lagos'
})
```

**Requirements Validated**: 12.5

### `getAdminListing(userId: string, type: ListingType, id: string)`

Get a specific listing including soft-deleted items.

```typescript
const result = await getAdminListing(userId, 'dining_venues', 'venue-uuid')
```

### `uploadMedia(userId: string, file: File, folder: string)`

Upload media file to Supabase Storage.

```typescript
const result = await uploadMedia(userId, file, 'dining')
// Returns: { url: 'https://...', path: 'dining/...' }
```

**Requirements Validated**: 12.4

### `deleteMedia(userId: string, path: string)`

Delete media file from Supabase Storage.

```typescript
const result = await deleteMedia(userId, 'dining/12345-abc.jpg')
```

## API Routes

### POST /api/admin/listings

Create a new listing.

**Request Body**:
```json
{
  "type": "dining_venues",
  "data": {
    "name": "Restaurant Name",
    "description": "Description",
    "city": "Lagos",
    "country": "Nigeria",
    "cuisine_type": ["Nigerian", "Continental"],
    "price_range": 3,
    "capacity": 50
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Restaurant Name",
    "created_by": "admin-user-id",
    ...
  }
}
```

### GET /api/admin/listings

Get all listings with admin privileges.

**Query Parameters**:
- `type` (required): Listing type (dining_venues, accommodations, events, transport_options)
- `includeDeleted` (optional): Include soft-deleted items (true/false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `city` (optional): Filter by city
- `country` (optional): Filter by country

**Response**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### GET /api/admin/listings/[id]

Get a specific listing.

**Query Parameters**:
- `type` (required): Listing type

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Listing Name",
    "deleted_at": null,
    ...
  }
}
```

### PATCH /api/admin/listings/[id]

Update a listing or restore a soft-deleted listing.

**Request Body (Update)**:
```json
{
  "type": "dining_venues",
  "data": {
    "name": "Updated Name",
    "capacity": 60
  }
}
```

**Request Body (Restore)**:
```json
{
  "type": "dining_venues",
  "restore": true
}
```

### DELETE /api/admin/listings/[id]

Soft delete a listing.

**Query Parameters**:
- `type` (required): Listing type

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "deleted_at": "2024-01-15T10:30:00Z",
    ...
  },
  "message": "Listing soft deleted and future bookings cancelled"
}
```

### POST /api/admin/media

Upload media file.

**Request**: multipart/form-data
- `file`: Image file (JPEG, PNG, WebP)
- `folder`: Folder name (optional, default: 'general')

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://...public-url...",
    "path": "dining/12345-abc.jpg"
  }
}
```

### DELETE /api/admin/media

Delete media file.

**Query Parameters**:
- `path` (required): File path in storage

**Response**:
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Listing Types

Supported listing types:
- `dining_venues` - Restaurants and dining establishments
- `accommodations` - Hotels, apartments, lodging
- `events` - Events and activities
- `transport_options` - Transportation services

## Soft Delete Behavior

When a listing is soft-deleted:
1. The `deleted_at` timestamp is set
2. All future bookings (pending or confirmed) are automatically cancelled
3. The listing is hidden from public queries
4. Admin queries can still access the listing with `includeDeleted: true`
5. The listing can be restored by setting `deleted_at` to null

## Media Upload

Media files are uploaded to the `listing-images` bucket in Supabase Storage.

**File Constraints**:
- Allowed types: JPEG, JPG, PNG, WebP
- Maximum size: 10MB
- Files are organized by folder (e.g., dining/, accommodations/)

**File Naming**:
Files are automatically named with timestamp and random string:
```
{folder}/{timestamp}-{random}.{extension}
```

## Error Handling

All functions return a consistent error format:

```typescript
{
  data: null,
  error: {
    code: 'ERROR_CODE',
    message: 'Human-readable message',
    details?: any
  }
}
```

Common error codes:
- `FORBIDDEN` - User is not an admin
- `VALIDATION_ERROR` - Invalid input data
- `DATABASE_ERROR` - Database operation failed
- `UPLOAD_ERROR` - File upload failed
- `NOT_FOUND` - Resource not found

## Security

- All operations require admin authentication
- Admin status is verified on every request
- RLS policies enforce data access control
- File uploads are validated for type and size
- Storage policies restrict access to admin users

## Usage Example

```typescript
import {
  createListing,
  uploadMedia,
  softDeleteListing
} from '@/lib/services/admin.service'

// Create a new restaurant
const listing = await createListing(adminUserId, {
  type: 'dining_venues',
  data: {
    name: 'New Restaurant',
    description: 'Great food',
    city: 'Lagos',
    country: 'Nigeria',
    cuisine_type: ['Nigerian'],
    price_range: 2,
    capacity: 40,
    images: []
  }
})

// Upload an image
const media = await uploadMedia(adminUserId, imageFile, 'dining')

// Update listing with image URL
await updateListing(adminUserId, {
  type: 'dining_venues',
  id: listing.data.id,
  data: {
    images: [media.data.url]
  }
})

// Later, soft delete the listing
await softDeleteListing(adminUserId, {
  type: 'dining_venues',
  id: listing.data.id
})
```

## Related Files

- Service: `src/lib/services/admin.service.ts`
- Middleware: `src/lib/middleware/auth.middleware.ts`
- API Routes: `src/app/api/admin/listings/`
- Storage Setup: `supabase/STORAGE_SETUP.md`

## Requirements Coverage

This service implements the following requirements:
- **12.1**: Admin listing creation with attribution
- **12.2**: Admin listing updates with logging
- **12.3**: Soft delete with booking cancellation
- **12.4**: Media upload to Supabase Storage
- **12.5**: Admin queries including deleted items
