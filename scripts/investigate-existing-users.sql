-- Check what users actually exist in profiles table
SELECT 
  id,
  email,
  full_name,
  user_type,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- Check if there are any seller profiles
SELECT 
  sp.user_id,
  p.email,
  p.full_name,
  p.user_type
FROM seller_profiles sp
JOIN profiles p ON sp.user_id = p.id;

-- Check the proposals and their seller references
SELECT 
  p.id as proposal_id,
  p.seller_id,
  p.listing_id,
  p.status,
  prof.email as seller_email,
  prof.full_name as seller_name
FROM proposals p
LEFT JOIN profiles prof ON p.seller_id = prof.id
ORDER BY p.created_at DESC;
