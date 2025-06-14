-- Check the structure of the budget and expense tables

-- 1. Check if buyer_budgets table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'buyer_budgets'
) AS buyer_budgets_exists;

-- 2. Check columns in buyer_budgets table
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'buyer_budgets'
ORDER BY 
    ordinal_position;

-- 3. Check if buyer_expenses table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'buyer_expenses'
) AS buyer_expenses_exists;

-- 4. Check columns in buyer_expenses table
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'buyer_expenses'
ORDER BY 
    ordinal_position;
