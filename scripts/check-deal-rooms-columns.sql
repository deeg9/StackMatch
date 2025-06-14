-- Get all columns in deal_rooms table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'deal_rooms'
ORDER BY ordinal_position;
