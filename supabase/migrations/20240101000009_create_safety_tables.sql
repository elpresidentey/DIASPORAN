-- Create safety_information table
-- Stores safety guidelines and emergency contacts by location

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

-- Create indexes for frequently queried columns
CREATE INDEX idx_safety_information_country ON public.safety_information(country);
CREATE INDEX idx_safety_information_city ON public.safety_information(city);
CREATE INDEX idx_safety_information_category ON public.safety_information(category);
CREATE INDEX idx_safety_information_safety_level ON public.safety_information(safety_level);
CREATE INDEX idx_safety_information_last_updated ON public.safety_information(last_updated);

-- Composite index for location-based queries
CREATE INDEX idx_safety_information_location ON public.safety_information(country, city);

-- Enable Row Level Security
ALTER TABLE public.safety_information ENABLE ROW LEVEL SECURITY;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_safety_information_updated_at
  BEFORE UPDATE ON public.safety_information
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create safety_reports table
-- Stores user-submitted safety concerns and incidents

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

-- Create indexes for frequently queried columns
CREATE INDEX idx_safety_reports_user_id ON public.safety_reports(user_id);
CREATE INDEX idx_safety_reports_location ON public.safety_reports(location);
CREATE INDEX idx_safety_reports_category ON public.safety_reports(category);
CREATE INDEX idx_safety_reports_severity ON public.safety_reports(severity);
CREATE INDEX idx_safety_reports_status ON public.safety_reports(status);
CREATE INDEX idx_safety_reports_created_at ON public.safety_reports(created_at);

-- Spatial index for location-based queries
CREATE INDEX idx_safety_reports_coordinates ON public.safety_reports(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON public.safety_information TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.safety_information TO authenticated;

GRANT SELECT, INSERT ON public.safety_reports TO authenticated;
GRANT UPDATE, DELETE ON public.safety_reports TO authenticated;
