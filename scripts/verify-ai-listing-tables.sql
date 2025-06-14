-- Verify and create AI listing tables if they don't exist

-- Check if listing_conversations table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'listing_conversations') THEN
        -- Create the table
        CREATE TABLE listing_conversations (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            session_id TEXT NOT NULL,
            conversation_data JSONB DEFAULT '[]'::jsonb,
            form_state JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            
            -- Ensure unique session per user
            UNIQUE(user_id, session_id)
        );

        -- Create indexes
        CREATE INDEX idx_listing_conversations_user_id ON listing_conversations(user_id);
        CREATE INDEX idx_listing_conversations_session_id ON listing_conversations(session_id);
        CREATE INDEX idx_listing_conversations_updated_at ON listing_conversations(updated_at);

        -- Enable RLS
        ALTER TABLE listing_conversations ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY "Users can view their own conversations" ON listing_conversations
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own conversations" ON listing_conversations
            FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own conversations" ON listing_conversations
            FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own conversations" ON listing_conversations
            FOR DELETE USING (auth.uid() = user_id);

        -- Grant permissions
        GRANT ALL ON listing_conversations TO authenticated;

        RAISE NOTICE 'Created listing_conversations table with RLS policies';
    ELSE
        RAISE NOTICE 'listing_conversations table already exists';
    END IF;
END
$$;

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'listing_conversations'
ORDER BY ordinal_position;
