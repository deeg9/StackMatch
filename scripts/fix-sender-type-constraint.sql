-- Drop the existing constraint and recreate it with the correct values
ALTER TABLE deal_room_messages 
DROP CONSTRAINT IF EXISTS deal_room_messages_sender_type_check;

-- Add the correct constraint with the enum values we found
ALTER TABLE deal_room_messages 
ADD CONSTRAINT deal_room_messages_sender_type_check 
CHECK (sender_type IN ('text', 'file', 'system'));

-- Verify the constraint was created
SELECT 
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'deal_room_messages' 
    AND tc.constraint_type = 'CHECK'
    AND tc.table_schema = 'public'
    AND tc.constraint_name LIKE '%sender_type%';
