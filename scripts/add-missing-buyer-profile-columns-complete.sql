-- Add all missing columns to buyer_profiles table
-- This script adds columns that the frontend CompanyInformationTab expects

-- First, let's check what columns currently exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'buyer_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing company information columns
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS company_description TEXT,
ADD COLUMN IF NOT EXISTS detailed_company_description TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS headquarters_location TEXT,
ADD COLUMN IF NOT EXISTS annual_revenue_range TEXT;

-- Add missing contact information columns
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS primary_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS primary_contact_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS primary_contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS primary_contact_phone VARCHAR(50);

-- Add other missing columns that might be expected by the frontend
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
ADD COLUMN IF NOT EXISTS social_media_profiles JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS verification_documents_url TEXT;

-- Add project and budget related columns
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS annual_project_budget VARCHAR(100),
ADD COLUMN IF NOT EXISTS average_project_duration VARCHAR(100),
ADD COLUMN IF NOT EXISTS preferred_pm_methodology VARCHAR(100),
ADD COLUMN IF NOT EXISTS typical_team_size INTEGER,
ADD COLUMN IF NOT EXISTS business_objectives JSONB DEFAULT '[]'::jsonb;

-- Add communication preferences
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS preferred_meeting_times JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS language_preferences JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100);

-- Add goals and expectations
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS business_challenges TEXT,
ADD COLUMN IF NOT EXISTS success_metrics JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS previous_experience TEXT,
ADD COLUMN IF NOT EXISTS preferred_provider_characteristics JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS partnership_goals TEXT;

-- Ensure updated_at column exists and has proper trigger
ALTER TABLE buyer_profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS update_buyer_profiles_updated_at ON buyer_profiles;
CREATE TRIGGER update_buyer_profiles_updated_at
    BEFORE UPDATE ON buyer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'buyer_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
