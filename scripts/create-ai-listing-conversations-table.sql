-- Create the listing_conversations table for AI listing functionality
CREATE TABLE IF NOT EXISTS listing_conversations (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listing_conversations_user_id ON listing_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_listing_conversations_session_id ON listing_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_listing_conversations_updated_at ON listing_conversations(updated_at);

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
GRANT USAGE ON SCHEMA public TO authenticated;
