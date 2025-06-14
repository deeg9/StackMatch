-- Get the exact column names and types for buyer_profiles table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'buyer_profiles'
ORDER BY ordinal_position;
