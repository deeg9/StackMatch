-- Create indexes for better performance on buyer_profiles table

-- Index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_user_id ON buyer_profiles(user_id);

-- Index on verification status for filtering
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_verification_status ON buyer_profiles(verification_status);

-- Index on industry for filtering/searching
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_industry ON buyer_profiles(industry);

-- Index on company_size for filtering
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_company_size ON buyer_profiles(company_size);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_created_at ON buyer_profiles(created_at);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_user_verification ON buyer_profiles(user_id, verification_status);

-- GIN index for JSONB fields for better JSON queries
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_business_objectives ON buyer_profiles USING GIN(business_objectives);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_social_media ON buyer_profiles USING GIN(social_media_profiles);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_success_metrics ON buyer_profiles USING GIN(success_metrics);
