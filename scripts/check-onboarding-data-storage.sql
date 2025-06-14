-- Check what data is currently in buyer_profiles
SELECT COUNT(*) as total_buyer_profiles FROM buyer_profiles;

-- Sample buyer profile data to see current structure
SELECT * FROM buyer_profiles LIMIT 3;

-- Check for any onboarding-related tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND (table_name LIKE '%onboard%' OR table_name LIKE '%buyer%')
ORDER BY table_name;

-- Check if user_preferences table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_preferences'
) as user_preferences_exists;

-- If user_preferences exists, check its structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_preferences' 
    AND table_schema = 'public'
ORDER BY ordinal_position;
