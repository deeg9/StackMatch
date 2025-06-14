-- Check if proposals table exists and what columns it has
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('proposals', 'seller_profiles', 'profiles')
ORDER BY table_name, ordinal_position;

-- Check RLS policies on proposals table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'proposals';

-- Check if proposals table exists at all
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'proposals'
) as proposals_table_exists;

-- Check seller_profiles structure
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'seller_profiles'
ORDER BY ordinal_position;
