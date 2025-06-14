-- Add default value for created_at column
ALTER TABLE deal_room_messages 
ALTER COLUMN created_at SET DEFAULT NOW();

-- Also add default for updated_at if it doesn't have one
ALTER TABLE deal_room_messages 
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'deal_room_messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;
