-- Phase 1.2: Analyze the Specific Listing
-- Query files for listing: 02af5e91-c15f-4f52-8bc4-f71488c6efab

-- First, let's see what the listings table structure looks like
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'listings'
ORDER BY ordinal_position;

-- Check if there are any file-related columns in listings table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'listings'
AND (
  column_name LIKE '%file%' OR 
  column_name LIKE '%attachment%' OR 
  column_name LIKE '%document%'
);

-- Look for the specific listing
SELECT id, title, description, created_at, buyer_id
FROM listings 
WHERE id = '02af5e91-c15f-4f52-8bc4-f71488c6efab';

-- Check if there's a separate listing_files table
SELECT COUNT(*) as listing_files_table_exists
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'listing_files';
