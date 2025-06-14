-- Debug script to check Christopher's buyer profile ID and budget data with correct column names

-- 1. Check Christopher's buyer profile ID
SELECT 
    'Christopher Buyer Profile ID' as data_type,
    id as buyer_profile_id,
    user_id,
    industry,
    company_size,
    created_at
FROM buyer_profiles 
WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';

-- 2. Check if buyer_budgets table exists and its structure
SELECT 
    'Buyer Budgets Table Check' as data_type,
    COUNT(*) as record_count
FROM buyer_budgets;

-- 3. Check expense data for Christopher (using actual column names)
SELECT 
    'Christopher Expense Data' as data_type,
    be.expense_name,
    be.amount,
    be.category,
    be.expense_date,
    be.description,
    be.buyer_profile_id,
    be.budget_id
FROM buyer_expenses be
JOIN buyer_profiles bp ON be.buyer_profile_id = bp.id
WHERE bp.user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
ORDER BY be.expense_date DESC;

-- 4. Check budget data for Christopher (if the table has different columns)
SELECT 
    'Christopher Budget Data' as data_type,
    bb.*
FROM buyer_budgets bb
JOIN buyer_profiles bp ON bb.buyer_profile_id = bp.id
WHERE bp.user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';
