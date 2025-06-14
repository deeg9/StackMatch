-- Check foreign key constraints for deal_room_participants and users
SELECT 
    'PARTICIPANTS_FOREIGN_KEYS' as section,
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
    AND tc.table_name = 'deal_room_participants'
    AND tc.table_schema = 'public'

UNION ALL

-- Check if users table exists
SELECT 
    'USERS_TABLE_CHECK' as section,
    'users_table_exists' as constraint_name,
    table_name,
    'exists' as column_name,
    table_schema as foreign_table_name,
    table_type as foreign_column_name
FROM information_schema.tables 
WHERE table_name = 'users' 
    AND table_schema = 'public'

UNION ALL

-- Check if profiles table exists (might be used instead of users)
SELECT 
    'PROFILES_TABLE_CHECK' as section,
    'profiles_table_exists' as constraint_name,
    table_name,
    'exists' as column_name,
    table_schema as foreign_table_name,
    table_type as foreign_column_name
FROM information_schema.tables 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'

UNION ALL

-- Check deal_room_participants structure
SELECT 
    'PARTICIPANTS_STRUCTURE' as section,
    column_name as constraint_name,
    'deal_room_participants' as table_name,
    data_type as column_name,
    CASE WHEN is_nullable = 'YES' THEN 'nullable' ELSE 'not_null' END as foreign_table_name,
    column_default as foreign_column_name
FROM information_schema.columns 
WHERE table_name = 'deal_room_participants' 
    AND table_schema = 'public'
    AND column_name IN ('id', 'user_id', 'deal_room_id')

ORDER BY section, constraint_name;
