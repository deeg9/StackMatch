-- Add column to track who added each participant
ALTER TABLE deal_room_participants 
ADD COLUMN IF NOT EXISTS added_by UUID REFERENCES profiles(id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_deal_room_participants_added_by 
ON deal_room_participants(added_by);

-- Update existing participants to show they were added by the system
UPDATE deal_room_participants 
SET added_by = (
  SELECT CASE 
    WHEN role = 'BUYER' THEN (SELECT buyer_id FROM deal_rooms WHERE id = deal_room_participants.deal_room_id)
    WHEN role = 'SELLER' THEN (SELECT seller_id FROM deal_rooms WHERE id = deal_room_participants.deal_room_id)
    ELSE NULL
  END
)
WHERE added_by IS NULL;
