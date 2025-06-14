-- Check if buyer_profiles table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'buyer_profiles'
ORDER BY ordinal_position;

-- Check if there are any existing buyer_profiles
SELECT COUNT(*) as buyer_profiles_count FROM buyer_profiles;

-- Show any existing buyer_profiles
SELECT * FROM buyer_profiles LIMIT 5;
