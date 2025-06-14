-- Create deal_room_messages table
CREATE TABLE IF NOT EXISTS deal_room_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('USER', 'SYSTEM')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'TEXT' CHECK (message_type IN ('TEXT', 'FILE', 'MILESTONE', 'SYSTEM')),
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- Create deal_room_documents table
CREATE TABLE IF NOT EXISTS deal_room_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  document_type TEXT NOT NULL CHECK (document_type IN ('SCOPE', 'PROPOSAL', 'CONTRACT', 'MILESTONE', 'OTHER')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deal_room_messages_deal_room_id ON deal_room_messages(deal_room_id);
CREATE INDEX IF NOT EXISTS idx_deal_room_messages_created_at ON deal_room_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_deal_room_documents_deal_room_id ON deal_room_documents(deal_room_id);
CREATE INDEX IF NOT EXISTS idx_deal_room_documents_type ON deal_room_documents(document_type);

-- Enable RLS
ALTER TABLE deal_room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_room_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for deal_room_messages
CREATE POLICY "Users can view messages in their deal rooms" ON deal_room_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM deal_rooms dr 
      WHERE dr.id = deal_room_messages.deal_room_id 
      AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their deal rooms" ON deal_room_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM deal_rooms dr 
      WHERE dr.id = deal_room_messages.deal_room_id 
      AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
    )
  );

-- RLS policies for deal_room_documents
CREATE POLICY "Users can view documents in their deal rooms" ON deal_room_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM deal_rooms dr 
      WHERE dr.id = deal_room_documents.deal_room_id 
      AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert documents in their deal rooms" ON deal_room_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM deal_rooms dr 
      WHERE dr.id = deal_room_documents.deal_room_id 
      AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can update documents in their deal rooms" ON deal_room_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM deal_rooms dr 
      WHERE dr.id = deal_room_documents.deal_room_id 
      AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
    )
  );
