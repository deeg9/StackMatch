-- First, let's see what policies exist and then drop problematic ones
-- Drop any policies that might cause infinite recursion on deal_rooms table

-- Common problematic patterns to look for and fix:
-- 1. Policies that reference the same table they're applied to
-- 2. Policies that create circular dependencies

-- Drop all existing policies on deal_rooms to start fresh
DROP POLICY IF EXISTS "Users can view their deal rooms" ON deal_rooms;
DROP POLICY IF EXISTS "Users can view deal rooms they participate in" ON deal_rooms;
DROP POLICY IF EXISTS "Buyers can view their deal rooms" ON deal_rooms;
DROP POLICY IF EXISTS "Sellers can view their deal rooms" ON deal_rooms;
DROP POLICY IF EXISTS "Users can access their deal rooms" ON deal_rooms;
DROP POLICY IF EXISTS "Deal room access policy" ON deal_rooms;
DROP POLICY IF EXISTS "Users can view deal rooms where they are participants" ON deal_rooms;

-- Create a simple, non-recursive policy for deal_rooms
-- This allows users to see deal rooms where they are either the buyer or seller
CREATE POLICY "Simple deal room access" ON deal_rooms
FOR SELECT
USING (
  buyer_id = auth.uid() OR seller_id = auth.uid()
);

-- Allow users to insert deal rooms (for creating new ones)
CREATE POLICY "Users can create deal rooms" ON deal_rooms
FOR INSERT
WITH CHECK (
  buyer_id = auth.uid() OR seller_id = auth.uid()
);

-- Allow users to update deal rooms they're part of
CREATE POLICY "Users can update their deal rooms" ON deal_rooms
FOR UPDATE
USING (
  buyer_id = auth.uid() OR seller_id = auth.uid()
)
WITH CHECK (
  buyer_id = auth.uid() OR seller_id = auth.uid()
);

-- Verify the new policies
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'deal_rooms'
ORDER BY cmd, policyname;
