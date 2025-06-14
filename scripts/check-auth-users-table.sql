-- Check if auth.users table exists and its structure
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    AND table_name = 'users'
) as auth_users_table_exists;

-- If auth.users table exists, show its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users' 
ORDER BY ordinal_position;
