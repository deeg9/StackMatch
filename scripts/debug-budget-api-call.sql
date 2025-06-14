-- Debug script to check Christopher's buyer profile ID and budget data

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

-- 2. Check budget data for Christopher
SELECT 
    'Christopher Budget Data' as data_type,
    bb.id as budget_id,
    bb.project_name,
    bb.allocated_budget,
    bb.spent_amount,
    bb.remaining_budget,
    bb.start_date,
    bb.end_date,
    bb.buyer_profile_id
FROM buyer_budgets bb
JOIN buyer_profiles bp ON bb.buyer_profile_id = bp.id
WHERE bp.user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';

-- 3. Check expense data for Christopher
SELECT 
    'Christopher Expense Data' as data_type,
    be.expense_name,
    be.amount,
    be.category,
    be.expense_date,
    bb.project_name as budget_project,
    be.buyer_profile_id
FROM buyer_expenses be
JOIN buyer_budgets bb ON be.budget_id = bb.id
JOIN buyer_profiles bp ON be.buyer_profile_id = bp.id
WHERE bp.user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
ORDER BY be.expense_date DESC;
