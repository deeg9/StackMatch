-- Populate missing participant records for existing deal rooms
-- This script ensures every deal room has proper buyer and seller participant records

-- First, let's see what we're working with
SELECT 
  dr.id as deal_room_id,
  dr.room_name,
  dr.buyer_id,
  dr.seller_id,
  dr.status,
  COUNT(drp.id) as participant_count
FROM deal_rooms dr
LEFT JOIN deal_room_participants drp ON dr.id = drp.deal_room_id
GROUP BY dr.id, dr.room_name, dr.buyer_id, dr.seller_id, dr.status
ORDER BY dr.created_at;

-- Insert missing buyer participants
INSERT INTO deal_room_participants (deal_room_id, user_id, role, joined_at)
SELECT 
  dr.id as deal_room_id,
  dr.buyer_id as user_id,
  'buyer' as role,
  dr.created_at as joined_at
FROM deal_rooms dr
WHERE dr.buyer_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 
    FROM deal_room_participants drp 
    WHERE drp.deal_room_id = dr.id 
      AND drp.user_id = dr.buyer_id 
      AND drp.role = 'buyer'
  );

-- Insert missing seller participants  
INSERT INTO deal_room_participants (deal_room_id, user_id, role, joined_at)
SELECT 
  dr.id as deal_room_id,
  dr.seller_id as user_id,
  'seller' as role,
  dr.created_at as joined_at
FROM deal_rooms dr
WHERE dr.seller_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 
    FROM deal_room_participants drp 
    WHERE drp.deal_room_id = dr.id 
      AND drp.user_id = dr.seller_id 
      AND drp.role = 'seller'
  );

-- Verify the results
SELECT 
  dr.id as deal_room_id,
  dr.room_name,
  dr.buyer_id,
  dr.seller_id,
  COUNT(drp.id) as participant_count,
  STRING_AGG(drp.role, ', ') as roles
FROM deal_rooms dr
LEFT JOIN deal_room_participants drp ON dr.id = drp.deal_room_id
GROUP BY dr.id, dr.room_name, dr.buyer_id, dr.seller_id
ORDER BY dr.created_at;
