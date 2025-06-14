-- Simple query to get seller_profiles columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'seller_profiles'
ORDER BY ordinal_position;
