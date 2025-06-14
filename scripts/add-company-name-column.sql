-- Add the missing company_name column to buyer_profiles table

-- First, check if the column already exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'buyer_profiles' 
AND table_schema = 'public'
AND column_name = 'company_name';

-- Add the missing company_name column
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'buyer_profiles' 
AND table_schema = 'public'
AND column_name = 'company_name';
