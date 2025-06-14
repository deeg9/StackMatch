-- Check if deal_room_files table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'deal_room_files') THEN
        -- Create deal_room_files table
        CREATE TABLE deal_room_files (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
            uploader_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size_bytes BIGINT NOT NULL,
            mime_type TEXT NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('CONTRACT', 'SCOPE_DOCUMENT', 'DELIVERABLE', 'INVOICE', 'OTHER')),
            description TEXT,
            version INTEGER NOT NULL DEFAULT 1,
            parent_file_id UUID REFERENCES deal_room_files(id) ON DELETE CASCADE,
            is_latest BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Add indexes for performance
        CREATE INDEX idx_deal_room_files_deal_room_id ON deal_room_files(deal_room_id);
        CREATE INDEX idx_deal_room_files_uploader_id ON deal_room_files(uploader_id);
        CREATE INDEX idx_deal_room_files_parent_file_id ON deal_room_files(parent_file_id);

        -- Add RLS policies
        ALTER TABLE deal_room_files ENABLE ROW LEVEL SECURITY;

        -- Users can only see files from deal rooms they participate in
        CREATE POLICY "Users can view files from their deal rooms" ON deal_room_files
            FOR SELECT USING (
                deal_room_id IN (
                    SELECT deal_room_id FROM deal_room_participants 
                    WHERE user_id = auth.uid()
                )
            );

        -- Users can upload files to deal rooms they participate in
        CREATE POLICY "Users can upload files to their deal rooms" ON deal_room_files
            FOR INSERT WITH CHECK (
                deal_room_id IN (
                    SELECT deal_room_id FROM deal_room_participants 
                    WHERE user_id = auth.uid()
                )
            );

        -- Users can only delete their own files
        CREATE POLICY "Users can delete their own files" ON deal_room_files
            FOR DELETE USING (uploader_id = auth.uid());

        RAISE NOTICE 'deal_room_files table created successfully with indexes and RLS policies';
    ELSE
        RAISE NOTICE 'deal_room_files table already exists';
    END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'deal_room_files'
ORDER BY ordinal_position;
