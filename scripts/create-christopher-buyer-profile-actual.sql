-- Create buyer profile for Christopher Fill using actual table structure
INSERT INTO buyer_profiles (
    user_id,
    industry,
    company_size,
    annual_software,
    preferred_pro,
    company_logo,
    detailed_comp,
    primary_conta,
    primary_con,
    annual_projec,
    average_proje,
    preferred_pm,
    typical_team,
    business_obje,
    social_media_pro,
    verification_,
    preferred_mee,
    language_pref,
    timezone,
    business_chal,
    success_metri,
    previous_expe,
    preferred_provid,
    partnership_g,
    created_at,
    updated_at
) VALUES (
    '1cae22cb-1311-48ca-9caa-47d474c0a20e', -- Christopher's user ID
    'Technology/Software',
    '11-50 employees',
    50000, -- Annual software budget
    ARRAY['experienced_developers', 'agile_teams', 'full_stack_providers'],
    NULL, -- company_logo (will be set later)
    'StackMatch is an innovative platform that streamlines the process of connecting technology buyers with qualified service providers. We focus on creating efficient, transparent, and successful partnerships in the software development and consulting space.',
    'Christopher Fill',
    'buyer@example.com',
    250000, -- Annual project budget
    '3-6 months',
    'Agile/Scrum',
    '5-10 people',
    ARRAY['platform_growth', 'user_acquisition', 'technology_advancement'],
    '{}', -- social_media_profiles (empty JSON object)
    'pending', -- verification status
    ARRAY['9:00 AM - 11:00 AM PST', '2:00 PM - 4:00 PM PST'],
    ARRAY['English'],
    'America/Los_Angeles',
    'Finding reliable technology partners who understand our vision and can deliver quality work on time and within budget.',
    ARRAY['user_growth', 'platform_reliability', 'customer_satisfaction', 'roi'],
    'Extensive experience working with technology vendors and managing complex software projects.',
    ARRAY['long_term_partnerships', 'quality_providers', 'cost_effective_solutions'],
    'Build long-term partnerships with top-tier technology providers to accelerate our platform development.',
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO UPDATE SET
    industry = EXCLUDED.industry,
    company_size = EXCLUDED.company_size,
    updated_at = NOW();

-- Verify the insert
SELECT 
    user_id,
    industry,
    company_size,
    primary_conta,
    annual_projec,
    created_at
FROM buyer_profiles 
WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';
