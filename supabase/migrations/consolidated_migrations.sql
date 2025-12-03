-- CONSOLIDATED MIGRATIONS FOR DIASPORAN
-- Run this file in Supabase SQL Editor after running the users_profiles migration

-- MIGRATION 2: CREATE DINING_VENUES TABLE

CREATE TABLE IF NOT EXISTS public.dining_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cuisine_type TEXT[] NOT NULL DEFAULT '{}',
  price_range INTEGER NOT NULL CHECK (price_range >= 1 AND price_range <= 4),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  website TEXT,
  hours JSONB DEFAULT '{}'::jsonb,
  capacity INTEGER NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  average_rating DECIMAL(3, 2) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.users_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_dining_venues_city ON public.dining_venues(city);
CREATE INDEX idx_dining_venues_country ON public.dining_venues(country);
CREATE INDEX idx_dining_venues_cuisine_type ON public.dining_venues USING GIN(cuisine_type);
CREATE INDEX idx_dining_venues_price_range ON public.dining_venues(price_range);
CREATE INDEX idx_dining_venues_average_rating ON public.dining_venues(average_rating);
CREATE INDEX idx_dining_venues_deleted_at ON public.dining_venues(deleted_at);

ALTER TABLE public.dining_venues ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_dining_venues_updated_at
  BEFORE UPDATE ON public.dining_venues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT ON public.dining_venues TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.dining_venues TO authenticated;

-- MIGRATION 3: CREATE ACCOMMODATIONS TABLE

CREATE TABLE IF NOT EXISTS public.accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  property_type TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  max_guests INTEGER NOT NULL DEFAULT 1,
  price_per_night DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  house_rules TEXT,
  check_in_time TIME,
  check_out_time TIME,
  average_rating DECIMAL(3, 2) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.users_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_accommodations_city ON public.accommodations(city);
CREATE INDEX idx_accommodations_country ON public.accommodations(country);
CREATE INDEX idx_accommodations_property_type ON public.accommodations(property_type);
CREATE INDEX idx_accommodations_price_per_night ON public.accommodations(price_per_night);
CREATE INDEX idx_accommodations_max_guests ON public.accommodations(max_guests);
CREATE INDEX idx_accommodations_average_rating ON public.accommodations(average_rating);
CREATE INDEX idx_accommodations_deleted_at ON public.accommodations(deleted_at);
CREATE INDEX idx_accommodations_amenities ON public.accommodations USING GIN(amenities);

ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_accommodations_updated_at
  BEFORE UPDATE ON public.accommodations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT ON public.accommodations TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.accommodations TO authenticated;

-- MIGRATION 4: CREATE FLIGHTS TABLE

CREATE TABLE IF NOT EXISTS public.flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airline TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  origin_airport TEXT NOT NULL,
  destination_airport TEXT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  aircraft_type TEXT,
  available_seats INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  class_type TEXT NOT NULL,
  layovers JSONB[] DEFAULT '{}',
  baggage_allowance JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_flight_times CHECK (arrival_time > departure_time)
);

CREATE INDEX idx_flights_origin_airport ON public.flights(origin_airport);
CREATE INDEX idx_flights_destination_airport ON public.flights(destination_airport);
CREATE INDEX idx_flights_departure_time ON public.flights(departure_time);
CREATE INDEX idx_flights_arrival_time ON public.flights(arrival_time);
CREATE INDEX idx_flights_airline ON public.flights(airline);
CREATE INDEX idx_flights_price ON public.flights(price);
CREATE INDEX idx_flights_class_type ON public.flights(class_type);
CREATE INDEX idx_flights_available_seats ON public.flights(available_seats);
CREATE INDEX idx_flights_route_date ON public.flights(origin_airport, destination_airport, departure_time);

ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_flights_updated_at
  BEFORE UPDATE ON public.flights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT ON public.flights TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.flights TO authenticated;

-- MIGRATION 5: CREATE EVENTS TABLE

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  capacity INTEGER NOT NULL DEFAULT 0,
  available_spots INTEGER NOT NULL DEFAULT 0,
  ticket_types JSONB[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  organizer_id UUID REFERENCES public.users_profiles(id) ON DELETE SET NULL,
  average_rating DECIMAL(3, 2) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT valid_event_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_available_spots CHECK (available_spots >= 0 AND available_spots <= capacity)
);

CREATE INDEX idx_events_city ON public.events(city);
CREATE INDEX idx_events_country ON public.events(country);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_end_date ON public.events(end_date);
CREATE INDEX idx_events_available_spots ON public.events(available_spots);
CREATE INDEX idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX idx_events_deleted_at ON public.events(deleted_at);
CREATE INDEX idx_events_date_range ON public.events(start_date, end_date);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT ON public.events TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;

-- MIGRATION 6: CREATE TRANSPORT_OPTIONS TABLE

CREATE TABLE IF NOT EXISTS public.transport_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  transport_type TEXT NOT NULL,
  route_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  schedule JSONB DEFAULT '{}'::jsonb,
  vehicle_info JSONB DEFAULT '{}'::jsonb,
  available_seats INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transport_options_origin ON public.transport_options(origin);
CREATE INDEX idx_transport_options_destination ON public.transport_options(destination);
CREATE INDEX idx_transport_options_transport_type ON public.transport_options(transport_type);
CREATE INDEX idx_transport_options_provider ON public.transport_options(provider);
CREATE INDEX idx_transport_options_departure_time ON public.transport_options(departure_time);
CREATE INDEX idx_transport_options_price ON public.transport_options(price);
CREATE INDEX idx_transport_options_available_seats ON public.transport_options(available_seats);
CREATE INDEX idx_transport_options_route ON public.transport_options(origin, destination);

ALTER TABLE public.transport_options ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_transport_options_updated_at
  BEFORE UPDATE ON public.transport_options
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT ON public.transport_options TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.transport_options TO authenticated;

-- MIGRATION 7: CREATE BOOKINGS TABLE

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('dining', 'accommodation', 'flight', 'event', 'transport')),
  reference_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_id TEXT,
  special_requests TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  CONSTRAINT valid_booking_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_booking_type ON public.bookings(booking_type);
CREATE INDEX idx_bookings_reference_id ON public.bookings(reference_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_start_date ON public.bookings(start_date);
CREATE INDEX idx_bookings_end_date ON public.bookings(end_date);
CREATE INDEX idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at);
CREATE INDEX idx_bookings_user_status ON public.bookings(user_id, status);
CREATE INDEX idx_bookings_user_type ON public.bookings(user_id, booking_type);
CREATE INDEX idx_bookings_type_reference ON public.bookings(booking_type, reference_id);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;

-- MIGRATION 8: CREATE REVIEWS TABLE

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('dining', 'accommodation', 'event', 'transport')),
  listing_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_review_per_booking UNIQUE (booking_id)
);

CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX idx_reviews_listing_type ON public.reviews(listing_type);
CREATE INDEX idx_reviews_listing_id ON public.reviews(listing_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at);
CREATE INDEX idx_reviews_listing ON public.reviews(listing_type, listing_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update listing average rating
CREATE OR REPLACE FUNCTION public.update_listing_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL(3, 2);
  review_count INTEGER;
  table_name TEXT;
BEGIN
  CASE COALESCE(NEW.listing_type, OLD.listing_type)
    WHEN 'dining' THEN table_name := 'dining_venues';
    WHEN 'accommodation' THEN table_name := 'accommodations';
    WHEN 'event' THEN table_name := 'events';
    ELSE RETURN COALESCE(NEW, OLD);
  END CASE;

  SELECT 
    COALESCE(AVG(rating), 0),
    COUNT(*)
  INTO avg_rating, review_count
  FROM public.reviews
  WHERE listing_type = COALESCE(NEW.listing_type, OLD.listing_type)
    AND listing_id = COALESCE(NEW.listing_id, OLD.listing_id);

  EXECUTE format(
    'UPDATE public.%I SET average_rating = $1, total_reviews = $2, updated_at = NOW() WHERE id = $3',
    table_name
  ) USING avg_rating, review_count, COALESCE(NEW.listing_id, OLD.listing_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_listing_rating();

CREATE TRIGGER update_rating_on_review_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  WHEN (OLD.rating IS DISTINCT FROM NEW.rating)
  EXECUTE FUNCTION public.update_listing_rating();

CREATE TRIGGER update_rating_on_review_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_listing_rating();

GRANT SELECT ON public.reviews TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;

-- MIGRATION 9: CREATE SAVED_ITEMS TABLE

CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('dining', 'accommodation', 'flight', 'event', 'transport')),
  item_id UUID NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_saved_item UNIQUE (user_id, item_type, item_id)
);

CREATE INDEX idx_saved_items_user_id ON public.saved_items(user_id);
CREATE INDEX idx_saved_items_item_type ON public.saved_items(item_type);
CREATE INDEX idx_saved_items_item_id ON public.saved_items(item_id);
CREATE INDEX idx_saved_items_created_at ON public.saved_items(created_at);
CREATE INDEX idx_saved_items_user_type ON public.saved_items(user_id, item_type);

ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_items TO authenticated;

-- MIGRATION 10: CREATE SAFETY TABLES

CREATE TABLE IF NOT EXISTS public.safety_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  city TEXT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  emergency_contacts JSONB[] DEFAULT '{}',
  safety_level TEXT CHECK (safety_level IN ('low', 'moderate', 'high', 'critical')),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_safety_information_country ON public.safety_information(country);
CREATE INDEX idx_safety_information_city ON public.safety_information(city);
CREATE INDEX idx_safety_information_category ON public.safety_information(category);
CREATE INDEX idx_safety_information_safety_level ON public.safety_information(safety_level);
CREATE INDEX idx_safety_information_last_updated ON public.safety_information(last_updated);
CREATE INDEX idx_safety_information_location ON public.safety_information(country, city);

ALTER TABLE public.safety_information ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_safety_information_updated_at
  BEFORE UPDATE ON public.safety_information
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.safety_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_safety_reports_user_id ON public.safety_reports(user_id);
CREATE INDEX idx_safety_reports_location ON public.safety_reports(location);
CREATE INDEX idx_safety_reports_category ON public.safety_reports(category);
CREATE INDEX idx_safety_reports_severity ON public.safety_reports(severity);
CREATE INDEX idx_safety_reports_status ON public.safety_reports(status);
CREATE INDEX idx_safety_reports_created_at ON public.safety_reports(created_at);
CREATE INDEX idx_safety_reports_coordinates ON public.safety_reports(latitude, longitude);

ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.safety_information TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.safety_information TO authenticated;
GRANT SELECT, INSERT ON public.safety_reports TO authenticated;
GRANT UPDATE, DELETE ON public.safety_reports TO authenticated;

-- MIGRATION 11: CREATE RLS POLICIES

-- USERS_PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON public.users_profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.users_profiles FOR DELETE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anonymous users can view profiles"
  ON public.users_profiles FOR SELECT TO anon
  USING (true);

-- BOOKINGS POLICIES
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings"
  ON public.bookings FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- REVIEWS POLICIES
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create own reviews"
  ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- SAVED_ITEMS POLICIES
CREATE POLICY "Users can view own saved items"
  ON public.saved_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own saved items"
  ON public.saved_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved items"
  ON public.saved_items FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved items"
  ON public.saved_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- DINING_VENUES POLICIES
CREATE POLICY "Anyone can view active dining venues"
  ON public.dining_venues FOR SELECT TO authenticated, anon
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can create dining venues"
  ON public.dining_venues FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update dining venues"
  ON public.dining_venues FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete dining venues"
  ON public.dining_venues FOR DELETE TO authenticated
  USING (true);

-- ACCOMMODATIONS POLICIES
CREATE POLICY "Anyone can view active accommodations"
  ON public.accommodations FOR SELECT TO authenticated, anon
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can create accommodations"
  ON public.accommodations FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update accommodations"
  ON public.accommodations FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete accommodations"
  ON public.accommodations FOR DELETE TO authenticated
  USING (true);

-- EVENTS POLICIES
CREATE POLICY "Anyone can view active events"
  ON public.events FOR SELECT TO authenticated, anon
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON public.events FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON public.events FOR DELETE TO authenticated
  USING (true);

-- TRANSPORT_OPTIONS POLICIES
CREATE POLICY "Anyone can view transport options"
  ON public.transport_options FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create transport options"
  ON public.transport_options FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update transport options"
  ON public.transport_options FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transport options"
  ON public.transport_options FOR DELETE TO authenticated
  USING (true);

-- FLIGHTS POLICIES
CREATE POLICY "Anyone can view flights"
  ON public.flights FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create flights"
  ON public.flights FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update flights"
  ON public.flights FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete flights"
  ON public.flights FOR DELETE TO authenticated
  USING (true);

-- SAFETY_INFORMATION POLICIES
CREATE POLICY "Anyone can view safety information"
  ON public.safety_information FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create safety information"
  ON public.safety_information FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update safety information"
  ON public.safety_information FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete safety information"
  ON public.safety_information FOR DELETE TO authenticated
  USING (true);

-- SAFETY_REPORTS POLICIES
CREATE POLICY "Users can view own safety reports"
  ON public.safety_reports FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own safety reports"
  ON public.safety_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own safety reports"
  ON public.safety_reports FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own safety reports"
  ON public.safety_reports FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ADMIN HELPER FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    COALESCE(
      current_setting('request.jwt.claims', true)::json->>'role',
      ''
    ) = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- MIGRATION COMPLETE
