-- Create events table
-- Stores information about events and activities

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

-- Create indexes for frequently queried columns
CREATE INDEX idx_events_city ON public.events(city);
CREATE INDEX idx_events_country ON public.events(country);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_end_date ON public.events(end_date);
CREATE INDEX idx_events_available_spots ON public.events(available_spots);
CREATE INDEX idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX idx_events_deleted_at ON public.events(deleted_at);

-- Composite index for date range queries
CREATE INDEX idx_events_date_range ON public.events(start_date, end_date);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.events TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;
