-- Let's see what proposal IDs actually look like
SELECT 
  id,
  seller_id,
  listing_id,
  status,
  created_at,
  SUBSTRING(id::text, 1, 8) as short_id
FROM proposals 
ORDER BY created_at DESC 
LIMIT 10;
