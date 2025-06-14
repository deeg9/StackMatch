-- Create buyer profile for Christopher Fill
INSERT INTO buyer_profiles (
    user_id,
    company_name,
    industry,
    company_size,
    annual_revenue_range,
    headquarters_location,
    website_url,
    company_description,
    detailed_company_description,
    primary_contact_name,
    primary_contact_email,
    primary_contact_phone,
    primary_contact_title,
    annual_project_budget,
    average_project_duration,
    preferred_pm_methodology,
    typical_team_size,
    business_objectives,
    preferred_meeting_times,
    language_preferences,
    timezone,
    business_challenges,
    success_metrics,
    previous_experience,
    partnership_goals,
    founded_year,
    created_at,
    updated_at
) VALUES (
    '1cae22cb-1311-48ca-9caa-47d474c0a20e', -- Christopher's user ID
    'StackMatch',
    'Technology/Software',
    '11-50 employees',
    '$1M-$5M',
    'San Francisco, CA',
    'https://stackmatch.com',
    'A platform connecting buyers and sellers in the technology space',
    'StackMatch is an innovative platform that streamlines the process of connecting technology buyers with qualified service providers. We focus on creating efficient, transparent, and successful partnerships in the software development and consulting space.',
    'Christopher Fill',
    'buyer@example.com',
    '+1-555-0123',
    'CEO & Founder',
    250000, -- $250k annual project budget
    '3-6 months',
    'Agile/Scrum',
    '5-10 people',
    ARRAY['platform_growth', 'user_acquisition', 'technology_advancement'],
    ARRAY['9:00 AM - 11:00 AM PST', '2:00 PM - 4:00 PM PST'],
    ARRAY['English'],
    'America/Los_Angeles',
    'Finding reliable technology partners who understand our vision and can deliver quality work on time and within budget.',
    ARRAY['user_growth', 'platform_reliability', 'customer_satisfaction', 'roi'],
    'Extensive experience working with technology vendors and managing complex software projects.',
    'Build long-term partnerships with top-tier technology providers to accelerate our platform development.',
    2023,
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    industry = EXCLUDED.industry,
    company_size = EXCLUDED.company_size,
    updated_at = NOW();

-- Verify the insert
SELECT 
    user_id,
    company_name,
    industry,
    company_size,
    primary_contact_name,
    annual_project_budget,
    created_at
FROM buyer_profiles 
WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';
