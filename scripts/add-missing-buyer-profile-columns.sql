-- Add missing columns to buyer_profiles table
-- This script will add all the new fields from our enhanced onboarding

-- Company Information fields
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
ADD COLUMN IF NOT EXISTS detailed_company_description TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS primary_contact_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS primary_contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS primary_contact_phone VARCHAR(50);

-- Project & Budget fields
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS annual_project_budget VARCHAR(100),
ADD COLUMN IF NOT EXISTS average_project_duration VARCHAR(100),
ADD COLUMN IF NOT EXISTS preferred_pm_methodology VARCHAR(100),
ADD COLUMN IF NOT EXISTS typical_team_size INTEGER,
ADD COLUMN IF NOT EXISTS business_objectives JSONB DEFAULT '[]'::jsonb;

-- Communication & Verification fields
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS social_media_profiles JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS verification_documents_url TEXT,
ADD COLUMN IF NOT EXISTS preferred_meeting_times JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS language_preferences JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100);

-- Goals & Expectations fields
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS business_challenges TEXT,
ADD COLUMN IF NOT EXISTS success_metrics JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS previous_experience TEXT,
ADD COLUMN IF NOT EXISTS preferred_provider_characteristics JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS partnership_goals TEXT;

-- Add updated timestamp
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_buyer_profiles_updated_at ON buyer_profiles;
CREATE TRIGGER update_buyer_profiles_updated_at
    BEFORE UPDATE ON buyer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
