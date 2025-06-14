-- Fix Deal Room Files Schema Migration
-- This script adds missing columns and ensures proper structure

DO $$
BEGIN
    -- Check and add timeline column to listings table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = 'timeline'
    ) THEN
        ALTER TABLE listings ADD COLUMN timeline JSONB DEFAULT NULL;
        RAISE NOTICE 'Added timeline column to listings table';
    ELSE
        RAISE NOTICE 'Timeline column already exists in listings table';
    END IF;

    -- Check and add attachments column to listings table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = 'attachments'
    ) THEN
        ALTER TABLE listings ADD COLUMN attachments JSONB DEFAULT NULL;
        RAISE NOTICE 'Added attachments column to listings table';
    ELSE
        RAISE NOTICE 'Attachments column already exists in listings table';
    END IF;

    -- Check and add attachments column to proposals table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'proposals' AND column_name = 'attachments'
    ) THEN
        ALTER TABLE proposals ADD COLUMN attachments JSONB DEFAULT NULL;
        RAISE NOTICE 'Added attachments column to proposals table';
    ELSE
        RAISE NOTICE 'Attachments column already exists in proposals table';
    END IF;

    -- Verify deal_room_files table structure
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'deal_room_files') THEN
        CREATE TABLE deal_room_files (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
            uploader_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size_bytes BIGINT NOT NULL DEFAULT 0,
            mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
            type TEXT NOT NULL DEFAULT 'OTHER',
            description TEXT,
            version INTEGER NOT NULL DEFAULT 1,
            parent_file_id UUID REFERENCES deal_room_files(id) ON DELETE CASCADE,
            is_latest BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        -- Add indexes for performance
        CREATE INDEX idx_deal_room_files_deal_room_id ON deal_room_files(deal_room_id);
        CREATE INDEX idx_deal_room_files_uploader_id ON deal_room_files(uploader_id);
        CREATE INDEX idx_deal_room_files_is_latest ON deal_room_files(is_latest);
        CREATE INDEX idx_deal_room_files_parent_file_id ON deal_room_files(parent_file_id);
        
        RAISE NOTICE 'Created deal_room_files table with indexes';
    ELSE
        RAISE NOTICE 'deal_room_files table already exists';
        
        -- Check for missing columns in existing table
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'deal_room_files' AND column_name = 'version'
        ) THEN
            ALTER TABLE deal_room_files ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
            RAISE NOTICE 'Added version column to deal_room_files table';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'deal_room_files' AND column_name = 'parent_file_id'
        ) THEN
            ALTER TABLE deal_room_files ADD COLUMN parent_file_id UUID REFERENCES deal_room_files(id) ON DELETE CASCADE;
            RAISE NOTICE 'Added parent_file_id column to deal_room_files table';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'deal_room_files' AND column_name = 'is_latest'
        ) THEN
            ALTER TABLE deal_room_files ADD COLUMN is_latest BOOLEAN NOT NULL DEFAULT true;
            RAISE NOTICE 'Added is_latest column to deal_room_files table';
        END IF;
    END IF;

    -- Enable RLS on deal_room_files if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'deal_room_files' AND rowsecurity = true
    ) THEN
        ALTER TABLE deal_room_files ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on deal_room_files table';
    END IF;

    -- Create RLS policies for deal_room_files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'deal_room_files' AND policyname = 'deal_room_files_select_policy'
    ) THEN
        CREATE POLICY deal_room_files_select_policy ON deal_room_files
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM deal_room_participants drp
                WHERE drp.deal_room_id = deal_room_files.deal_room_id
                AND drp.user_id = auth.uid()
            )
        );
        RAISE NOTICE 'Created SELECT policy for deal_room_files';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'deal_room_files' AND policyname = 'deal_room_files_insert_policy'
    ) THEN
        CREATE POLICY deal_room_files_insert_policy ON deal_room_files
        FOR INSERT WITH CHECK (
            uploader_id = auth.uid() AND
            EXISTS (
                SELECT 1 FROM deal_room_participants drp
                WHERE drp.deal_room_id = deal_room_files.deal_room_id
                AND drp.user_id = auth.uid()
            )
        );
        RAISE NOTICE 'Created INSERT policy for deal_room_files';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'deal_room_files' AND policyname = 'deal_room_files_delete_policy'
    ) THEN
        CREATE POLICY deal_room_files_delete_policy ON deal_room_files
        FOR DELETE USING (uploader_id = auth.uid());
        RAISE NOTICE 'Created DELETE policy for deal_room_files';
    END IF;

END $$;

-- Final verification query
SELECT 
    'listings' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND column_name IN ('timeline', 'attachments')

UNION ALL

SELECT 
    'proposals' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'proposals' 
AND column_name = 'attachments'

UNION ALL

SELECT 
    'deal_room_files' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'deal_room_files'
ORDER BY table_name, column_name;
