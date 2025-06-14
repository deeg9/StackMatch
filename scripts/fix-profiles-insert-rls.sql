-- Ensure RLS is enabled on the profiles table (it likely is, but good to be sure)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing INSERT policies on 'profiles' table if you want a clean slate (optional, be cautious)
-- Example: DROP POLICY IF EXISTS "Some old insert policy name" ON profiles;

-- Policy 1: Allow service_role to insert any profile
-- (If a policy with a similar purpose but different name exists, you might want to delete it first or update it)
CREATE POLICY "Enable insert for service_role on profiles" ON profiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Policy 2: Allow authenticated users to insert their own profile
-- (If a policy with a similar purpose but different name exists, you might want to delete it first or update it)
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Grant usage on schema and all tables in schema to service_role if not already done
-- This is generally good practice for service_role access
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
