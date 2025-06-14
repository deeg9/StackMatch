-- Clean up duplicate RLS policies on listing_conversations table

-- Drop duplicate policies (keep the "their own" versions)
DROP POLICY IF EXISTS "Users can view own conversations" ON listing_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON listing_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON listing_conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON listing_conversations;

-- Verify remaining policies
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'listing_conversations'
ORDER BY policyname;
