-- Phase 1.3: Check Deal Room Files Table Structure

-- Check if deal_room_files table exists
SELECT COUNT(*) as deal_room_files_exists
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'deal_room_files';

-- If it exists, show its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'deal_room_files'
ORDER BY ordinal_position;

-- Check foreign key relationships for deal_room_files
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name='deal_room_files';

-- Check current files in deal_room_files for our deal room
SELECT COUNT(*) as current_deal_room_files
FROM deal_room_files 
WHERE deal_room_id = '15dcb8b3-2a2d-435b-b559-1f199e653034';
