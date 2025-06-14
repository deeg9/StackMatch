-- Check what participant records already exist
SELECT 
  dr.id as deal_room_id,
  dr.room_name,
  dr.buyer_id,
  dr.seller_id,
  dr.status as deal_room_status,
  drp.user_id as participant_user_id,
  drp.role as participant_role,
  drp.joined_at,
  CASE 
    WHEN drp.user_id = dr.buyer_id THEN 'BUYER_MATCH'
    WHEN drp.user_id = dr.seller_id THEN 'SELLER_MATCH'
    ELSE 'NO_MATCH'
  END as role_consistency
FROM deal_rooms dr
LEFT JOIN deal_room_participants drp ON dr.id = drp.deal_room_id
ORDER BY dr.created_at, drp.joined_at;

-- Also check if there are any users without proper participant records
SELECT 
  dr.id as deal_room_id,
  dr.room_name,
  'BUYER' as missing_role,
  dr.buyer_id as missing_user_id
FROM deal_rooms dr
WHERE dr.buyer_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM deal_room_participants drp 
    WHERE drp.deal_room_id = dr.id 
      AND drp.user_id = dr.buyer_id
  )

UNION ALL

SELECT 
  dr.id as deal_room_id,
  dr.room_name,
  'SELLER' as missing_role,
  dr.seller_id as missing_user_id
FROM deal_rooms dr
WHERE dr.seller_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM deal_room_participants drp 
    WHERE drp.deal_room_id = dr.id 
      AND drp.user_id = dr.seller_id
  );
