# Saved Items Service

## Overview

The Saved Items Service provides functionality for users to save, remove, and retrieve their favorite listings across all item types (dining venues, accommodations, flights, events, and transport options).

## Features

- **Save Items**: Add any listing to user's saved items
- **Remove Items**: Remove saved items by ID
- **List Saved Items**: Retrieve all saved items with current listing data
- **Availability Checking**: Automatically marks unavailable items (deleted, sold out, no seats)
- **Current Data**: Always fetches the latest listing information

## API Endpoints

### POST /api/saved
Save an item to user's saved items.

**Request Body:**
```json
{
  "itemType": "flight",
  "itemId": "uuid",
  "notes": "Optional notes"
}
```

### GET /api/saved
Get user's saved items with optional filtering.

**Query Parameters:**
- `itemType` (optional): Filter by item type

### DELETE /api/saved/[id]
Remove a saved item by its ID.

## Service Functions

### Client-side Functions
- `saveItem(userId, itemType, itemId, notes?)` - Save an item
- `removeSavedItem(userId, savedItemId)` - Remove by saved item ID
- `removeSavedItemByReference(userId, itemType, itemId)` - Remove by item reference
- `getSavedItems(userId, itemType?)` - Get all saved items

### Server-side Functions
- `saveItemServer(userId, itemType, itemId, notes?)` - Server version of saveItem
- `removeSavedItemServer(userId, savedItemId)` - Server version of removeSavedItem
- `getSavedItemsServer(userId, itemType?)` - Server version of getSavedItems

## Requirements Validation

This service validates:
- **Requirement 10.1**: Creates saved item records
- **Requirement 10.2**: Deletes saved item records
- **Requirement 10.3**: Returns all saved listings
- **Requirement 10.4**: Fetches current data for saved listings
- **Requirement 10.5**: Marks unavailable items appropriately
