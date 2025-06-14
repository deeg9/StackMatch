-- Additional SELECT policies (you'll likely need these too)
-- These allow users to read their own profiles and service_role to read any profile

-- PROFILES TABLE - SELECT POLICIES
CREATE POLICY "Enable select for service_role" ON profiles
    FOR SELECT
    TO service_role
    USING (true);

CREATE POLICY "Users can select their own profile" ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- BUYER_PROFILES TABLE - SELECT POLICIES
CREATE POLICY "Enable select for service_role" ON buyer_profiles
    FOR SELECT
    TO service_role
    USING (true);

CREATE POLICY "Users can select their own buyer_profile" ON buyer_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- SELLER_PROFILES TABLE - SELECT POLICIES
CREATE POLICY "Enable select for service_role" ON seller_profiles
    FOR SELECT
    TO service_role
    USING (true);

CREATE POLICY "Users can select their own seller_profile" ON seller_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
