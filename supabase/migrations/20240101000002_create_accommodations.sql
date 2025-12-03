-- Create accommodations table
-- Stores information about hotels, apartments, and other lodging options

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

-- Create indexes for frequently queried columns
CREATE INDEX idx_accommodations_city ON public.accommodations(city);
CREATE INDEX idx_accommodations_country ON public.accommodations(country);
CREATE INDEX idx_accommodations_property_type ON public.accommodations(property_type);
CREATE INDEX idx_accommodations_price_per_night ON public.accommodations(price_per_night);
CREATE INDEX idx_accommodations_max_guests ON public.accommodations(max_guests);
CREATE INDEX idx_accommodations_average_rating ON public.accommodations(average_rating);
CREATE INDEX idx_accommodations_deleted_at ON public.accommodations(deleted_at);
CREATE INDEX idx_accommodations_amenities ON public.accommodations USING GIN(amenities);

-- Enable Row Level Security
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_accommodations_updated_at
  BEFORE UPDATE ON public.accommodations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.accommodations TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.accommodations TO authenticated;
