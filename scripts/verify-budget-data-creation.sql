-- Verify that budget tables and data were created successfully

-- First, check if the tables exist at all
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('buyer_budgets', 'buyer_expenses')
ORDER BY table_name;

-- Check if there are any records in buyer_budgets (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'buyer_budgets') THEN
    RAISE NOTICE 'buyer_budgets table exists';
    PERFORM 1 FROM buyer_budgets LIMIT 1;
    RAISE NOTICE 'buyer_budgets has data: %', FOUND;
  ELSE
    RAISE NOTICE 'buyer_budgets table does NOT exist';
  END IF;
END $$;

-- Check if there are any records in buyer_expenses (if table exists)  
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'buyer_expenses') THEN
    RAISE NOTICE 'buyer_expenses table exists';
    PERFORM 1 FROM buyer_expenses LIMIT 1;
    RAISE NOTICE 'buyer_expenses has data: %', FOUND;
  ELSE
    RAISE NOTICE 'buyer_expenses table does NOT exist';
  END IF;
END $$;

-- Show Christopher's buyer profile ID for reference
SELECT 
  'Christopher Profile Info' as info_type,
  id as buyer_profile_id,
  user_id,
  industry,
  company_size
FROM buyer_profiles 
WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';
