-- Create deal_room_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS deal_room_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    message_type VARCHAR(50) DEFAULT 'text',
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deal_room_messages_deal_room_id ON deal_room_messages(deal_room_id);
CREATE INDEX IF NOT EXISTS idx_deal_room_messages_sender_id ON deal_room_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_deal_room_messages_created_at ON deal_room_messages(created_at);

-- Enable RLS
ALTER TABLE deal_room_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for deal_room_messages
DROP POLICY IF EXISTS "Users can view messages in their deal rooms" ON deal_room_messages;
DROP POLICY IF EXISTS "Users can insert messages in their deal rooms" ON deal_room_messages;

CREATE POLICY "Users can view messages in their deal rooms" ON deal_room_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM deal_room_participants 
            WHERE deal_room_participants.deal_room_id = deal_room_messages.deal_room_id 
            AND deal_room_participants.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in their deal rooms" ON deal_room_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM deal_room_participants 
            WHERE deal_room_participants.deal_room_id = deal_room_messages.deal_room_id 
            AND deal_room_participants.user_id = auth.uid()
        )
    );

-- Grant permissions
GRANT ALL ON deal_room_messages TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
