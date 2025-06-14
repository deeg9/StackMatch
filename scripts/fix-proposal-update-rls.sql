-- Check current RLS policies for proposals
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'proposals' 
AND cmd = 'UPDATE'
ORDER BY policyname;

-- Check if there are any conflicting policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has WHERE clause: ' || qual
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK: ' || with_check
        ELSE 'No restrictions'
    END as policy_details
FROM pg_policies 
WHERE tablename = 'proposals'
ORDER BY cmd, policyname;

-- Drop any conflicting update policies that might be too restrictive
DROP POLICY IF EXISTS "Sellers can update their own proposals" ON proposals;
DROP POLICY IF EXISTS "Sellers can update their own proposals via seller_id" ON proposals;

-- Create a comprehensive update policy for sellers
CREATE POLICY "Sellers can update their own proposals comprehensive" ON proposals
    FOR UPDATE 
    TO authenticated
    USING (
        seller_id IN (
            SELECT sp.id 
            FROM seller_profiles sp 
            WHERE sp.user_id = auth.uid()
        )
    )
    WITH CHECK (
        seller_id IN (
            SELECT sp.id 
            FROM seller_profiles sp 
            WHERE sp.user_id = auth.uid()
        )
    );

-- Verify the new policy was created
SELECT 
    policyname, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'proposals' 
AND cmd = 'UPDATE'
AND policyname = 'Sellers can update their own proposals comprehensive';

-- Test the policy by checking if the user can see their proposal
SELECT 
    'Policy test' as test_type,
    COUNT(*) as accessible_proposals
FROM proposals 
WHERE seller_id = 'f4af36b4-43f2-4e4f-98c3-024021bc3227';
