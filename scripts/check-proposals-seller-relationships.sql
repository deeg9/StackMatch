-- Check foreign key constraints for proposals and seller_profiles
SELECT 
    'PROPOSALS_FOREIGN_KEYS' as section,
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
    AND tc.table_name = 'proposals'
    AND tc.table_schema = 'public'

UNION ALL

SELECT 
    'SELLER_PROFILES_FOREIGN_KEYS' as section,
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
    AND tc.table_name = 'seller_profiles'
    AND tc.table_schema = 'public'

UNION ALL

-- Check proposals table structure
SELECT 
    'PROPOSALS_STRUCTURE' as section,
    column_name as constraint_name,
    'proposals' as table_name,
    data_type as column_name,
    CASE WHEN is_nullable = 'YES' THEN 'nullable' ELSE 'not_null' END as foreign_table_name,
    column_default as foreign_column_name
FROM information_schema.columns 
WHERE table_name = 'proposals' 
    AND table_schema = 'public'
    AND column_name IN ('id', 'seller_id', 'user_id')

UNION ALL

-- Check seller_profiles table structure  
SELECT 
    'SELLER_PROFILES_STRUCTURE' as section,
    column_name as constraint_name,
    'seller_profiles' as table_name,
    data_type as column_name,
    CASE WHEN is_nullable = 'YES' THEN 'nullable' ELSE 'not_null' END as foreign_table_name,
    column_default as foreign_column_name
FROM information_schema.columns 
WHERE table_name = 'seller_profiles' 
    AND table_schema = 'public'
    AND column_name IN ('id', 'user_id', 'seller_id')

ORDER BY section, constraint_name;
