// Script to create sample bookings for testing
// Run this with: node create-sample-bookings.js

const sampleBookings = [
  {
    booking_type: 'event',
    reference_id: 'bf1ca642-38be-4dd4-9a7e-976d47d8f0d8', // Lagos Tech Summit
    start_date: '2024-12-25T19:00:00Z',
    end_date: '2024-12-25T23:00:00Z',
    guests: 2,
    total_price: 50000,
    currency: 'NGN',
    special_requests: 'VIP seating preferred',
    user_id: 'mock-user-123' // This will be replaced with real user ID
  },
  {
    booking_type: 'event',
    reference_id: '7e19859f-52f9-448e-bcd5-59713d4f9384', // Afrobeats Festival
    start_date: '2024-11-15T18:00:00Z',
    end_date: '2024-11-15T23:59:00Z',
    guests: 1,
    total_price: 25000,
    currency: 'NGN',
    special_requests: null
  },
  {
    booking_type: 'flight',
    reference_id: 'mock-flight-1',
    start_date: '2024-12-28T14:30:00Z',
    end_date: '2024-12-28T20:45:00Z',
    guests: 1,
    total_price: 1275000,
    currency: 'NGN',
    special_requests: 'Window seat preferred'
  },
  {
    booking_type: 'accommodation',
    reference_id: 'mock-hotel-1',
    start_date: '2024-12-30T15:00:00Z',
    end_date: '2025-01-03T11:00:00Z',
    guests: 2,
    total_price: 1500000,
    currency: 'NGN',
    special_requests: 'Late check-in requested'
  },
  {
    booking_type: 'transport',
    reference_id: 'mock-transport-1',
    start_date: '2024-12-26T09:00:00Z',
    end_date: '2024-12-26T11:00:00Z',
    guests: 3,
    total_price: 45000,
    currency: 'NGN',
    special_requests: 'Child seat required'
  }
];

async function createBookings() {
  console.log('Creating sample bookings...');
  
  for (const booking of sampleBookings) {
    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: JSON.stringify(booking)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Created ${booking.booking_type} booking`);
      } else {
        console.log(`❌ Failed to create ${booking.booking_type} booking:`, result.error?.message);
      }
    } catch (error) {
      console.log(`❌ Error creating ${booking.booking_type} booking:`, error.message);
    }
  }
}

createBookings();