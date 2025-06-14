-- Add RLS policies for deal_room_participants table
-- Users can see participants in deal rooms they are part of

-- Policy 1: Users can see participants in deal rooms where they are also participants
CREATE POLICY "Users can view participants in their deal rooms" ON deal_room_participants
FOR SELECT
USING (
  deal_room_id IN (
    SELECT deal_room_id 
    FROM deal_room_participants 
    WHERE user_id = auth.uid()
  )
);

-- Policy 2: Users can insert themselves as participants (for deal room creation)
CREATE POLICY "Users can insert themselves as participants" ON deal_room_participants
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy 3: Users can update their own participant records
CREATE POLICY "Users can update their own participant records" ON deal_room_participants
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Verify the policies were created
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'deal_room_participants';
