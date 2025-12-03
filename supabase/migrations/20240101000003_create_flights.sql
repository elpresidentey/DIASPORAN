-- Create flights table
-- Stores information about available flights

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

-- Create indexes for frequently queried columns
CREATE INDEX idx_flights_origin_airport ON public.flights(origin_airport);
CREATE INDEX idx_flights_destination_airport ON public.flights(destination_airport);
CREATE INDEX idx_flights_departure_time ON public.flights(departure_time);
CREATE INDEX idx_flights_arrival_time ON public.flights(arrival_time);
CREATE INDEX idx_flights_airline ON public.flights(airline);
CREATE INDEX idx_flights_price ON public.flights(price);
CREATE INDEX idx_flights_class_type ON public.flights(class_type);
CREATE INDEX idx_flights_available_seats ON public.flights(available_seats);

-- Composite index for common search patterns
CREATE INDEX idx_flights_route_date ON public.flights(origin_airport, destination_airport, departure_time);

-- Enable Row Level Security
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_flights_updated_at
  BEFORE UPDATE ON public.flights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.flights TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.flights TO authenticated;
