-- First, let's see what proposals and listings we have to work with
SELECT 
  p.id as proposal_id,
  p.seller_id,
  p.listing_id,
  l.buyer_id,
  l.title as listing_title,
  buyer_profile.full_name as buyer_name,
  seller_profile.full_name as seller_name
FROM proposals p
JOIN listings l ON p.listing_id = l.id
LEFT JOIN profiles buyer_profile ON l.buyer_id = buyer_profile.id
LEFT JOIN profiles seller_profile ON p.seller_id = seller_profile.id
WHERE p.id = '1a75e713'
ORDER BY p.created_at DESC;
