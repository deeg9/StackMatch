-- Detailed check for Christopher across all relevant tables
DO $$
DECLARE
    rec record;
    christopher_id uuid := '1cae22cb-1311-48ca-9caa-47d474c0a20e';
BEGIN
    RAISE NOTICE '=== CHECKING CHRISTOPHER ID: % ===', christopher_id;
    
    -- Check auth.users
    RAISE NOTICE '--- AUTH.USERS ---';
    FOR rec IN 
        SELECT id, email, created_at, last_sign_in_at
        FROM auth.users 
        WHERE id = christopher_id
    LOOP
        RAISE NOTICE 'Found in auth.users - Email: %, Created: %, Last Sign In: %', 
            rec.email, rec.created_at, rec.last_sign_in_at;
    END LOOP;
    
    IF NOT FOUND THEN
        RAISE NOTICE 'NOT FOUND in auth.users';
    END IF;
    
    -- Check public.profiles
    RAISE NOTICE '--- PUBLIC.PROFILES ---';
    FOR rec IN 
        SELECT id, email, company_name, full_name, user_type, onboarding_completed
        FROM profiles 
        WHERE id = christopher_id
    LOOP
        RAISE NOTICE 'Found in profiles - Email: %, Company: %, Name: %, Type: %, Onboarded: %', 
            rec.email, rec.company_name, rec.full_name, rec.user_type, rec.onboarding_completed;
    END LOOP;
    
    IF NOT FOUND THEN
        RAISE NOTICE 'NOT FOUND in profiles';
    END IF;
    
    -- Check buyer_profiles
    RAISE NOTICE '--- BUYER_PROFILES ---';
    FOR rec IN 
        SELECT * FROM buyer_profiles 
        WHERE user_id = christopher_id
    LOOP
        RAISE NOTICE 'Found in buyer_profiles: %', rec;
    END LOOP;
    
    IF NOT FOUND THEN
        RAISE NOTICE 'NOT FOUND in buyer_profiles';
    END IF;
    
    -- Show what user IDs do exist in buyer_profiles
    RAISE NOTICE '--- EXISTING USER_IDS IN BUYER_PROFILES ---';
    FOR rec IN 
        SELECT user_id, COUNT(*) as count
        FROM buyer_profiles 
        GROUP BY user_id
        LIMIT 5
    LOOP
        RAISE NOTICE 'User ID: %, Count: %', rec.user_id, rec.count;
    END LOOP;
    
END $$;
