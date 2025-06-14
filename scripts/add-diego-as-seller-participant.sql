-- Now that we've fixed the updated_at column issue, let's add Diego as a seller participant

-- Step 1: Add Diego (user_id) as a SELLER participant in the deal room
INSERT INTO deal_room_participants (
  deal_room_id,
  user_id,
  role,
  joined_at
)
VALUES (
  '15dcb8b3-2a2d-435b-b559-1f199e653034',
  'bc6d4653-f0e5-4f10-ba4e-10c81aed0b9e',  -- Diego's user_id from profiles table
  'SELLER',
  NOW()
) ON CONFLICT (deal_room_id, user_id) DO NOTHING;

-- Step 2: Update the deal room to have Diego as the seller (using his user_id)
UPDATE deal_rooms 
SET seller_id = 'bc6d4653-f0e5-4f10-ba4e-10c81aed0b9e'
WHERE id = '15dcb8b3-2a2d-435b-b559-1f199e653034';

-- Step 3: Verify the fix - should now show both buyer and seller as participants
SELECT 
  dr.id as deal_room_id,
  dr.room_name,
  buyer_profile.full_name as buyer_name,
  seller_profile.full_name as seller_name,
  dr.status,
  COUNT(drp.id) as participant_count,
  STRING_AGG(drp.role, ', ' ORDER BY drp.role) as participant_roles,
  STRING_AGG(participant_profile.full_name, ', ' ORDER BY drp.role) as participant_names
FROM deal_rooms dr
LEFT JOIN deal_room_participants drp ON dr.id = drp.deal_room_id
LEFT JOIN profiles buyer_profile ON dr.buyer_id = buyer_profile.id
LEFT JOIN profiles seller_profile ON dr.seller_id = seller_profile.id
LEFT JOIN profiles participant_profile ON drp.user_id = participant_profile.id
WHERE dr.id = '15dcb8b3-2a2d-435b-b559-1f199e653034'
GROUP BY dr.id, dr.room_name, buyer_profile.full_name, seller_profile.full_name, dr.status;
