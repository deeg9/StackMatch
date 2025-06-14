-- Add the missing room_name column to deal_rooms table
ALTER TABLE deal_rooms 
ADD COLUMN IF NOT EXISTS room_name TEXT;

-- Update existing deal rooms with a default room name if any exist
UPDATE deal_rooms 
SET room_name = COALESCE(
  (SELECT CONCAT(l.title, ' - Deal Room') 
   FROM listings l 
   WHERE l.id = deal_rooms.listing_id),
  'Deal Room'
)
WHERE room_name IS NULL;
