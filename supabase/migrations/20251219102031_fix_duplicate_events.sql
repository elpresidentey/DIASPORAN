-- Fix duplicate events in Supabase database
-- This migration removes duplicate events keeping only the first occurrence of each unique title

-- Delete duplicates, keeping only the first record for each title
DELETE FROM public.events 
WHERE id NOT IN (
    SELECT DISTINCT ON (title) id 
    FROM public.events 
    ORDER BY title, created_at ASC
);