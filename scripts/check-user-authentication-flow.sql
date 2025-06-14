-- Check profiles table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if profiles table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
) as profiles_exists;

-- Check user_type field and its values
SELECT DISTINCT user_type, COUNT(*) as count
FROM profiles 
GROUP BY user_type;

-- Check relationship between auth.users and profiles
SELECT 
    p.id,
    p.user_type,
    p.email,
    p.full_name,
    au.email as auth_email
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
LIMIT 5;
