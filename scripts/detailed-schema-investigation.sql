-- ===================================
-- DETAILED SCHEMA INVESTIGATION
-- ===================================

-- 1. LISTINGS TABLE STRUCTURE
SELECT 
    'LISTINGS_STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. BUYER_PROFILES TABLE STRUCTURE  
SELECT 
    'BUYER_PROFILES_STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'buyer_profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. EXISTING FOREIGN KEY CONSTRAINTS
SELECT 
    'FOREIGN_KEYS' as section,
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
    AND (tc.table_name = 'listings' OR tc.table_name = 'buyer_profiles')
    AND tc.table_schema = 'public';

-- 4. CHECK IF BUYER_ID COLUMN EXISTS IN LISTINGS
SELECT 
    'BUYER_ID_CHECK' as section,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'listings' 
                AND column_name = 'buyer_id'
                AND table_schema = 'public'
        ) THEN 'buyer_id column EXISTS in listings table'
        ELSE 'buyer_id column MISSING from listings table'
    END as status;

-- 5. SAMPLE DATA CHECK
SELECT 
    'SAMPLE_DATA' as section,
    'listings' as table_name,
    COUNT(*) as total_records
FROM listings
UNION ALL
SELECT 
    'SAMPLE_DATA' as section,
    'buyer_profiles' as table_name,
    COUNT(*) as total_records
FROM buyer_profiles;
