-- Fix all circular references in deal room related table policies
-- The problem is that many related tables have policies that reference deal_rooms
-- which creates infinite recursion when querying deal_rooms

-- First, let's drop all the problematic policies that reference deal_rooms in EXISTS clauses

-- Fix deal_room_files policies
DROP POLICY IF EXISTS "Users can view files in their deal rooms" ON deal_room_files;
DROP POLICY IF EXISTS "Allow select access based on deal room" ON deal_room_files;
DROP POLICY IF EXISTS "Allow insert access for deal room members" ON deal_room_files;
DROP POLICY IF EXISTS "Allow update access for uploader or deal room members" ON deal_room_files;
DROP POLICY IF EXISTS "Allow delete access for uploader or deal room members" ON deal_room_files;

-- Fix deal_room_messages policies  
DROP POLICY IF EXISTS "Users can view messages in their deal rooms" ON deal_room_messages;
DROP POLICY IF EXISTS "Users can insert messages in their deal rooms" ON deal_room_messages;
DROP POLICY IF EXISTS "deal_room_messages_select_policy" ON deal_room_messages;
DROP POLICY IF EXISTS "deal_room_messages_insert_policy" ON deal_room_messages;

-- Fix deal_room_documents policies
DROP POLICY IF EXISTS "Users can view documents in their deal rooms" ON deal_room_documents;
DROP POLICY IF EXISTS "Users can insert documents in their deal rooms" ON deal_room_documents;
DROP POLICY IF EXISTS "Users can update documents in their deal rooms" ON deal_room_documents;
DROP POLICY IF EXISTS "deal_room_documents_select_policy" ON deal_room_documents;
DROP POLICY IF EXISTS "deal_room_documents_insert_policy" ON deal_room_documents;
DROP POLICY IF EXISTS "deal_room_documents_update_policy" ON deal_room_documents;

-- Fix deal_room_activities policies
DROP POLICY IF EXISTS "Users can view activities in their deal rooms" ON deal_room_activities;

-- Fix contracts policies that reference deal_rooms
DROP POLICY IF EXISTS "Allow select access based on deal room" ON contracts;
DROP POLICY IF EXISTS "Allow insert access based on deal room" ON contracts;
DROP POLICY IF EXISTS "Allow update access based on deal room" ON contracts;
DROP POLICY IF EXISTS "Allow delete access based on deal room" ON contracts;

-- Now create simple, non-circular policies for these tables
-- These policies will use direct participant checks instead of referencing deal_rooms

-- deal_room_files policies (using deal_room_participants directly)
CREATE POLICY "Files access via participants" ON deal_room_files
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = deal_room_files.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Files insert via participants" ON deal_room_files
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = deal_room_files.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Files update via participants" ON deal_room_files
FOR UPDATE
USING (
  uploader_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = deal_room_files.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Files delete via participants" ON deal_room_files
FOR DELETE
USING (
  uploader_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = deal_room_files.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

-- deal_room_messages policies
CREATE POLICY "Messages access via participants" ON deal_room_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = deal_room_messages.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Messages insert via participants" ON deal_room_messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = deal_room_messages.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

-- deal_room_documents policies
CREATE POLICY "Documents access via participants" ON deal_room_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = deal_room_documents.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Documents insert via participants" ON deal_room_documents
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = deal_room_documents.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Documents update via participants" ON deal_room_documents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = deal_room_documents.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

-- deal_room_activities policies
CREATE POLICY "Activities access via participants" ON deal_room_activities
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = deal_room_activities.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

-- contracts policies (if the table exists)
CREATE POLICY "Contracts access via participants" ON contracts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = contracts.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Contracts insert via participants" ON contracts
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = contracts.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Contracts update via participants" ON contracts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE deal_room_participants.deal_room_id = contracts.deal_room_id 
    AND deal_room_participants.user_id = auth.uid()
  )
);

-- Verify the fix by checking for any remaining circular references
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE qual LIKE '%deal_rooms%' 
AND tablename != 'deal_rooms'
ORDER BY tablename, cmd;
