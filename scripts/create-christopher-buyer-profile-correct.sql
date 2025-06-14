-- Create buyer profile for Christopher Fill using correct column names
INSERT INTO buyer_profiles (
    user_id,
    industry,
    company_size,
    annual_software_budget,
    preferred_project_size,
    company_logo_url,
    detailed_company_description,
    primary_contact_name,
    primary_contact_title,
    primary_contact_email,
    primary_contact_phone,
    annual_project_budget,
    average_project_duration,
    preferred_pm_methodology,
    typical_team_size,
    business_objectives,
    social_media_profiles,
    verification_documents_url,
    preferred_meeting_times,
    language_preferences,
    timezone,
    business_challenges,
    success_metrics,
    previous_experience,
    preferred_provider_characteristics,
    partnership_goals,
    created_at,
    updated_at
) VALUES (
    '1cae22cb-1311-48ca-9caa-47d474c0a20e', -- Christopher's user ID
    'Technology/Software',
    '11-50 employees',
    50000, -- Annual software budget
    'Medium ($50K - $250K)',
    NULL, -- company_logo_url (will be set later)
    'StackMatch is an innovative platform that streamlines the process of connecting technology buyers with qualified service providers. We focus on creating efficient, transparent, and successful partnerships in the software development and consulting space.',
    'Christopher Fill',
    'CEO & Founder',
    'buyer@example.com',
    '+1-555-0123',
    '$100K - $250K',
    '3-6 months',
    'Agile/Scrum',
    8, -- typical team size
    '["platform_growth", "user_acquisition", "technology_advancement", "market_expansion"]'::jsonb,
    '{}'::jsonb, -- social_media_profiles (empty JSON object)
    NULL, -- verification_documents_url
    '["9:00 AM - 11:00 AM PST", "2:00 PM - 4:00 PM PST"]'::jsonb,
    '["English"]'::jsonb,
    'America/Los_Angeles',
    'Finding reliable technology partners who understand our vision and can deliver quality work on time and within budget. Ensuring scalability and maintaining high code quality standards.',
    '["user_growth", "platform_reliability", "customer_satisfaction", "roi", "time_to_market"]'::jsonb,
    'Extensive experience working with technology vendors and managing complex software projects. Previously led development teams at multiple startups and have deep understanding of the challenges in finding quality tech partners.',
    '{"experience_level": "senior", "communication_style": "collaborative", "work_methodology": "agile", "quality_focus": "high"}'::jsonb,
    'Build long-term partnerships with top-tier technology providers to accelerate our platform development and create a sustainable ecosystem of trusted vendors.',
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO UPDATE SET
    industry = EXCLUDED.industry,
    company_size = EXCLUDED.company_size,
    annual_software_budget = EXCLUDED.annual_software_budget,
    detailed_company_description = EXCLUDED.detailed_company_description,
    primary_contact_name = EXCLUDED.primary_contact_name,
    primary_contact_title = EXCLUDED.primary_contact_title,
    updated_at = NOW();

-- Verify the insert
SELECT 
    user_id,
    industry,
    company_size,
    primary_contact_name,
    primary_contact_title,
    annual_project_budget,
    business_objectives,
    created_at
FROM buyer_profiles 
WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';
