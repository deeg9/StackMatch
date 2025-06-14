-- Add missing foreign key constraints for deal room related tables
-- This version checks for actual column existence before creating constraints

-- 1. Add foreign key from deal_room_participants.user_id to profiles.id
DO $$
BEGIN
    -- Check if the column exists and foreign key doesn't already exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'deal_room_participants' 
        AND column_name = 'user_id' 
        AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deal_room_participants_user_id_fkey'
        AND table_name = 'deal_room_participants'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE deal_room_participants 
        ADD CONSTRAINT deal_room_participants_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: deal_room_participants.user_id -> profiles.id';
    ELSE
        RAISE NOTICE 'Skipped deal_room_participants.user_id foreign key (column missing or constraint exists)';
    END IF;
END $$;

-- 2. Add foreign key from deal_room_messages.sender_id to profiles.id
DO $$
BEGIN
    -- Check if the column exists and foreign key doesn't already exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'deal_room_messages' 
        AND column_name = 'sender_id' 
        AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deal_room_messages_sender_id_fkey'
        AND table_name = 'deal_room_messages'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE deal_room_messages 
        ADD CONSTRAINT deal_room_messages_sender_id_fkey 
        FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: deal_room_messages.sender_id -> profiles.id';
    ELSE
        RAISE NOTICE 'Skipped deal_room_messages.sender_id foreign key (column missing or constraint exists)';
    END IF;
END $$;

-- 3. Add foreign key from deal_room_files.uploader_id to profiles.id (checking different possible column names)
DO $$
BEGIN
    -- Check for uploader_id column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'deal_room_files' 
        AND column_name = 'uploader_id' 
        AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deal_room_files_uploader_id_fkey'
        AND table_name = 'deal_room_files'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE deal_room_files 
        ADD CONSTRAINT deal_room_files_uploader_id_fkey 
        FOREIGN KEY (uploader_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: deal_room_files.uploader_id -> profiles.id';
    -- Check for uploaded_by column
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'deal_room_files' 
        AND column_name = 'uploaded_by' 
        AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deal_room_files_uploaded_by_fkey'
        AND table_name = 'deal_room_files'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE deal_room_files 
        ADD CONSTRAINT deal_room_files_uploaded_by_fkey 
        FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: deal_room_files.uploaded_by -> profiles.id';
    -- Check for user_id column
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'deal_room_files' 
        AND column_name = 'user_id' 
        AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deal_room_files_user_id_fkey'
        AND table_name = 'deal_room_files'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE deal_room_files 
        ADD CONSTRAINT deal_room_files_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: deal_room_files.user_id -> profiles.id';
    ELSE
        RAISE NOTICE 'Skipped deal_room_files foreign key (no suitable column found or constraint exists)';
    END IF;
END $$;

-- 4. Add foreign key from deal_room_activities.user_id to profiles.id
DO $$
BEGIN
    -- Check if the column exists and foreign key doesn't already exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'deal_room_activities' 
        AND column_name = 'user_id' 
        AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deal_room_activities_user_id_fkey'
        AND table_name = 'deal_room_activities'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE deal_room_activities 
        ADD CONSTRAINT deal_room_activities_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key: deal_room_activities.user_id -> profiles.id';
    ELSE
        RAISE NOTICE 'Skipped deal_room_activities.user_id foreign key (column missing or constraint exists)';
    END IF;
END $$;

-- 5. Verify what foreign keys were actually created
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
