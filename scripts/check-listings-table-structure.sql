-- Check the actual structure of the listings table
DO $$
BEGIN
    RAISE NOTICE 'Checking listings table structure...';
END $$;

-- Check if listings table exists and get its columns
SELECT 
    'LISTINGS_TABLE_STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'listings'
ORDER BY ordinal_position;

-- Check foreign keys from listings table
SELECT 
    'LISTINGS_FOREIGN_KEYS' as section,
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
AND tc.table_name = 'listings'
AND tc.table_schema = 'public';

-- Check if buyer_profiles table exists and its structure
SELECT 
    'BUYER_PROFILES_STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'buyer_profiles'
ORDER BY ordinal_position;
