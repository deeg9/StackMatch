-- UPDATE and DELETE policies (for completeness)
-- These will be useful when users want to update their profiles later

-- PROFILES TABLE - UPDATE/DELETE POLICIES
CREATE POLICY "Enable update for service_role" ON profiles
    FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for service_role" ON profiles
    FOR DELETE
    TO service_role
    USING (true);

CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = id);

-- BUYER_PROFILES TABLE - UPDATE/DELETE POLICIES
CREATE POLICY "Enable update for service_role" ON buyer_profiles
    FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can update their own buyer_profile" ON buyer_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for service_role" ON buyer_profiles
    FOR DELETE
    TO service_role
    USING (true);

CREATE POLICY "Users can delete their own buyer_profile" ON buyer_profiles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- SELLER_PROFILES TABLE - UPDATE/DELETE POLICIES
CREATE POLICY "Enable update for service_role" ON seller_profiles
    FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can update their own seller_profile" ON seller_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for service_role" ON seller_profiles
    FOR DELETE
    TO service_role
    USING (true);

CREATE POLICY "Users can delete their own seller_profile" ON seller_profiles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
