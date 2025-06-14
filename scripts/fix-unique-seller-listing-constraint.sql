-- First, let's see what constraints exist
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'proposals'::regclass;

-- Drop the existing unique constraint that prevents multiple proposals
ALTER TABLE proposals DROP CONSTRAINT IF EXISTS unique_seller_listing;

-- Create a new partial unique index that only applies to non-withdrawn proposals
-- This allows multiple proposals per seller/listing as long as only one is active
CREATE UNIQUE INDEX unique_active_seller_listing 
ON proposals (seller_id, listing_id) 
WHERE status != 'WITHDRAWN';

-- Verify the new constraint
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'proposals' 
AND indexname = 'unique_active_seller_listing';
