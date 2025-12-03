-- Row Level Security Policies
-- This migration creates RLS policies for all tables to enforce data access rules

-- ============================================================================
-- USERS_PROFILES POLICIES
-- Users can read/update their own profile
-- ============================================================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
  ON public.users_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON public.users_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Anonymous users can view basic profile info (for public listings)
CREATE POLICY "Anonymous users can view profiles"
  ON public.users_profiles
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- BOOKINGS POLICIES
-- Users can read/update their own bookings
-- ============================================================================

-- Policy: Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own bookings
CREATE POLICY "Users can create own bookings"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own bookings
CREATE POLICY "Users can update own bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookings (cancel)
CREATE POLICY "Users can delete own bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- REVIEWS POLICIES
-- Users can create/update their own reviews, all can read
-- ============================================================================

-- Policy: Everyone can view reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy: Users can create their own reviews
CREATE POLICY "Users can create own reviews"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- SAVED_ITEMS POLICIES
-- Users can manage their own saved items
-- ============================================================================

-- Policy: Users can view their own saved items
CREATE POLICY "Users can view own saved items"
  ON public.saved_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own saved items
CREATE POLICY "Users can create own saved items"
  ON public.saved_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own saved items
CREATE POLICY "Users can update own saved items"
  ON public.saved_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own saved items
CREATE POLICY "Users can delete own saved items"
  ON public.saved_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- LISTING TABLES POLICIES (dining_venues, accommodations, events, transport_options, flights)
-- All can read, admins can write
-- Note: Admin role checking will be implemented via custom claims or a separate admin table
-- For now, we'll allow authenticated users to write (can be restricted later)
-- ============================================================================

-- DINING_VENUES POLICIES
-- Policy: Everyone can view non-deleted dining venues
CREATE POLICY "Anyone can view active dining venues"
  ON public.dining_venues
  FOR SELECT
  TO authenticated, anon
  USING (deleted_at IS NULL);

-- Policy: Authenticated users can create dining venues
CREATE POLICY "Authenticated users can create dining venues"
  ON public.dining_venues
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update dining venues
CREATE POLICY "Authenticated users can update dining venues"
  ON public.dining_venues
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can soft-delete dining venues
CREATE POLICY "Authenticated users can delete dining venues"
  ON public.dining_venues
  FOR DELETE
  TO authenticated
  USING (true);

-- ACCOMMODATIONS POLICIES
-- Policy: Everyone can view non-deleted accommodations
CREATE POLICY "Anyone can view active accommodations"
  ON public.accommodations
  FOR SELECT
  TO authenticated, anon
  USING (deleted_at IS NULL);

-- Policy: Authenticated users can create accommodations
CREATE POLICY "Authenticated users can create accommodations"
  ON public.accommodations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update accommodations
CREATE POLICY "Authenticated users can update accommodations"
  ON public.accommodations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can soft-delete accommodations
CREATE POLICY "Authenticated users can delete accommodations"
  ON public.accommodations
  FOR DELETE
  TO authenticated
  USING (true);

-- EVENTS POLICIES
-- Policy: Everyone can view non-deleted events
CREATE POLICY "Anyone can view active events"
  ON public.events
  FOR SELECT
  TO authenticated, anon
  USING (deleted_at IS NULL);

-- Policy: Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update events
CREATE POLICY "Authenticated users can update events"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can soft-delete events
CREATE POLICY "Authenticated users can delete events"
  ON public.events
  FOR DELETE
  TO authenticated
  USING (true);

-- TRANSPORT_OPTIONS POLICIES
-- Policy: Everyone can view transport options
CREATE POLICY "Anyone can view transport options"
  ON public.transport_options
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy: Authenticated users can create transport options
CREATE POLICY "Authenticated users can create transport options"
  ON public.transport_options
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update transport options
CREATE POLICY "Authenticated users can update transport options"
  ON public.transport_options
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete transport options
CREATE POLICY "Authenticated users can delete transport options"
  ON public.transport_options
  FOR DELETE
  TO authenticated
  USING (true);

-- FLIGHTS POLICIES
-- Policy: Everyone can view flights
CREATE POLICY "Anyone can view flights"
  ON public.flights
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy: Authenticated users can create flights
CREATE POLICY "Authenticated users can create flights"
  ON public.flights
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update flights
CREATE POLICY "Authenticated users can update flights"
  ON public.flights
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete flights
CREATE POLICY "Authenticated users can delete flights"
  ON public.flights
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- SAFETY_INFORMATION POLICIES
-- All can read, authenticated users can write
-- ============================================================================

-- Policy: Everyone can view safety information
CREATE POLICY "Anyone can view safety information"
  ON public.safety_information
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy: Authenticated users can create safety information
CREATE POLICY "Authenticated users can create safety information"
  ON public.safety_information
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update safety information
CREATE POLICY "Authenticated users can update safety information"
  ON public.safety_information
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete safety information
CREATE POLICY "Authenticated users can delete safety information"
  ON public.safety_information
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- SAFETY_REPORTS POLICIES
-- Users can create their own reports, admins can read all
-- For now, users can read their own reports
-- ============================================================================

-- Policy: Users can view their own safety reports
CREATE POLICY "Users can view own safety reports"
  ON public.safety_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own safety reports
CREATE POLICY "Users can create own safety reports"
  ON public.safety_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own safety reports
CREATE POLICY "Users can update own safety reports"
  ON public.safety_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own safety reports
CREATE POLICY "Users can delete own safety reports"
  ON public.safety_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- ADMIN HELPER FUNCTION
-- This function checks if a user has admin role
-- Note: This requires setting up custom claims in Supabase Auth
-- For now, it returns false - implement admin logic later
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has admin role in their JWT claims
  -- This will be implemented when admin system is set up
  -- For now, return false to maintain security
  RETURN (
    COALESCE(
      current_setting('request.jwt.claims', true)::json->>'role',
      ''
    ) = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Users can view own profile" ON public.users_profiles IS 
  'Allows authenticated users to view their own profile data';

COMMENT ON POLICY "Users can view own bookings" ON public.bookings IS 
  'Allows authenticated users to view only their own bookings';

COMMENT ON POLICY "Anyone can view reviews" ON public.reviews IS 
  'Allows all users (authenticated and anonymous) to read reviews';

COMMENT ON POLICY "Users can view own saved items" ON public.saved_items IS 
  'Allows authenticated users to view only their own saved items';

COMMENT ON POLICY "Anyone can view active dining venues" ON public.dining_venues IS 
  'Allows all users to view non-deleted dining venues';

COMMENT ON POLICY "Users can view own safety reports" ON public.safety_reports IS 
  'Allows authenticated users to view only their own safety reports';

COMMENT ON FUNCTION public.is_admin() IS 
  'Helper function to check if current user has admin role. Returns false by default until admin system is implemented.';
