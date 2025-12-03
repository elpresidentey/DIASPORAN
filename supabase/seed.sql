-- SEED DATA FOR DIASPORAN
-- Run this in Supabase SQL Editor to populate your database with sample data

-- Insert sample flights
INSERT INTO public.flights (
  airline, flight_number, origin_airport, destination_airport, 
  departure_time, arrival_time, duration_minutes, aircraft_type,
  available_seats, price, currency, class_type, baggage_allowance
) VALUES 
-- Lagos to London flights
('British Airways', 'BA075', 'LOS', 'LHR', 
 '2024-12-15 23:45:00+00', '2024-12-16 06:30:00+00', 405, 'Boeing 777-300ER',
 45, 1275000.00, 'NGN', 'Economy', '{"checked": "23kg", "carry_on": "7kg"}'::jsonb),
 
('Virgin Atlantic', 'VS411', 'LOS', 'LHR', 
 '2024-12-16 22:30:00+00', '2024-12-17 05:15:00+00', 405, 'Airbus A330-300',
 32, 1380000.00, 'NGN', 'Economy', '{"checked": "23kg", "carry_on": "10kg"}'::jsonb),

-- Lagos to Dubai flights  
('Emirates', 'EK783', 'LOS', 'DXB',
 '2024-12-15 14:20:00+00', '2024-12-16 01:45:00+00', 445, 'Boeing 777-300ER',
 28, 975000.00, 'NGN', 'Economy', '{"checked": "30kg", "carry_on": "7kg"}'::jsonb),

-- Lagos to New York flights
('Delta Air Lines', 'DL156', 'LOS', 'JFK',
 '2024-12-16 10:30:00+00', '2024-12-16 16:45:00+00', 615, 'Airbus A330-900',
 18, 1800000.00, 'NGN', 'Economy', '{"checked": "23kg", "carry_on": "7kg"}'::jsonb),

-- Abuja to London
('British Airways', 'BA081', 'ABV', 'LHR',
 '2024-12-17 01:15:00+00', '2024-12-17 07:45:00+00', 390, 'Boeing 787-8',
 52, 1170000.00, 'NGN', 'Economy', '{"checked": "23kg", "carry_on": "7kg"}'::jsonb),

-- Business class options
('Qatar Airways', 'QR1418', 'LOS', 'DOH',
 '2024-12-15 08:45:00+00', '2024-12-15 18:30:00+00', 465, 'Boeing 787-8',
 12, 4200000.00, 'NGN', 'Business', '{"checked": "40kg", "carry_on": "15kg"}'::jsonb);

-- Insert sample accommodations
INSERT INTO public.accommodations (
  name, description, property_type, address, city, country,
  latitude, longitude, bedrooms, bathrooms, max_guests,
  price_per_night, currency, amenities, images, house_rules,
  check_in_time, check_out_time, average_rating, total_reviews
) VALUES 
-- Lagos accommodations
('Luxury Waterfront Villa - Victoria Island', 
 'Stunning 4-bedroom villa with panoramic views of Lagos lagoon. Perfect for families and groups seeking luxury accommodation in the heart of Lagos.',
 'Villa', '15 Tiamiyu Savage Street', 'Lagos', 'Nigeria',
 6.4281, 3.4219, 4, 3, 8, 375000.00, 'NGN',
 ARRAY['WiFi', 'Pool', 'Security', 'Generator', 'AC', 'Kitchen', 'Parking', 'Gym'],
 ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
 'No smoking indoors. No parties after 10 PM. Maximum 8 guests.',
 '15:00:00', '11:00:00', 4.8, 127),

('Modern Lekki Apartment', 
 'Contemporary 2-bedroom apartment in upscale Lekki Phase 1. Walking distance to restaurants, shopping, and nightlife.',
 'Apartment', 'Admiralty Way, Lekki Phase 1', 'Lagos', 'Nigeria',
 6.4698, 3.4301, 2, 2, 4, 180000.00, 'NGN',
 ARRAY['WiFi', 'AC', 'Kitchen', 'Security', 'Generator', 'Parking'],
 ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
 'No smoking. Quiet hours after 10 PM.',
 '14:00:00', '12:00:00', 4.6, 89),

-- Abuja accommodations
('Executive Suites - Maitama', 
 'Elegant 3-bedroom penthouse in prestigious Maitama district. Perfect for business travelers and diplomats.',
 'Penthouse', 'Aguiyi Ironsi Street', 'Abuja', 'Nigeria',
 9.0579, 7.4951, 3, 2, 6, 270000.00, 'NGN',
 ARRAY['WiFi', 'AC', 'Kitchen', 'Security', 'Generator', 'Gym', 'Concierge'],
 ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d', 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0'],
 'Professional environment. No parties.',
 '15:00:00', '11:00:00', 4.7, 156),

-- Port Harcourt accommodation
('Garden City Boutique Hotel', 
 'Charming boutique hotel in the heart of Port Harcourt. Ideal for both business and leisure travelers.',
 'Hotel', 'Aba Road, GRA Phase 2', 'Port Harcourt', 'Nigeria',
 4.8156, 7.0498, 1, 1, 2, 142500.00, 'NGN',
 ARRAY['WiFi', 'AC', 'Restaurant', 'Bar', 'Laundry', 'Security', 'Generator'],
 ARRAY['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'],
 'Hotel policies apply. Check-in required.',
 '14:00:00', '12:00:00', 4.4, 203),

-- International options
('Luxury London Townhouse', 
 'Beautiful Victorian townhouse in Kensington. Perfect for Nigerian travelers visiting London.',
 'Townhouse', '45 Cromwell Road, Kensington', 'London', 'United Kingdom',
 51.4945, -0.1788, 3, 2, 6, 525000.00, 'NGN',
 ARRAY['WiFi', 'Kitchen', 'Heating', 'Washer', 'Dryer', 'Garden'],
 ARRAY['https://images.unsplash.com/photo-1513584684374-8bab748fbf90', 'https://images.unsplash.com/photo-1505693314120-0d443867891c'],
 'No smoking. Respect neighbors. Maximum 6 guests.',
 '16:00:00', '10:00:00', 4.9, 78),

('Dubai Marina Apartment', 
 'Modern high-rise apartment with stunning marina views. Popular with Nigerian business travelers.',
 'Apartment', 'Marina Walk, Dubai Marina', 'Dubai', 'United Arab Emirates',
 25.0657, 55.1713, 2, 2, 4, 300000.00, 'NGN',
 ARRAY['WiFi', 'AC', 'Pool', 'Gym', 'Security', 'Parking', 'Beach Access'],
 ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'],
 'Building rules apply. Pool hours: 6 AM - 10 PM.',
 '15:00:00', '12:00:00', 4.5, 134);

-- Insert sample events
INSERT INTO public.events (
  title, description, category, start_date, end_date,
  location, address, city, country, latitude, longitude,
  capacity, available_spots, ticket_types, images, organizer_id
) VALUES 
-- Lagos events
('Afrobeats Festival Lagos 2024', 
 'The biggest Afrobeats festival in West Africa featuring top Nigerian and international artists. Three days of non-stop music, food, and culture.',
 'Music', '2024-12-20 18:00:00+00', '2024-12-22 23:59:00+00',
 'Tafawa Balewa Square', 'Tafawa Balewa Square, Lagos Island', 'Lagos', 'Nigeria',
 6.4541, 3.3947, 50000, 12500,
 ARRAY['{"type": "General Admission", "price": 25000, "currency": "NGN"}'::jsonb, '{"type": "VIP", "price": 75000, "currency": "NGN"}'::jsonb, '{"type": "VVIP", "price": 150000, "currency": "NGN"}'::jsonb],
 ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7'],
 NULL),

('Lagos Tech Summit 2024', 
 'Premier technology conference bringing together innovators, entrepreneurs, and investors from across Africa.',
 'Technology', '2024-12-18 09:00:00+00', '2024-12-19 18:00:00+00',
 'Eko Hotel & Suites', '1415 Adetokunbo Ademola Street, Victoria Island', 'Lagos', 'Nigeria',
 6.4281, 3.4219, 2000, 450,
 ARRAY['{"type": "Student", "price": 15000, "currency": "NGN"}'::jsonb, '{"type": "Professional", "price": 50000, "currency": "NGN"}'::jsonb, '{"type": "Executive", "price": 100000, "currency": "NGN"}'::jsonb],
 ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd'],
 NULL),

('Nigerian Fashion Week', 
 'Showcase of the best in Nigerian and African fashion design. Runway shows, exhibitions, and networking events.',
 'Fashion', '2024-12-25 19:00:00+00', '2024-12-28 22:00:00+00',
 'Federal Palace Hotel', '26 Ahmadu Bello Way, Victoria Island', 'Lagos', 'Nigeria',
 6.4395, 3.4197, 1500, 380,
 ARRAY['{"type": "Day Pass", "price": 20000, "currency": "NGN"}'::jsonb, '{"type": "Full Access", "price": 60000, "currency": "NGN"}'::jsonb, '{"type": "Designer Pass", "price": 120000, "currency": "NGN"}'::jsonb],
 ARRAY['https://images.unsplash.com/photo-1469334031218-e382a71b716b', 'https://images.unsplash.com/photo-1445205170230-053b83016050'],
 NULL),

-- Abuja events
('Abuja Food & Wine Festival', 
 'Culinary celebration featuring the best restaurants, chefs, and wineries from Nigeria and beyond.',
 'Food & Drink', '2024-12-21 12:00:00+00', '2024-12-22 22:00:00+00',
 'Transcorp Hilton Abuja', '1 Aguiyi Ironsi Street, Maitama', 'Abuja', 'Nigeria',
 9.0579, 7.4951, 3000, 850,
 ARRAY['{"type": "Tasting Pass", "price": 25000, "currency": "NGN"}'::jsonb, '{"type": "Premium Experience", "price": 65000, "currency": "NGN"}'::jsonb],
 ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0', 'https://images.unsplash.com/photo-1551218808-94e220e084d2'],
 NULL),

-- Cultural events
('Calabar Carnival 2024', 
 'Africa''s biggest street party! Colorful parades, cultural displays, and international performances.',
 'Cultural', '2024-12-27 10:00:00+00', '2024-12-31 23:59:00+00',
 'Calabar Municipal', 'U.J. Esuene Stadium, Calabar', 'Calabar', 'Nigeria',
 4.9517, 8.3220, 100000, 25000,
 ARRAY['{"type": "Festival Pass", "price": 10000, "currency": "NGN"}'::jsonb, '{"type": "VIP Experience", "price": 50000, "currency": "NGN"}'::jsonb],
 ARRAY['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
 NULL),

('Nollywood Film Festival', 
 'Celebrating the best in Nigerian cinema with screenings, premieres, and industry networking.',
 'Entertainment', '2024-12-23 18:00:00+00', '2024-12-26 23:00:00+00',
 'IMAX Filmhouse Lekki', 'The Palms Shopping Mall, Lekki', 'Lagos', 'Nigeria',
 6.4698, 3.4301, 800, 200,
 ARRAY['{"type": "Single Screening", "price": 5000, "currency": "NGN"}'::jsonb, '{"type": "Festival Pass", "price": 25000, "currency": "NGN"}'::jsonb, '{"type": "Industry Pass", "price": 75000, "currency": "NGN"}'::jsonb],
 ARRAY['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba', 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9'],
 NULL);

-- Insert sample dining venues
INSERT INTO public.dining_venues (
  name, description, cuisine_type, price_range, address, city, country,
  latitude, longitude, phone, email, website, hours, capacity,
  images, amenities, average_rating, total_reviews
) VALUES 
-- Lagos restaurants
('Nok by Alara', 
 'Contemporary Nigerian cuisine in an elegant setting. Known for innovative takes on traditional dishes using local ingredients.',
 ARRAY['Nigerian', 'Contemporary', 'Fine Dining'], 4,
 '12A Akin Olugbade Street, Victoria Island', 'Lagos', 'Nigeria',
 6.4281, 3.4219, '+234-1-461-2345', 'reservations@nokbyalara.com', 'https://nokbyalara.com',
 '{"monday": "12:00-22:00", "tuesday": "12:00-22:00", "wednesday": "12:00-22:00", "thursday": "12:00-22:00", "friday": "12:00-23:00", "saturday": "12:00-23:00", "sunday": "12:00-21:00"}'::jsonb,
 120,
 ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0', 'https://images.unsplash.com/photo-1551218808-94e220e084d2'],
 ARRAY['Air Conditioning', 'WiFi', 'Valet Parking', 'Private Dining', 'Wine Cellar', 'Outdoor Seating'],
 4.7, 234),

('Terra Kulture', 
 'Cultural center and restaurant serving authentic Nigerian dishes in a vibrant artistic atmosphere.',
 ARRAY['Nigerian', 'Traditional', 'Cultural'], 2,
 '1376 Tiamiyu Savage Street, Victoria Island', 'Lagos', 'Nigeria',
 6.4281, 3.4219, '+234-1-461-0799', 'info@terrakulture.com', 'https://terrakulture.com',
 '{"monday": "10:00-21:00", "tuesday": "10:00-21:00", "wednesday": "10:00-21:00", "thursday": "10:00-21:00", "friday": "10:00-22:00", "saturday": "10:00-22:00", "sunday": "12:00-20:00"}'::jsonb,
 200,
 ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5', 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f'],
 ARRAY['Air Conditioning', 'WiFi', 'Art Gallery', 'Bookstore', 'Cultural Events', 'Parking'],
 4.5, 456),

('Shiro Lagos', 
 'Upscale Asian fusion restaurant with stunning lagoon views. Popular for business dinners and special occasions.',
 ARRAY['Asian', 'Fusion', 'Japanese', 'Chinese'], 4,
 '4 Afribank Street, Victoria Island', 'Lagos', 'Nigeria',
 6.4281, 3.4219, '+234-1-461-4974', 'reservations@shirolagos.com', 'https://shirolagos.com',
 '{"monday": "18:00-23:00", "tuesday": "18:00-23:00", "wednesday": "18:00-23:00", "thursday": "18:00-23:00", "friday": "18:00-24:00", "saturday": "18:00-24:00", "sunday": "18:00-22:00"}'::jsonb,
 150,
 ARRAY['https://images.unsplash.com/photo-1579027989536-b7b1f875659b', 'https://images.unsplash.com/photo-1551218808-94e220e084d2'],
 ARRAY['Air Conditioning', 'WiFi', 'Valet Parking', 'Bar', 'Private Dining', 'Waterfront Views'],
 4.6, 189),

-- Abuja restaurants
('Zuma Grill', 
 'Premium steakhouse and grill in the heart of Abuja. Known for excellent steaks and continental cuisine.',
 ARRAY['Steakhouse', 'Continental', 'Grill'], 4,
 '903 Tafawa Balewa Way, Area 11', 'Abuja', 'Nigeria',
 9.0579, 7.4951, '+234-9-461-2000', 'info@zumagrill.ng', 'https://zumagrill.ng',
 '{"monday": "17:00-23:00", "tuesday": "17:00-23:00", "wednesday": "17:00-23:00", "thursday": "17:00-23:00", "friday": "17:00-24:00", "saturday": "17:00-24:00", "sunday": "17:00-22:00"}'::jsonb,
 180,
 ARRAY['https://images.unsplash.com/photo-1544025162-d76694265947', 'https://images.unsplash.com/photo-1558030006-450675393462'],
 ARRAY['Air Conditioning', 'WiFi', 'Valet Parking', 'Bar', 'Private Dining', 'Wine Cellar'],
 4.8, 167),

('Bukka Hut', 
 'Popular Nigerian fast-casual chain known for affordable, authentic local dishes served quickly.',
 ARRAY['Nigerian', 'Fast Casual', 'Local'], 1,
 'Plot 1161, Memorial Drive, Central Area', 'Abuja', 'Nigeria',
 9.0579, 7.4951, '+234-9-291-2345', 'abuja@bukkahut.ng', 'https://bukkahut.ng',
 '{"monday": "07:00-22:00", "tuesday": "07:00-22:00", "wednesday": "07:00-22:00", "thursday": "07:00-22:00", "friday": "07:00-23:00", "saturday": "07:00-23:00", "sunday": "08:00-21:00"}'::jsonb,
 80,
 ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187'],
 ARRAY['Air Conditioning', 'WiFi', 'Takeaway', 'Delivery', 'Parking'],
 4.2, 892);

-- Insert sample transport options
INSERT INTO public.transport_options (
  provider, transport_type, route_name, origin, destination,
  departure_time, arrival_time, duration_minutes, price, currency,
  schedule, vehicle_info, available_seats
) VALUES 
-- Lagos routes
('ABC Transport', 'Bus', 'Lagos-Abuja Express', 'Lagos (Jibowu)', 'Abuja (Utako)',
 '07:00:00', '15:00:00', 480, 8000.00, 'NGN',
 '{"frequency": "daily", "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]}'::jsonb,
 '{"type": "Luxury Bus", "amenities": ["AC", "WiFi", "Charging Ports", "Refreshments"], "capacity": 45}'::jsonb,
 12),

('GUO Transport', 'Bus', 'Lagos-Port Harcourt', 'Lagos (Mazamaza)', 'Port Harcourt (Mile 3)',
 '06:30:00', '16:30:00', 600, 12000.00, 'NGN',
 '{"frequency": "daily", "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]}'::jsonb,
 '{"type": "Executive Bus", "amenities": ["AC", "Reclining Seats", "Entertainment", "Toilet"], "capacity": 40}'::jsonb,
 8),

('Bolt', 'Ride-hailing', 'Lagos City Rides', 'Anywhere in Lagos', 'Anywhere in Lagos',
 '00:00:00', '23:59:00', 30, 2500.00, 'NGN',
 '{"frequency": "on-demand", "availability": "24/7"}'::jsonb,
 '{"type": "Various", "options": ["Economy", "Comfort", "Executive"], "capacity": 4}'::jsonb,
 999),

-- Abuja routes
('Peace Mass Transit', 'Bus', 'Abuja-Kano Express', 'Abuja (Utako)', 'Kano (Sabon Gari)',
 '08:00:00', '16:00:00', 480, 7500.00, 'NGN',
 '{"frequency": "daily", "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]}'::jsonb,
 '{"type": "Standard Bus", "amenities": ["AC", "Comfortable Seats"], "capacity": 50}'::jsonb,
 15),

('Uber', 'Ride-hailing', 'Abuja City Rides', 'Anywhere in Abuja', 'Anywhere in Abuja',
 '00:00:00', '23:59:00', 25, 2000.00, 'NGN',
 '{"frequency": "on-demand", "availability": "24/7"}'::jsonb,
 '{"type": "Various", "options": ["UberX", "Comfort", "Black"], "capacity": 4}'::jsonb,
 999),

-- Inter-city premium options
('Libra Motors', 'Bus', 'Premium Lagos-Abuja', 'Lagos (Victoria Island)', 'Abuja (Maitama)',
 '22:00:00', '05:00:00', 420, 15000.00, 'NGN',
 '{"frequency": "daily", "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]}'::jsonb,
 '{"type": "Sleeper Bus", "amenities": ["Fully Reclining Seats", "AC", "WiFi", "Meals", "Attendant"], "capacity": 28}'::jsonb,
 5);

-- Success message
SELECT 'Sample data inserted successfully! Your database now has:' as message
UNION ALL
SELECT '- ' || count(*) || ' flights' FROM public.flights
UNION ALL  
SELECT '- ' || count(*) || ' accommodations' FROM public.accommodations
UNION ALL
SELECT '- ' || count(*) || ' events' FROM public.events
UNION ALL
SELECT '- ' || count(*) || ' dining venues' FROM public.dining_venues
UNION ALL
SELECT '- ' || count(*) || ' transport options' FROM public.transport_options;
