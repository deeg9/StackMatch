-- Find all tables that might be related to listings
SELECT 
    'ALL_TABLES' as section,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
    table_name LIKE '%listing%' OR 
    table_name LIKE '%project%' OR
    table_name LIKE '%job%' OR
    table_name LIKE '%request%'
)
ORDER BY table_name;

-- Check deal_rooms table structure to see what it references
SELECT 
    'DEAL_ROOMS_STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'deal_rooms'
ORDER BY ordinal_position;

-- Check foreign keys from deal_rooms to see what it references
SELECT 
    'DEAL_ROOMS_FOREIGN_KEYS' as section,
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
AND tc.table_name = 'deal_rooms'
AND tc.table_schema = 'public';
