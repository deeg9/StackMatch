-- Fix indexes script - only create indexes for columns that exist
-- First check what columns actually exist in buyer_profiles table

-- Index on user_id for fast lookups (this should always exist)
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_user_id ON buyer_profiles(user_id);

-- Index on industry for filtering/searching (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'buyer_profiles' AND column_name = 'industry') THEN
        CREATE INDEX IF NOT EXISTS idx_buyer_profiles_industry ON buyer_profiles(industry);
    END IF;
END $$;

-- Index on company_size for filtering (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'buyer_profiles' AND column_name = 'company_size') THEN
        CREATE INDEX IF NOT EXISTS idx_buyer_profiles_company_size ON buyer_profiles(company_size);
    END IF;
END $$;

-- Index on created_at for sorting (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'buyer_profiles' AND column_name = 'created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_buyer_profiles_created_at ON buyer_profiles(created_at);
    END IF;
END $$;

-- Index on is_verified_buyer (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'buyer_profiles' AND column_name = 'is_verified_buyer') THEN
        CREATE INDEX IF NOT EXISTS idx_buyer_profiles_verified ON buyer_profiles(is_verified_buyer);
    END IF;
END $$;

-- GIN indexes for JSONB fields (if they exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'buyer_profiles' AND column_name = 'business_objectives') THEN
        CREATE INDEX IF NOT EXISTS idx_buyer_profiles_business_objectives ON buyer_profiles USING GIN(business_objectives);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'buyer_profiles' AND column_name = 'social_media_profiles') THEN
        CREATE INDEX IF NOT EXISTS idx_buyer_profiles_social_media ON buyer_profiles USING GIN(social_media_profiles);
    END IF;
END $$;
