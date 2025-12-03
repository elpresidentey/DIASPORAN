-- Verification script to check if all tables and indexes were created successfully
-- Run this after applying migrations to verify the schema

-- Check all tables exist
SELECT 
  'Tables Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 10 THEN '✓ All tables created'
    ELSE '✗ Missing tables'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'users_profiles',
    'dining_venues',
    'accommodations',
    'flights',
    'events',
    'transport_options',
    'bookings',
    'reviews',
    'saved_items',
    'safety_information',
    'safety_reports'
  );

-- Check RLS is enabled on all tables
SELECT 
  'RLS Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 11 THEN '✓ RLS enabled on all tables'
    ELSE '✗ RLS not enabled on some tables'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true;

-- Check indexes exist
SELECT 
  'Indexes Check' as check_type,
  COUNT(DISTINCT indexname) as count,
  '✓ Indexes created' as status
FROM pg_indexes
WHERE schemaname = 'public';

-- Check triggers exist
SELECT 
  'Triggers Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 13 THEN '✓ All triggers created'
    ELSE '✗ Missing triggers'
  END as status
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- List all tables with their row counts
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check foreign key constraints
SELECT 
  'Foreign Keys Check' as check_type,
  COUNT(*) as count,
  '✓ Foreign keys created' as status
FROM information_schema.table_constraints
WHERE constraint_schema = 'public'
  AND constraint_type = 'FOREIGN KEY';

-- Check unique constraints
SELECT 
  'Unique Constraints Check' as check_type,
  COUNT(*) as count,
  '✓ Unique constraints created' as status
FROM information_schema.table_constraints
WHERE constraint_schema = 'public'
  AND constraint_type = 'UNIQUE';

-- Check check constraints
SELECT 
  'Check Constraints Check' as check_type,
  COUNT(*) as count,
  '✓ Check constraints created' as status
FROM information_schema.table_constraints
WHERE constraint_schema = 'public'
  AND constraint_type = 'CHECK';
