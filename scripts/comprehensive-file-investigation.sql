-- Comprehensive File System Investigation
-- This script will help us understand where files might be stored

-- 1. Check deal_room_files table structure and content
SELECT 'deal_room_files_structure' as investigation_step;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'deal_room_files' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Count files in deal_room_files
SELECT 'deal_room_files_count' as investigation_step;
SELECT COUNT(*) as total_files FROM deal_room_files;

-- 3. Check if listing_files table exists and its structure
SELECT 'listing_files_check' as investigation_step;
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'listing_files'
) as table_exists;

-- 4. Check listings table for file-related columns
SELECT 'listings_file_columns' as investigation_step;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND table_schema = 'public'
AND (
    column_name ILIKE '%file%' OR 
    column_name ILIKE '%attachment%' OR 
    column_name ILIKE '%document%' OR
    column_name ILIKE '%upload%'
)
ORDER BY column_name;

-- 5. Check our specific listing for any file data
SELECT 'specific_listing_check' as investigation_step;
SELECT id, title, created_at, buyer_id
FROM listings 
WHERE id = '02af5e91-c15f-4f52-8bc4-f71488c6efab';

-- 6. Look for any tables that might contain file references
SELECT 'all_file_related_tables' as investigation_step;
SELECT table_name, table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
    table_name ILIKE '%file%' OR 
    table_name ILIKE '%attachment%' OR 
    table_name ILIKE '%document%' OR
    table_name ILIKE '%upload%' OR
    table_name ILIKE '%media%'
)
ORDER BY table_name;

-- 7. Check if files might be stored in a requirements or specifications table
SELECT 'requirements_tables' as investigation_step;
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
    table_name ILIKE '%requirement%' OR 
    table_name ILIKE '%specification%' OR 
    table_name ILIKE '%detail%'
)
ORDER BY table_name;

-- 8. Check proposals table for file references (since deal room was created from proposal)
SELECT 'proposal_file_check' as investigation_step;
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'proposals' 
AND table_schema = 'public'
AND (
    column_name ILIKE '%file%' OR 
    column_name ILIKE '%attachment%' OR 
    column_name ILIKE '%document%'
)
ORDER BY column_name;

-- 9. Check our specific proposal for file data
SELECT 'specific_proposal_check' as investigation_step;
SELECT id, listing_id, seller_id, created_at
FROM proposals 
WHERE id = '1a75e713-3f56-4603-9067-b997d05d8d07';
