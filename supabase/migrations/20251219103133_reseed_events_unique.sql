-- Clear existing events and reseed with unique events
DELETE FROM public.events;

-- Insert unique sample events
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