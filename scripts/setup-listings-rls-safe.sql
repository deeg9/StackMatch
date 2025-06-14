-- Safe RLS setup that checks for existing policies first

-- Enable RLS on listings table if not already enabled
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
    -- Drop and recreate seller read policy
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listings' AND policyname = 'Sellers can read all active listings') THEN
        DROP POLICY "Sellers can read all active listings" ON listings;
    END IF;
    
    CREATE POLICY "Sellers can read all active listings" ON listings
        FOR SELECT 
        TO authenticated
        USING (status = 'ACTIVE');

    -- Drop and recreate buyer policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listings' AND policyname = 'Buyers can read their own listings') THEN
        DROP POLICY "Buyers can read their own listings" ON listings;
    END IF;
    
    CREATE POLICY "Buyers can read their own listings" ON listings
        FOR SELECT 
        TO authenticated
        USING (buyer_id = auth.uid());

    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listings' AND policyname = 'Buyers can insert their own listings') THEN
        DROP POLICY "Buyers can insert their own listings" ON listings;
    END IF;
    
    CREATE POLICY "Buyers can insert their own listings" ON listings
        FOR INSERT 
        TO authenticated
        WITH CHECK (buyer_id = auth.uid());

    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listings' AND policyname = 'Buyers can update their own listings') THEN
        DROP POLICY "Buyers can update their own listings" ON listings;
    END IF;
    
    CREATE POLICY "Buyers can update their own listings" ON listings
        FOR UPDATE 
        TO authenticated
        USING (buyer_id = auth.uid())
        WITH CHECK (buyer_id = auth.uid());

    RAISE NOTICE 'RLS policies updated successfully for listings table';
END $$;

-- Ensure proposals table has proper RLS for sellers
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Sellers can read all proposals
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'proposals' AND policyname = 'Sellers can read all proposals') THEN
        DROP POLICY "Sellers can read all proposals" ON proposals;
    END IF;
    
    CREATE POLICY "Sellers can read all proposals" ON proposals
        FOR SELECT 
        TO authenticated
        USING (true);

    -- Sellers can insert their own proposals
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'proposals' AND policyname = 'Sellers can insert their own proposals') THEN
        DROP POLICY "Sellers can insert their own proposals" ON proposals;
    END IF;
    
    CREATE POLICY "Sellers can insert their own proposals" ON proposals
        FOR INSERT 
        TO authenticated
        WITH CHECK (seller_id IN (
            SELECT id FROM seller_profiles WHERE user_id = auth.uid()
        ));

    RAISE NOTICE 'RLS policies updated successfully for proposals table';
END $$;

-- Check current policies
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
WHERE tablename IN ('listings', 'proposals')
ORDER BY tablename, policyname;
