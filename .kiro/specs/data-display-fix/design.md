# Design Document

## Overview

This design document outlines the approach to fix the data display issue in DettyConnect where pages show empty despite successful seed data insertion. The root cause is likely related to how the frontend pages fetch data from the API routes, or how the API routes query Supabase. The fix will ensure proper data flow from database to UI, with appropriate error handling and logging.

## Architecture

The data flow follows this architecture:

1. **Database Layer**: Supabase PostgreSQL with RLS policies
2. **Service Layer**: TypeScript service functions that query Supabase
3. **API Layer**: Next.js API routes that use service functions
4. **Client Layer**: React components that fetch from API routes
5. **UI Layer**: Components that render the fetched data

The fix will verify and correct each layer to ensure data flows properly.

## Components and Interfaces

### 1. Database Layer
- **Component**: Supabase PostgreSQL tables (flights, accommodations, events, dining_venues, transport_options)
- **Interface**: SQL queries via Supabase client
- **Responsibility**: Store and retrieve data with RLS enforcement

### 2. Service Layer
- **Component**: Service functions (flight.service.ts, accommodation.service.ts, etc.)
- **Interface**: TypeScript functions that return Promise<{data, error}>
- **Responsibility**: Query Supabase and transform data

### 3. API Layer
- **Component**: Next.js API routes (/api/flights, /api/stays, etc.)
- **Interface**: HTTP GET endpoints returning JSON
- **Responsibility**: Handle HTTP requests and call service functions

### 4. Client Layer
- **Component**: React page components (flights/page.tsx, stays/page.tsx, etc.)
- **Interface**: React hooks (useState, useEffect) and fetch API
- **Responsibility**: Fetch data from API and manage loading/error states

### 5. UI Layer
- **Component**: Card components and empty states
- **Interface**: React props
- **Responsibility**: Render data or appropriate fallback states

## Data Models

### API Response Format
```typescript
{
  success: boolean
  data?: Array<T> | PaginatedResult<T>
  error?: {
    code: string
    message: string
    details?: any
  }
}
```

### PaginatedResult Format
```typescript
{
  data: Array<T>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Data Fetch Triggers on Page Load
*For any* listing page (flights, stays, events, dining, transport), when the page component mounts, a fetch request should be initiated to the corresponding API endpoint
**Validates: Requirements 1.1, 2.1, 3.1, 4.1, 5.1**

### Property 2: Non-Empty Data Renders in Grid
*For any* listing page with non-empty data array, the rendered output should contain grid layout elements with the same number of items as the data array
**Validates: Requirements 1.2, 2.2, 3.2, 4.2, 5.2**

### Property 3: API Error Displays Error UI
*For any* API request that returns an error response, the page should display an ErrorDisplay component with a retry action
**Validates: Requirements 1.4, 2.4, 3.4, 4.4, 5.4**

### Property 4: API Request Logging
*For any* API request made to listing endpoints, the request details (endpoint, params) should be logged to the console
**Validates: Requirements 6.1**

### Property 5: API Error Logging
*For any* API request that fails, the error details (status code, message) should be logged to the console
**Validates: Requirements 6.2**

### Property 6: Success Response Logging
*For any* successful API response, the number of records returned should be logged to the console
**Validates: Requirements 6.3**

## Error Handling

### Database Connection Errors
- **Error**: Cannot connect to Supabase
- **Handling**: Check environment variables, verify Supabase project is active
- **Recovery**: Display error message with retry option, log full error details

### RLS Policy Errors
- **Error**: RLS policies block data access
- **Handling**: Verify policies allow anonymous access with `TO authenticated, anon`
- **Recovery**: Update RLS policies or use service role key for server-side queries

### API Route Errors
- **Error**: API route returns 500 or error response
- **Handling**: Log error details, check service function implementation
- **Recovery**: Display error UI with retry, fix underlying service issue

### Network Errors
- **Error**: Fetch request fails due to network issues
- **Handling**: Catch fetch errors, display network error message
- **Recovery**: Provide retry button, check network connectivity

### Empty Data Handling
- **Error**: No data returned from database
- **Handling**: Check if seed data was inserted correctly
- **Recovery**: Display empty state UI, provide action to refresh or add data

## Testing Strategy

### Unit Testing Approach

Unit tests will focus on:

1. **Service Functions**: Test that service functions correctly query Supabase and handle errors
2. **API Routes**: Test that API routes correctly call service functions and format responses
3. **Component Rendering**: Test that components render correctly with different data states (loading, data, empty, error)
4. **Error Handling**: Test that errors are caught and displayed appropriately

### Property-Based Testing Approach

**Testing Library**: fast-check (for TypeScript/JavaScript)

Property-based tests will verify:

1. **Property 1 (Data Fetch)**: Generate random page components and verify fetch is called on mount
2. **Property 2 (Grid Rendering)**: Generate random data arrays and verify grid contains correct number of items
3. **Property 3 (Error Display)**: Generate random error responses and verify ErrorDisplay is shown
4. **Property 4-6 (Logging)**: Generate random API calls and verify appropriate logging occurs

**Configuration**: Each property-based test should run a minimum of 100 iterations.

**Tagging**: Each property-based test must be tagged with:
- Format: `**Feature: data-display-fix, Property {number}: {property_text}**`

### Integration Testing

Integration tests will verify:
- End-to-end data flow from database to UI
- API routes return correct data format
- Pages display data correctly when API returns data
- Error states work correctly when API fails

## Implementation Notes

### Critical Areas to Investigate

1. **Supabase Client Configuration**
   - Verify environment variables are loaded correctly
   - Check that anon key has proper permissions
   - Ensure RLS policies allow anonymous read access

2. **API Route Implementation**
   - Verify API routes use correct service functions
   - Check error handling in API routes
   - Ensure proper response format

3. **Service Function Implementation**
   - Verify service functions use correct Supabase client (server vs client)
   - Check query construction and filters
   - Ensure proper error handling

4. **Component Data Fetching**
   - Verify useEffect dependencies are correct
   - Check fetch URL construction
   - Ensure proper state management (loading, data, error)

5. **Response Data Structure**
   - Verify API returns data in expected format
   - Check if data is nested (data.data vs data)
   - Ensure pagination structure is handled correctly

### Likely Root Causes

Based on the symptoms, the most likely issues are:

1. **API Response Structure Mismatch**: The API might return `{success: true, data: {data: [], pagination: {}}}` but the frontend expects `{success: true, data: []}`

2. **RLS Policy Issue**: Although policies look correct, they might not be applied or there's a mismatch in how the client authenticates

3. **Environment Variable Issue**: The Supabase URL or anon key might not be loaded correctly in the runtime environment

4. **Service Function Client Issue**: The service functions might be using the wrong Supabase client (client-side vs server-side)

### Debugging Steps

1. Add console.log statements in API routes to verify they're being called
2. Log the raw Supabase query response before transformation
3. Log the API response structure in the frontend
4. Check browser network tab for actual API responses
5. Verify RLS policies in Supabase dashboard
6. Test direct Supabase queries in Supabase SQL editor

## Dependencies

- Existing Supabase setup and configuration
- Existing service functions and API routes
- Existing React components and UI components
- Browser developer tools for debugging

## Performance Considerations

- Add appropriate caching headers to API responses
- Consider implementing request deduplication
- Use pagination to limit data transfer
- Implement loading skeletons for better perceived performance

## Security Considerations

- Ensure RLS policies are properly configured
- Never expose service role key to client
- Validate and sanitize all query parameters
- Implement rate limiting on API routes
