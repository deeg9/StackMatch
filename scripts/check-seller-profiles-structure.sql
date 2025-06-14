-- Step 1: Check the actual structure of seller_profiles table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'seller_profiles' 
ORDER BY ordinal_position;

-- Step 2: Check if Diego has a seller profile
SELECT 
  sp.*,
  p.full_name,
  p.email
FROM profiles p
LEFT JOIN seller_profiles sp ON p.id = sp.user_id
WHERE p.id = 'bc6d4653-f0e5-4f10-ba4e-10c81aed0b9e';
