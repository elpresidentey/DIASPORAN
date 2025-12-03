-- Create dining_venues table
-- Stores information about restaurants and dining establishments

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

-- Create indexes for frequently queried columns
CREATE INDEX idx_dining_venues_city ON public.dining_venues(city);
CREATE INDEX idx_dining_venues_country ON public.dining_venues(country);
CREATE INDEX idx_dining_venues_cuisine_type ON public.dining_venues USING GIN(cuisine_type);
CREATE INDEX idx_dining_venues_price_range ON public.dining_venues(price_range);
CREATE INDEX idx_dining_venues_average_rating ON public.dining_venues(average_rating);
CREATE INDEX idx_dining_venues_deleted_at ON public.dining_venues(deleted_at);

-- Enable Row Level Security
ALTER TABLE public.dining_venues ENABLE ROW LEVEL SECURITY;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_dining_venues_updated_at
  BEFORE UPDATE ON public.dining_venues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.dining_venues TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.dining_venues TO authenticated;
