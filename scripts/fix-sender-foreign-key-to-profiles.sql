-- Add foreign key constraint to profiles table instead of auth.users
-- This is the correct approach for Supabase

-- First, make sure sender_id is NOT NULL
ALTER TABLE deal_room_messages 
ALTER COLUMN sender_id SET NOT NULL;

-- Add foreign key constraint to profiles table
ALTER TABLE deal_room_messages 
ADD CONSTRAINT fk_deal_room_messages_sender_profiles 
FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Verify the constraint was added
SELECT 'Foreign key constraint to profiles added successfully' as status;

-- Show all foreign keys on deal_room_messages
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'deal_room_messages'
ORDER BY kcu.column_name;
