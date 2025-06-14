-- Create sample budget and expense data for Christopher's buyer profile

-- First, let's create tables for budget tracking if they don't exist
CREATE TABLE IF NOT EXISTS buyer_budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_profile_id UUID REFERENCES buyer_profiles(id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  allocated_budget DECIMAL(12,2) NOT NULL,
  spent_amount DECIMAL(12,2) DEFAULT 0,
  remaining_budget DECIMAL(12,2) GENERATED ALWAYS AS (allocated_budget - spent_amount) STORED,
  budget_period VARCHAR(50) DEFAULT 'monthly',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buyer_expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_profile_id UUID REFERENCES buyer_profiles(id) ON DELETE CASCADE,
  budget_id UUID REFERENCES buyer_budgets(id) ON DELETE CASCADE,
  expense_name VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Get Christopher's buyer profile ID
DO $$
DECLARE
    christopher_buyer_profile_id UUID;
BEGIN
    -- Get Christopher's buyer profile ID
    SELECT id INTO christopher_buyer_profile_id 
    FROM buyer_profiles 
    WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';
    
    IF christopher_buyer_profile_id IS NOT NULL THEN
        -- Insert sample budget data
        INSERT INTO buyer_budgets (buyer_profile_id, project_name, allocated_budget, spent_amount, budget_period, status) VALUES
        (christopher_buyer_profile_id, 'Website Redesign', 50000.00, 15000.00, 'project', 'active'),
        (christopher_buyer_profile_id, 'Mobile App Development', 75000.00, 25000.00, 'project', 'active'),
        (christopher_buyer_profile_id, 'Marketing Campaign', 30000.00, 12000.00, 'quarterly', 'active'),
        (christopher_buyer_profile_id, 'Software Licenses', 10000.00, 8500.00, 'annual', 'active');
        
        -- Insert sample expense data
        INSERT INTO buyer_expenses (buyer_profile_id, budget_id, expense_name, amount, category, expense_date, description) VALUES
        (christopher_buyer_profile_id, 
         (SELECT id FROM buyer_budgets WHERE project_name = 'Website Redesign' AND buyer_profile_id = christopher_buyer_profile_id LIMIT 1),
         'UI/UX Design', 8000.00, 'Design', '2025-05-15', 'Initial design mockups and wireframes'),
        (christopher_buyer_profile_id,
         (SELECT id FROM buyer_budgets WHERE project_name = 'Website Redesign' AND buyer_profile_id = christopher_buyer_profile_id LIMIT 1),
         'Frontend Development', 7000.00, 'Development', '2025-05-20', 'React frontend implementation'),
        (christopher_buyer_profile_id,
         (SELECT id FROM buyer_budgets WHERE project_name = 'Mobile App Development' AND buyer_profile_id = christopher_buyer_profile_id LIMIT 1),
         'iOS Development', 15000.00, 'Development', '2025-05-10', 'Native iOS app development'),
        (christopher_buyer_profile_id,
         (SELECT id FROM buyer_budgets WHERE project_name = 'Mobile App Development' AND buyer_profile_id = christopher_buyer_profile_id LIMIT 1),
         'Android Development', 10000.00, 'Development', '2025-05-12', 'Native Android app development');
        
        RAISE NOTICE 'Sample budget and expense data created for Christopher';
    ELSE
        RAISE NOTICE 'Christopher buyer profile not found';
    END IF;
END $$;
