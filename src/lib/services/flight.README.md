# Flight Service

This service handles all flight search and saved flights operations for the DettyConnect platform.

## Features

- **Flight Search**: Search and filter flights by origin, destination, date, price, airline, class, and number of stops
- **Flight Details**: Retrieve detailed information about a specific flight
- **Saved Flights**: Save flights to user's favorites and retrieve saved flights
- **Price Updates**: Update flight prices (admin/system operation)

## API Endpoints

### GET /api/flights
Search and list flights with filters.

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of results per page (default: 20)
- `origin` (string): Origin airport code or name
- `destination` (string): Destination airport code or name
- `departureDate` (string): Departure date (ISO format)
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `airline` (string): Airline name filter
- `class` (string): Flight class (economy, business, first)
- `maxStops` (number): Maximum number of layovers
- `sortBy` (string): Field to sort by (default: departure_time)
- `sortOrder` (string): Sort order - 'asc' or 'desc' (default: asc)

**Example:**
```
GET /api/flights?origin=JFK&destination=LAX&departureDate=2024-12-25&class=economy
```

### GET /api/flights/[id]
Get detailed information about a specific flight.

**Example:**
```
GET /api/flights/123e4567-e89b-12d3-a456-426614174000
```

### GET /api/saved/flights
Get user's saved flights (requires authentication).

**Example:**
```
GET /api/saved/flights
```

### POST /api/saved/flights
Save a flight to user's favorites (requires authentication).

**Request Body:**
```json
{
  "flightId": "123e4567-e89b-12d3-a456-426614174000",
  "notes": "Optional notes about this flight"
}
```

### DELETE /api/saved/flights
Remove a flight from user's saved items (requires authentication).

**Request Body:**
```json
{
  "flightId": "123e4567-e89b-12d3-a456-426614174000"
}
```

## Service Functions

### Client-Side Functions

- `getFlights(filters)`: Search flights with filters
- `getFlight(id)`: Get single flight details
- `saveFlight(userId, flightId, notes)`: Save a flight
- `unsaveFlight(userId, flightId)`: Remove a saved flight
- `getSavedFlights(userId)`: Get user's saved flights
- `updateFlightPrice(flightId, newPrice)`: Update flight price

### Server-Side Functions

- `getFlightsServer(filters)`: Server-side flight search
- `getFlightServer(id)`: Server-side flight details

## Filter Functionality

The service supports comprehensive filtering:

1. **Location Filters**: Filter by origin and destination airports
2. **Date Filters**: Filter flights by departure date
3. **Price Filters**: Set minimum and maximum price ranges
4. **Airline Filter**: Filter by specific airlines
5. **Class Filter**: Filter by flight class (economy, business, first)
6. **Stops Filter**: Limit results by maximum number of layovers
7. **Sorting**: Sort by any field (price, departure time, duration, etc.)

## Price Update Mechanism

The `updateFlightPrice` function allows for updating flight prices. This is typically used by:
- Admin users to manually adjust prices
- Automated systems to sync prices from external sources
- Scheduled jobs to update prices based on demand

## Implementation Notes

- All functions return a consistent error structure with code, message, and details
- Pagination is implemented for efficient data loading
- Caching headers are set on API responses for performance
- Authentication is required for saved flights operations
- Flight data is never soft-deleted (no deleted_at column)

## Requirements Validated

This implementation validates the following requirements:
- **5.1**: Flight search with origin, destination, and dates
- **5.2**: Filter functionality (price, airline, time)
- **5.3**: Flight details with complete itinerary information
- **5.4**: Save flights functionality
- **5.5**: Price update mechanism
