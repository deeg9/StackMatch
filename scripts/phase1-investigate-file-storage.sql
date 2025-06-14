-- Phase 1.1: Investigate Current File Storage Tables
-- Check what tables exist for file storage

-- Check for file-related tables
SELECT table_name, table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
  table_name LIKE '%file%' OR 
  table_name LIKE '%attachment%' OR 
  table_name LIKE '%document%' OR
  table_name LIKE '%upload%'
)
ORDER BY table_name;

-- Check for listing-related file tables
SELECT table_name, table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%listing%'
ORDER BY table_name;

-- Check deal room files table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'deal_room_files'
ORDER BY ordinal_position;
