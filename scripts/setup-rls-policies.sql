-- Enable RLS on tables (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Enable insert for service_role" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for service_role" ON buyer_profiles;
DROP POLICY IF EXISTS "Users can insert their own buyer_profile" ON buyer_profiles;
DROP POLICY IF EXISTS "Enable insert for service_role" ON seller_profiles;
DROP POLICY IF EXISTS "Users can insert their own seller_profile" ON seller_profiles;

-- PROFILES TABLE POLICIES
-- Policy 1: Allow service_role to insert any profile
CREATE POLICY "Enable insert for service_role" ON profiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Policy 2: Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- BUYER_PROFILES TABLE POLICIES
-- Policy 1: Allow service_role to insert any buyer profile
CREATE POLICY "Enable insert for service_role" ON buyer_profiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Policy 2: Allow authenticated users to insert their own buyer profile
CREATE POLICY "Users can insert their own buyer_profile" ON buyer_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- SELLER_PROFILES TABLE POLICIES
-- Policy 1: Allow service_role to insert any seller profile
CREATE POLICY "Enable insert for service_role" ON seller_profiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Policy 2: Allow authenticated users to insert their own seller profile
CREATE POLICY "Users can insert their own seller_profile" ON seller_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
