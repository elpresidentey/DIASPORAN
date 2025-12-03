-- Create bookings table
-- Stores all types of bookings (dining, accommodation, flight, event, transport)

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

-- Create indexes for frequently queried columns
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_booking_type ON public.bookings(booking_type);
CREATE INDEX idx_bookings_reference_id ON public.bookings(reference_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_start_date ON public.bookings(start_date);
CREATE INDEX idx_bookings_end_date ON public.bookings(end_date);
CREATE INDEX idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at);

-- Composite indexes for common queries
CREATE INDEX idx_bookings_user_status ON public.bookings(user_id, status);
CREATE INDEX idx_bookings_user_type ON public.bookings(user_id, booking_type);
CREATE INDEX idx_bookings_type_reference ON public.bookings(booking_type, reference_id);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
