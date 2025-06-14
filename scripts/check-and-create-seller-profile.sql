-- Step 1: Check if Diego has a seller profile
SELECT 
  sp.id as seller_profile_id,
  sp.user_id,
  p.full_name,
  p.email,
  p.user_type
FROM profiles p
LEFT JOIN seller_profiles sp ON p.id = sp.user_id
WHERE p.id = 'bc6d4653-f0e5-4f10-ba4e-10c81aed0b9e';

-- Step 2: Create seller profile for Diego if it doesn't exist
INSERT INTO seller_profiles (
  user_id,
  business_type,
  company_description,
  years_experience,
  hourly_rate_min,
  hourly_rate_max,
  availability_status,
  created_at,
  updated_at
)
SELECT 
  'bc6d4653-f0e5-4f10-ba4e-10c81aed0b9e',
  'individual',
  'Experienced software developer and consultant',
  5,
  50,
  150,
  'available',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM seller_profiles 
  WHERE user_id = 'bc6d4653-f0e5-4f10-ba4e-10c81aed0b9e'
);

-- Step 3: Verify seller profile was created
SELECT 
  sp.id as seller_profile_id,
  sp.user_id,
  p.full_name,
  p.email,
  sp.business_type,
  sp.availability_status
FROM seller_profiles sp
JOIN profiles p ON sp.user_id = p.id
WHERE sp.user_id = 'bc6d4653-f0e5-4f10-ba4e-10c81aed0b9e';
