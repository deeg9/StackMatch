-- First, drop the problematic policies that are causing infinite recursion
DROP POLICY IF EXISTS "Users can view participants in their deal rooms" ON deal_room_participants;
DROP POLICY IF EXISTS "Users can view their own participations" ON deal_room_participants;
DROP POLICY IF EXISTS "Users can view their participations" ON deal_room_participants;

-- Create a simpler policy that doesn't cause recursion
-- This policy allows users to see ALL participants in deal rooms where they are either the buyer or seller
CREATE POLICY "View all deal room participants" ON deal_room_participants
FOR SELECT
USING (
  deal_room_id IN (
    SELECT id FROM deal_rooms 
    WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);

-- Keep the other policies for insert/update
-- Verify the policies were fixed
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'deal_room_participants';
