-- Phase 1: Investigation & Analysis
-- Check current table structures and relationships

-- 1.1: Check listings table structure
SELECT 
    'LISTINGS TABLE STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check buyer_profiles table structure
SELECT 
    'BUYER_PROFILES TABLE STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'buyer_profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 1.2: Check existing foreign key constraints
SELECT 
    'EXISTING FOREIGN KEYS' as section,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND (tc.table_name = 'listings' OR tc.table_name = 'buyer_profiles')
ORDER BY tc.table_name, kcu.column_name;

-- Check if listings.buyer_id exists and what it references
SELECT 
    'LISTINGS BUYER_ID ANALYSIS' as section,
    COUNT(*) as total_listings,
    COUNT(buyer_id) as listings_with_buyer_id,
    COUNT(DISTINCT buyer_id) as unique_buyer_ids
FROM listings;

-- Check if buyer_profiles exist for all buyer_ids in listings
SELECT 
    'DATA CONSISTENCY CHECK' as section,
    l.buyer_id,
    bp.user_id as buyer_profile_exists,
    CASE 
        WHEN bp.user_id IS NULL THEN 'MISSING_BUYER_PROFILE'
        ELSE 'OK'
    END as status
FROM listings l
LEFT JOIN buyer_profiles bp ON l.buyer_id = bp.user_id
ORDER BY l.buyer_id;

-- Summary of potential issues
SELECT 
    'SUMMARY' as section,
    'Total listings without buyer profiles' as issue,
    COUNT(*) as count
FROM listings l
LEFT JOIN buyer_profiles bp ON l.buyer_id = bp.user_id
WHERE bp.user_id IS NULL;
