-- Create transport_options table
-- Stores information about transportation services

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

-- Create indexes for frequently queried columns
CREATE INDEX idx_transport_options_origin ON public.transport_options(origin);
CREATE INDEX idx_transport_options_destination ON public.transport_options(destination);
CREATE INDEX idx_transport_options_transport_type ON public.transport_options(transport_type);
CREATE INDEX idx_transport_options_provider ON public.transport_options(provider);
CREATE INDEX idx_transport_options_departure_time ON public.transport_options(departure_time);
CREATE INDEX idx_transport_options_price ON public.transport_options(price);
CREATE INDEX idx_transport_options_available_seats ON public.transport_options(available_seats);

-- Composite index for route searches
CREATE INDEX idx_transport_options_route ON public.transport_options(origin, destination);

-- Enable Row Level Security
ALTER TABLE public.transport_options ENABLE ROW LEVEL SECURITY;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_transport_options_updated_at
  BEFORE UPDATE ON public.transport_options
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.transport_options TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.transport_options TO authenticated;
