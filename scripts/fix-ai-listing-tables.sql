-- Fix AI listing tables if needed

-- Check if ai_enhancements table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_enhancements') THEN
        -- Create the table
        CREATE TABLE ai_enhancements (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            conversation_id UUID NOT NULL REFERENCES listing_conversations(id) ON DELETE CASCADE,
            field_name TEXT NOT NULL,
            original_value TEXT,
            enhanced_value TEXT NOT NULL,
            enhancement_type TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            
            -- Add metadata column for additional info
            metadata JSONB DEFAULT '{}'::jsonb
        );

        -- Create indexes
        CREATE INDEX idx_ai_enhancements_conversation_id ON ai_enhancements(conversation_id);
        CREATE INDEX idx_ai_enhancements_field_name ON ai_enhancements(field_name);
        CREATE INDEX idx_ai_enhancements_created_at ON ai_enhancements(created_at);

        -- Enable RLS
        ALTER TABLE ai_enhancements ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY "Users can view their own enhancements" ON ai_enhancements
            FOR SELECT USING (
                auth.uid() IN (
                    SELECT user_id FROM listing_conversations 
                    WHERE id = conversation_id
                )
            );

        CREATE POLICY "Users can insert their own enhancements" ON ai_enhancements
            FOR INSERT WITH CHECK (
                auth.uid() IN (
                    SELECT user_id FROM listing_conversations 
                    WHERE id = conversation_id
                )
            );

        -- Grant permissions
        GRANT ALL ON ai_enhancements TO authenticated;

        RAISE NOTICE 'Created ai_enhancements table with RLS policies';
    ELSE
        RAISE NOTICE 'ai_enhancements table already exists';
    END IF;
END
$$;

-- Check if user_id in listing_conversations is NOT NULL
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'listing_conversations' 
        AND column_name = 'user_id' 
        AND is_nullable = 'YES'
    ) THEN
        -- Fix the user_id column to be NOT NULL
        ALTER TABLE listing_conversations 
        ALTER COLUMN user_id SET NOT NULL;
        
        RAISE NOTICE 'Fixed user_id column to be NOT NULL';
    ELSE
        RAISE NOTICE 'user_id column is already NOT NULL';
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

-- Check RLS policies
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'listing_conversations';
