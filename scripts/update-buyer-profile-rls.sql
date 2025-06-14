-- Update Row Level Security policies for buyer_profiles table

-- Enable RLS on buyer_profiles table
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own buyer profile" ON buyer_profiles;
DROP POLICY IF EXISTS "Users can insert their own buyer profile" ON buyer_profiles;
DROP POLICY IF EXISTS "Users can update their own buyer profile" ON buyer_profiles;
DROP POLICY IF EXISTS "Users can delete their own buyer profile" ON buyer_profiles;

-- Policy for SELECT: Users can only view their own buyer profile
CREATE POLICY "Users can view their own buyer profile" ON buyer_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Policy for INSERT: Users can only create their own buyer profile
CREATE POLICY "Users can insert their own buyer profile" ON buyer_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE: Users can only update their own buyer profile
CREATE POLICY "Users can update their own buyer profile" ON buyer_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy for DELETE: Users can only delete their own buyer profile
CREATE POLICY "Users can delete their own buyer profile" ON buyer_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON buyer_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
