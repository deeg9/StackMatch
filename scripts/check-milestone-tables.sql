-- Check if milestone-related tables exist and their relationships

-- 1. Check if deal_room_milestones table exists
SELECT 
    'MILESTONE_TABLE_CHECK' as section,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE '%milestone%'
    AND table_schema = 'public'
ORDER BY table_name;

-- 2. Check if milestones table exists (referenced in foreign keys)
SELECT 
    'MILESTONES_TABLE_CHECK' as section,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'milestones'
    AND table_schema = 'public';

-- 3. Check foreign keys that reference milestones
SELECT 
    'MILESTONE_FOREIGN_KEYS' as section,
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
    AND (ccu.table_name LIKE '%milestone%' OR tc.table_name LIKE '%milestone%')
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- 4. Check what tables actually exist that start with 'deal_room_'
SELECT 
    'DEAL_ROOM_TABLES' as section,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE 'deal_room_%'
    AND table_schema = 'public'
ORDER BY table_name;
