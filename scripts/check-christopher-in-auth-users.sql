-- Check Christopher's data in auth.users and profiles tables
DO $$
DECLARE
    auth_user_exists boolean;
    profile_exists boolean;
    buyer_profile_exists boolean;
    rec record;
BEGIN
    -- Check if Christopher exists in auth.users
    SELECT EXISTS (
        SELECT FROM auth.users 
        WHERE id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
    ) INTO auth_user_exists;
    
    RAISE NOTICE 'Christopher exists in auth.users: %', auth_user_exists;
    
    IF auth_user_exists THEN
        -- Show Christopher's auth.users data
        RAISE NOTICE '=== CHRISTOPHER AUTH.USERS DATA ===';
        FOR rec IN 
            SELECT id, email, created_at, updated_at, last_sign_in_at
            FROM auth.users 
            WHERE id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
        LOOP
            RAISE NOTICE 'Auth User ID: %', rec.id;
            RAISE NOTICE 'Email: %', rec.email;
            RAISE NOTICE 'Created: %', rec.created_at;
            RAISE NOTICE 'Last Sign In: %', rec.last_sign_in_at;
        END LOOP;
    END IF;
    
    -- Check if Christopher exists in public.profiles
    SELECT EXISTS (
        SELECT FROM profiles 
        WHERE id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
    ) INTO profile_exists;
    
    RAISE NOTICE 'Christopher exists in profiles: %', profile_exists;
    
    IF profile_exists THEN
        -- Show Christopher's profiles data
        RAISE NOTICE '=== CHRISTOPHER PROFILES DATA ===';
        FOR rec IN 
            SELECT id, email, company_name, full_name, user_type, onboarding_completed
            FROM profiles 
            WHERE id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
        LOOP
            RAISE NOTICE 'Profile ID: %', rec.id;
            RAISE NOTICE 'Email: %', rec.email;
            RAISE NOTICE 'Company Name: %', rec.company_name;
            RAISE NOTICE 'Full Name: %', rec.full_name;
            RAISE NOTICE 'User Type: %', rec.user_type;
            RAISE NOTICE 'Onboarding Complete: %', rec.onboarding_completed;
        END LOOP;
    END IF;
    
    -- Check if Christopher exists in buyer_profiles
    SELECT EXISTS (
        SELECT FROM buyer_profiles 
        WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
    ) INTO buyer_profile_exists;
    
    RAISE NOTICE 'Christopher exists in buyer_profiles: %', buyer_profile_exists;
    
    IF buyer_profile_exists THEN
        -- Show Christopher's buyer_profiles data
        RAISE NOTICE '=== CHRISTOPHER BUYER_PROFILES DATA ===';
        FOR rec IN 
            SELECT id, user_id, created_at, updated_at
            FROM buyer_profiles 
            WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
        LOOP
            RAISE NOTICE 'Buyer Profile ID: %', rec.id;
            RAISE NOTICE 'User ID: %', rec.user_id;
            RAISE NOTICE 'Created: %', rec.created_at;
            RAISE NOTICE 'Updated: %', rec.updated_at;
        END LOOP;
    ELSE
        RAISE NOTICE 'No buyer profile found - this is likely the issue!';
    END IF;
    
    -- Show buyer_profiles table structure
    RAISE NOTICE '=== BUYER_PROFILES TABLE STRUCTURE ===';
    FOR rec IN 
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'buyer_profiles' 
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'Column: % | Type: % | Nullable: %', 
            rec.column_name, rec.data_type, rec.is_nullable;
    END LOOP;
    
END $$;
