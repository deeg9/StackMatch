-- Check if there are ANY users in auth.users
SELECT COUNT(*) as user_count FROM auth.users;

-- Show a sample of users if any exist (only safe fields)
SELECT id, email, role, email_confirmed_at, last_sign_in_at, created_at
FROM auth.users
LIMIT 5;
