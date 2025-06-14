-- Check current foreign key constraints on proposals table
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='proposals';

-- Check if seller_profiles table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'seller_profiles'
) as seller_profiles_exists;

-- Check if proposals.seller_id references seller_profiles.id (simplified query)
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
    AND tc.table_schema = ccu.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'proposals' 
    AND kcu.column_name = 'seller_id';

-- Add the foreign key constraint if it doesn't exist
DO $$
BEGIN
    -- Check if the foreign key constraint exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu 
            ON tc.constraint_name = ccu.constraint_name
            AND tc.table_schema = ccu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'proposals' 
            AND kcu.column_name = 'seller_id'
            AND ccu.table_name = 'seller_profiles'
            AND ccu.column_name = 'id'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE public.proposals 
        ADD CONSTRAINT fk_proposals_seller_id 
        FOREIGN KEY (seller_id) REFERENCES public.seller_profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added foreign key constraint: proposals.seller_id -> seller_profiles.id';
    ELSE
        RAISE NOTICE 'Foreign key constraint already exists: proposals.seller_id -> seller_profiles.id';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error adding foreign key constraint: %', SQLERRM;
END $$;

-- Verify the constraint was added
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='proposals'
    AND kcu.column_name = 'seller_id';
