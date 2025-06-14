-- First, let's see what data we have to understand which constraint to keep
SELECT 'Current proposals count:' as info, COUNT(*) as count FROM proposals;

-- Check if any proposals reference profiles.id directly
SELECT 'Proposals referencing profiles directly:' as info, COUNT(*) as count 
FROM proposals p 
WHERE EXISTS (SELECT 1 FROM profiles pr WHERE pr.id = p.seller_id);

-- Check if any proposals reference seller_profiles.id
SELECT 'Proposals referencing seller_profiles:' as info, COUNT(*) as count 
FROM proposals p 
WHERE EXISTS (SELECT 1 FROM seller_profiles sp WHERE sp.id = p.seller_id);

-- Drop the conflicting foreign key constraint that points to profiles
ALTER TABLE public.proposals 
DROP CONSTRAINT IF EXISTS proposals_seller_id_fkey;

-- Verify we only have the seller_profiles foreign key now
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
