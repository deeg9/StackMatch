-- Check if there are ANY profiles in the profiles table
SELECT COUNT(*) as profile_count FROM profiles;

-- Show a sample of profiles if any exist
SELECT * FROM profiles LIMIT 5;
