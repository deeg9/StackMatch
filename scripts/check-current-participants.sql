-- Check current deal room participants to see what's missing
SELECT 
  dr.id as deal_room_id,
  dr.room_name,
  dr.buyer_id,
  dr.seller_id,
  dr.status,
  COUNT(drp.id) as participant_count,
  STRING_AGG(drp.role, ', ') as participant_roles,
  STRING_AGG(drp.user_id::text, ', ') as participant_user_ids
FROM deal_rooms dr
LEFT JOIN deal_room_participants drp ON dr.id = drp.deal_room_id
GROUP BY dr.id, dr.room_name, dr.buyer_id, dr.seller_id, dr.status
ORDER BY dr.created_at DESC;
