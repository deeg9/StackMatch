-- Add missing foreign key constraints for deal room related tables

-- 1. First, let's check if the profiles table has the right structure
DO $$
BEGIN
    -- Check if profiles.id exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'id' 
        AND table_schema = 'public'
    ) THEN
        RAISE EXCEPTION 'profiles.id column does not exist!';
    END IF;
    
    RAISE NOTICE 'profiles.id column exists - proceeding with foreign key creation';
END $$;

-- 2. Add foreign key from deal_room_participants.user_id to profiles.id
DO $$
BEGIN
    -- Check if foreign key already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deal_room_participants_user_id_fkey'
        AND table_name = 'deal_room_participants'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE deal_room_participants 
        ADD CONSTRAINT deal_room_participants_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: deal_room_participants.user_id -> profiles.id';
    ELSE
        RAISE NOTICE 'Foreign key deal_room_participants_user_id_fkey already exists';
    END IF;
END $$;

-- 3. Add foreign key from deal_room_messages.sender_id to profiles.id
DO $$
BEGIN
    -- Check if foreign key already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deal_room_messages_sender_id_fkey'
        AND table_name = 'deal_room_messages'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE deal_room_messages 
        ADD CONSTRAINT deal_room_messages_sender_id_fkey 
        FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: deal_room_messages.sender_id -> profiles.id';
    ELSE
        RAISE NOTICE 'Foreign key deal_room_messages_sender_id_fkey already exists';
    END IF;
END $$;

-- 4. Add foreign key from deal_room_files.uploaded_by to profiles.id
DO $$
BEGIN
    -- Check if foreign key already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deal_room_files_uploaded_by_fkey'
        AND table_name = 'deal_room_files'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE deal_room_files 
        ADD CONSTRAINT deal_room_files_uploaded_by_fkey 
        FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: deal_room_files.uploaded_by -> profiles.id';
    ELSE
        RAISE NOTICE 'Foreign key deal_room_files_uploaded_by_fkey already exists';
    END IF;
END $$;

-- 5. Add foreign key from deal_room_activities.user_id to profiles.id
DO $$
BEGIN
    -- Check if foreign key already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deal_room_activities_user_id_fkey'
        AND table_name = 'deal_room_activities'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE deal_room_activities 
        ADD CONSTRAINT deal_room_activities_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: deal_room_activities.user_id -> profiles.id';
    ELSE
        RAISE NOTICE 'Foreign key deal_room_activities_user_id_fkey already exists';
    END IF;
END $$;

-- 6. Verify all foreign keys were created
SELECT 
    'VERIFICATION' as section,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('deal_room_participants', 'deal_room_messages', 'deal_room_files', 'deal_room_activities')
    AND ccu.table_name = 'profiles'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;
