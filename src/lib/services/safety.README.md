# Safety Service

The Safety Service provides functionality for managing safety information, emergency contacts, and safety reports in the DettyConnect platform.

## Features

### Safety Information
- Retrieve location-specific safety guidelines and emergency contacts
- Filter by country, city, category, or safety level
- Admin capabilities to create, update, and delete safety information

### Emergency Contacts
- Save personal emergency contacts to user profile
- Retrieve saved emergency contacts
- Stored in user preferences JSONB field

### Safety Reports
- Users can submit safety concerns and incidents
- Reports include location, category, description, and severity
- Admin capabilities to view and manage all reports

## API Endpoints

### Public Endpoints

#### GET /api/safety
Get safety information with optional filters.

**Query Parameters:**
- `country` (optional): Filter by country
- `city` (optional): Filter by city
- `category` (optional): Filter by category
- `safetyLevel` (optional): Filter by safety level (low, moderate, high, critical)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "country": "Nigeria",
      "city": "Lagos",
      "category": "Health",
      "title": "Medical Facilities",
      "description": "List of recommended hospitals...",
      "emergency_contacts": [
        {
          "name": "Emergency Services",
          "phone": "112"
        }
      ],
      "safety_level": "moderate",
      "last_updated": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Authenticated Endpoints

#### POST /api/profile/emergency-contacts
Save emergency contacts to user profile.

**Request Body:**
```json
{
  "contacts": [
    {
      "name": "John Doe",
      "phone": "+1234567890",
      "relationship": "Family"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emergency contacts saved successfully"
}
```

#### GET /api/profile/emergency-contacts
Get user's emergency contacts.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "John Doe",
      "phone": "+1234567890",
      "relationship": "Family"
    }
  ]
}
```

#### POST /api/safety/reports
Create a safety report.

**Request Body:**
```json
{
  "location": "Lagos, Nigeria",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "category": "Theft",
  "description": "Pickpocketing incident at market",
  "severity": "moderate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "location": "Lagos, Nigeria",
    "category": "Theft",
    "description": "Pickpocketing incident at market",
    "severity": "moderate",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/safety/reports
Get user's safety reports.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "location": "Lagos, Nigeria",
      "category": "Theft",
      "severity": "moderate",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Admin Endpoints

#### POST /api/admin/safety
Create safety information (Admin only).

**Request Body:**
```json
{
  "country": "Nigeria",
  "city": "Lagos",
  "category": "Health",
  "title": "Medical Facilities",
  "description": "List of recommended hospitals and clinics",
  "emergency_contacts": [
    {
      "name": "Emergency Services",
      "phone": "112"
    }
  ],
  "safety_level": "moderate"
}
```

#### PATCH /api/admin/safety
Update safety information (Admin only).

**Request Body:**
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated description",
  "safety_level": "high"
}
```

#### DELETE /api/admin/safety?id=uuid
Delete safety information (Admin only).

## Service Functions

### Client-side Functions

```typescript
import {
  getSafetyInformation,
  saveEmergencyContacts,
  getEmergencyContacts,
  createSafetyReport,
  getUserSafetyReports,
} from '@/lib/services/safety.service'

// Get safety information
const { data, error } = await getSafetyInformation({
  country: 'Nigeria',
  city: 'Lagos',
})

// Save emergency contacts
const { success, error } = await saveEmergencyContacts(userId, [
  { name: 'John Doe', phone: '+1234567890', relationship: 'Family' }
])

// Create safety report
const { report, error } = await createSafetyReport(userId, {
  location: 'Lagos, Nigeria',
  category: 'Theft',
  description: 'Incident description',
  severity: 'moderate',
})
```

### Server-side Functions

```typescript
import {
  getSafetyInformationServer,
  saveEmergencyContactsServer,
  createSafetyReportServer,
  createSafetyInformationServer,
  updateSafetyInformationServer,
} from '@/lib/services/safety.service'

// Use in API routes with createServerClient()
```

## Data Models

### SafetyInformation
```typescript
{
  id: string
  country: string
  city: string | null
  category: string
  title: string
  description: string
  emergency_contacts: Array<{
    name: string
    phone: string
  }>
  safety_level: 'low' | 'moderate' | 'high' | 'critical' | null
  last_updated: string
  created_by: string | null
  created_at: string
  updated_at: string
}
```

### SafetyReport
```typescript
{
  id: string
  user_id: string
  location: string
  latitude: number | null
  longitude: number | null
  category: string
  description: string
  severity: 'low' | 'moderate' | 'high' | 'critical'
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
  created_at: string
  resolved_at: string | null
}
```

### EmergencyContact
```typescript
{
  name: string
  phone: string
  relationship?: string
}
```

## Error Handling

All service functions return errors in a consistent format:

```typescript
{
  code: string
  message: string
  details?: any
}
```

Common error codes:
- `SAFETY_INFO_FETCH_FAILED`: Failed to fetch safety information
- `PROFILE_FETCH_FAILED`: Failed to fetch user profile
- `EMERGENCY_CONTACTS_SAVE_FAILED`: Failed to save emergency contacts
- `SAFETY_REPORT_CREATE_FAILED`: Failed to create safety report
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Admin privileges required

## Requirements Validation

This service implements the following requirements:

- **8.1**: Location-specific safety information retrieval
- **8.2**: Emergency contacts persistence
- **8.3**: Safety alert storage
- **8.4**: Safety report creation
- **8.5**: Immediate safety information updates (admin)

## Real-time Updates

Safety information updates can be subscribed to using Supabase Realtime:

```typescript
const supabase = createClient()

const channel = supabase
  .channel('safety-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'safety_information',
    },
    (payload) => {
      console.log('Safety information updated:', payload)
    }
  )
  .subscribe()
```

## Security

- Safety information is publicly readable
- Emergency contacts are private to each user
- Safety reports can only be created by authenticated users
- Users can only view their own reports
- Admin operations require admin role in user preferences
- Row Level Security (RLS) policies enforce access control at database level
