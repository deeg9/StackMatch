-- First, let's check what columns exist in deal_rooms table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'deal_rooms' 
ORDER BY ordinal_position;

-- Check what triggers exist on deal_rooms
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'deal_rooms';

-- Add the missing updated_at column to deal_rooms table
ALTER TABLE deal_rooms 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing records to have the updated_at timestamp
UPDATE deal_rooms 
SET updated_at = created_at 
WHERE updated_at IS NULL;
