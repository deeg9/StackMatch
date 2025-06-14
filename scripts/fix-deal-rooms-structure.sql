-- First, let's check what columns exist in the deal_rooms table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'deal_rooms' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are any existing deal rooms
SELECT COUNT(*) as existing_deal_rooms FROM deal_rooms;

-- Check the exact structure of deal_rooms table
\d deal_rooms;

-- Let's see what the current table looks like
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'deal_rooms'
ORDER BY ordinal_position;
