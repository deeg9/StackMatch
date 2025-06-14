-- Check the actual structure of all deal room related tables

-- 1. Check deal_room_participants structure
SELECT 
    'DEAL_ROOM_PARTICIPANTS' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'deal_room_participants' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check deal_room_messages structure
SELECT 
    'DEAL_ROOM_MESSAGES' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'deal_room_messages' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check deal_room_files structure
SELECT 
    'DEAL_ROOM_FILES' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'deal_room_files' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check deal_room_activities structure
SELECT 
    'DEAL_ROOM_ACTIVITIES' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'deal_room_activities' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Check if these tables exist at all
SELECT 
    'TABLE_EXISTS_CHECK' as check_type,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name IN ('deal_room_participants', 'deal_room_messages', 'deal_room_files', 'deal_room_activities')
    AND table_schema = 'public'
ORDER BY table_name;

-- 6. Check existing foreign keys for these tables
SELECT 
    'EXISTING_FOREIGN_KEYS' as section,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('deal_room_participants', 'deal_room_messages', 'deal_room_files', 'deal_room_activities')
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;
