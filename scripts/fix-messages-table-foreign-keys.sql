-- First, let's see what we're working with
SELECT 'Checking current foreign keys...' as status;

-- Drop existing foreign key constraints if they exist
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- Find and drop existing foreign key constraints on sender_id
    FOR constraint_name IN 
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'deal_room_messages'
        AND kcu.column_name = 'sender_id'
    LOOP
        EXECUTE 'ALTER TABLE deal_room_messages DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- Make sender_id NOT NULL since every message must have a sender
ALTER TABLE deal_room_messages 
ALTER COLUMN sender_id SET NOT NULL;

-- Add foreign key constraint to auth.users (Supabase's built-in user table)
-- This is the correct table that Supabase uses for authentication
ALTER TABLE deal_room_messages 
ADD CONSTRAINT fk_deal_room_messages_sender 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Verify the constraint was added
SELECT 'Foreign key constraint added successfully' as status;

-- Show the current foreign keys
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
AND tc.table_name = 'deal_room_messages';
