-- Add the correct seller as a participant to the deal room
INSERT INTO deal_room_participants (
  deal_room_id,
  user_id,
  role,
  joined_at
)
SELECT 
  '15dcb8b3-2a2d-435b-b559-1f199e653034' as deal_room_id,
  'f4af36b4-43f2-4e4f-98c3-024021bc3227' as user_id,
  'SELLER' as role,
  NOW() as joined_at
WHERE NOT EXISTS (
  SELECT 1 FROM deal_room_participants 
  WHERE deal_room_id = '15dcb8b3-2a2d-435b-b559-1f199e653034' 
  AND user_id = 'f4af36b4-43f2-4e4f-98c3-024021bc3227'
);

-- Update the deal room to have the correct seller_id
UPDATE deal_rooms 
SET seller_id = 'f4af36b4-43f2-4e4f-98c3-024021bc3227'
WHERE id = '15dcb8b3-2a2d-435b-b559-1f199e653034';

-- Verify the fix
SELECT 
  dr.id as deal_room_id,
  dr.room_name,
  dr.buyer_id,
  dr.seller_id,
  dr.status,
  COUNT(drp.id) as participant_count,
  STRING_AGG(drp.role, ', ') as participant_roles,
  STRING_AGG(drp.user_id, ', ') as participant_user_ids
FROM deal_rooms dr
LEFT JOIN deal_room_participants drp ON dr.id = drp.deal_room_id
WHERE dr.id = '15dcb8b3-2a2d-435b-b559-1f199e653034'
GROUP BY dr.id, dr.room_name, dr.buyer_id, dr.seller_id, dr.status;
