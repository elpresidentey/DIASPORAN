-- Sample bookings to demonstrate the booking history functionality
-- Run this in Supabase SQL Editor to add sample booking data

-- Note: Replace 'user-id-here' with an actual user ID from your auth.users table
-- You can get a user ID by running: SELECT id FROM auth.users LIMIT 1;

-- Sample Event Bookings
INSERT INTO public.bookings (
  user_id, booking_type, reference_id, status, start_date, end_date, 
  guests, total_price, currency, special_requests, metadata
) VALUES 
-- Upcoming Event Booking
('user-id-here', 'event', 'bf1ca642-38be-4dd4-9a7e-976d47d8f0d8', 'confirmed', 
 '2024-12-25 19:00:00+00', '2024-12-25 23:00:00+00', 2, 50000, 'NGN', 
 'VIP seating preferred', 
 '{"customer_info": {"name": "John Doe", "email": "john@example.com"}, "booking_source": "web"}'::jsonb),

-- Past Event Booking
('user-id-here', 'event', '7e19859f-52f9-448e-bcd5-59713d4f9384', 'completed', 
 '2024-11-15 18:00:00+00', '2024-11-15 23:59:00+00', 1, 25000, 'NGN', 
 NULL, 
 '{"customer_info": {"name": "John Doe", "email": "john@example.com"}, "booking_source": "web"}'::jsonb),

-- Sample Flight Bookings (using flight IDs from your flights table)
-- You may need to adjust the reference_id to match actual flight IDs
('user-id-here', 'flight', 'flight-id-1', 'confirmed', 
 '2024-12-28 14:30:00+00', '2024-12-28 20:45:00+00', 1, 1275000, 'NGN', 
 'Window seat preferred', 
 '{"customer_info": {"name": "John Doe", "email": "john@example.com"}, "flight_details": {"class": "Economy", "seat": "12A"}}'::jsonb),

-- Past Flight Booking
('user-id-here', 'flight', 'flight-id-2', 'completed', 
 '2024-10-15 08:30:00+00', '2024-10-15 14:45:00+00', 1, 975000, 'NGN', 
 NULL, 
 '{"customer_info": {"name": "John Doe", "email": "john@example.com"}, "flight_details": {"class": "Economy"}}'::jsonb),

-- Sample Accommodation Bookings
('user-id-here', 'accommodation', 'accommodation-id-1', 'confirmed', 
 '2024-12-30 15:00:00+00', '2025-01-03 11:00:00+00', 2, 1500000, 'NGN', 
 'Late check-in requested', 
 '{"customer_info": {"name": "John Doe", "email": "john@example.com"}, "accommodation_details": {"room_type": "Deluxe Suite", "nights": 4}}'::jsonb),

-- Past Accommodation Booking
('user-id-here', 'accommodation', 'accommodation-id-2', 'completed', 
 '2024-09-20 14:00:00+00', '2024-09-25 12:00:00+00', 2, 900000, 'NGN', 
 'Airport pickup needed', 
 '{"customer_info": {"name": "John Doe", "email": "john@example.com"}, "accommodation_details": {"room_type": "Standard Room", "nights": 5}}'::jsonb),

-- Sample Transport Bookings
('user-id-here', 'transport', 'transport-id-1', 'confirmed', 
 '2024-12-26 09:00:00+00', '2024-12-26 11:00:00+00', 3, 45000, 'NGN', 
 'Child seat required', 
 '{"customer_info": {"name": "John Doe", "email": "john@example.com"}, "transport_details": {"vehicle_type": "SUV", "pickup": "Airport", "destination": "Hotel"}}'::jsonb),

-- Cancelled Transport Booking
('user-id-here', 'transport', 'transport-id-2', 'cancelled', 
 '2024-11-10 16:00:00+00', '2024-11-10 18:00:00+00', 2, 30000, 'NGN', 
 NULL, 
 '{"customer_info": {"name": "John Doe", "email": "john@example.com"}, "cancellation_reason": "Change of plans"}'::jsonb),

-- Sample Dining Bookings
('user-id-here', 'dining', 'dining-id-1', 'confirmed', 
 '2024-12-31 19:30:00+00', '2024-12-31 22:00:00+00', 4, 120000, 'NGN', 
 'Vegetarian options needed', 
 '{"customer_info": {"name": "John Doe", "email": "john@example.com"}, "dining_details": {"restaurant": "Nok by Alara", "table_preference": "Window table"}}'::jsonb),

-- Past Dining Booking
('user-id-here', 'dining', 'dining-id-2', 'completed', 
 '2024-08-15 20:00:00+00', '2024-08-15 22:30:00+00', 2, 75000, 'NGN', 
 'Anniversary celebration', 
 '{"customer_info": {"name": "John Doe", "email": "john@example.com"}, "dining_details": {"restaurant": "Terra Kulture", "special_occasion": "Anniversary"}}'::jsonb);

-- Update timestamps
UPDATE public.bookings 
SET created_at = start_date - INTERVAL '7 days',
    updated_at = start_date - INTERVAL '7 days'
WHERE user_id = 'user-id-here';