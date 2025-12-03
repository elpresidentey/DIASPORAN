-- Create reviews table
-- Stores user reviews for listings

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

-- Create indexes for frequently queried columns
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX idx_reviews_listing_type ON public.reviews(listing_type);
CREATE INDEX idx_reviews_listing_id ON public.reviews(listing_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at);

-- Composite index for listing reviews
CREATE INDEX idx_reviews_listing ON public.reviews(listing_type, listing_id);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create trigger to automatically update updated_at
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
  -- Determine which table to update based on listing_type
  CASE COALESCE(NEW.listing_type, OLD.listing_type)
    WHEN 'dining' THEN table_name := 'dining_venues';
    WHEN 'accommodation' THEN table_name := 'accommodations';
    WHEN 'event' THEN table_name := 'events';
    ELSE RETURN COALESCE(NEW, OLD);
  END CASE;

  -- Calculate new average rating and count
  SELECT 
    COALESCE(AVG(rating), 0),
    COUNT(*)
  INTO avg_rating, review_count
  FROM public.reviews
  WHERE listing_type = COALESCE(NEW.listing_type, OLD.listing_type)
    AND listing_id = COALESCE(NEW.listing_id, OLD.listing_id);

  -- Update the listing table
  EXECUTE format(
    'UPDATE public.%I SET average_rating = $1, total_reviews = $2, updated_at = NOW() WHERE id = $3',
    table_name
  ) USING avg_rating, review_count, COALESCE(NEW.listing_id, OLD.listing_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update ratings on review changes
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

-- Grant permissions
GRANT SELECT ON public.reviews TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
