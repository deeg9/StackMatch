-- Create buyer_profiles table if it doesn't exist (FIXED)
CREATE TABLE IF NOT EXISTS buyer_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Company Information
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    industry VARCHAR(100),
    company_description TEXT,
    website_url VARCHAR(255),
    company_address TEXT,
    
    -- Contact Information
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    primary_contact_phone VARCHAR(50),
    secondary_contact_name VARCHAR(255),
    secondary_contact_email VARCHAR(255),
    
    -- Project Preferences
    typical_project_budget_min INTEGER,
    typical_project_budget_max INTEGER,
    preferred_project_duration VARCHAR(50),
    preferred_communication_methods TEXT[],
    timezone VARCHAR(50),
    
    -- Goals and Expectations
    primary_goals TEXT[],
    success_metrics TEXT[],
    previous_experience_level VARCHAR(50),
    
    -- Verification and Status
    verification_status VARCHAR(50) DEFAULT 'pending',
    verification_documents TEXT[],
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_user_id ON buyer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_company_name ON buyer_profiles(company_name);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_industry ON buyer_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_verification_status ON buyer_profiles(verification_status);

-- Enable RLS
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view their own buyer profile" ON buyer_profiles;
CREATE POLICY "Users can view their own buyer profile" ON buyer_profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own buyer profile" ON buyer_profiles;
CREATE POLICY "Users can insert their own buyer profile" ON buyer_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own buyer profile" ON buyer_profiles;
CREATE POLICY "Users can update their own buyer profile" ON buyer_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own buyer profile" ON buyer_profiles;
CREATE POLICY "Users can delete their own buyer profile" ON buyer_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_buyer_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_buyer_profiles_updated_at ON buyer_profiles;
CREATE TRIGGER update_buyer_profiles_updated_at
    BEFORE UPDATE ON buyer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_buyer_profiles_updated_at();

-- Insert a buyer profile for Christopher if it doesn't exist
-- (FIXED: Removed reference to non-existent company_name column in users table)
INSERT INTO buyer_profiles (
    user_id,
    company_name,
    industry,
    company_description,
    primary_contact_name,
    primary_contact_email,
    verification_status,
    is_verified
)
SELECT 
    '1cae22cb-1311-48ca-9caa-47d474c0a20e',
    'StackMatch',
    'Technology',
    'AI-powered platform for connecting buyers with service providers',
    u.full_name,
    u.email,
    'verified',
    true
FROM users u
WHERE u.id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
AND NOT EXISTS (
    SELECT 1 FROM buyer_profiles 
    WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
);

-- Verify the creation
DO $$
DECLARE
    profile_count integer;
BEGIN
    SELECT COUNT(*) INTO profile_count
    FROM buyer_profiles 
    WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';
    
    IF profile_count > 0 THEN
        RAISE NOTICE 'SUCCESS: Buyer profile created/exists for Christopher Fill (count: %)', profile_count;
    ELSE
        RAISE NOTICE 'ERROR: Failed to create buyer profile for Christopher Fill';
        
        -- Check if user exists
        SELECT COUNT(*) INTO profile_count
        FROM users 
        WHERE id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';
        
        IF profile_count = 0 THEN
            RAISE NOTICE 'ERROR: User with ID 1cae22cb-1311-48ca-9caa-47d474c0a20e does not exist';
        ELSE
            RAISE NOTICE 'User exists but profile creation failed';
        END IF;
    END IF;
END $$;
