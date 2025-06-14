-- Create buyer profile for Christopher if it doesn't exist
INSERT INTO buyer_profiles (
    user_id,
    company_name,
    industry,
    company_description,
    primary_contact_name,
    primary_contact_email,
    verification_status,
    is_verified,
    created_at,
    updated_at
)
SELECT 
    p.id,
    COALESCE(p.company_name, 'StackMatch'),
    'Technology',
    'AI-powered platform for connecting buyers with service providers',
    COALESCE(p.full_name, 'Christopher Fill'),
    p.email,
    'verified',
    true,
    NOW(),
    NOW()
FROM profiles p
WHERE p.id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
AND NOT EXISTS (
    SELECT 1 FROM buyer_profiles 
    WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
);

-- Verify the creation
DO $$
DECLARE
    profile_count integer;
    rec record;
BEGIN
    SELECT COUNT(*) INTO profile_count
    FROM buyer_profiles 
    WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';
    
    IF profile_count > 0 THEN
        RAISE NOTICE 'SUCCESS: Buyer profile exists for Christopher (count: %)', profile_count;
        
        -- Show the created profile
        FOR rec IN 
            SELECT id, user_id, company_name, primary_contact_name, verification_status
            FROM buyer_profiles 
            WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
        LOOP
            RAISE NOTICE 'Profile ID: %', rec.id;
            RAISE NOTICE 'User ID: %', rec.user_id;
            RAISE NOTICE 'Company: %', rec.company_name;
            RAISE NOTICE 'Contact: %', rec.primary_contact_name;
            RAISE NOTICE 'Status: %', rec.verification_status;
        END LOOP;
    ELSE
        RAISE NOTICE 'ERROR: Still no buyer profile for Christopher';
    END IF;
END $$;
