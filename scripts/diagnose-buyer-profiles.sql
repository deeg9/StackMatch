-- Comprehensive buyer profiles diagnostics
DO $$
DECLARE
    table_exists boolean;
    user_exists boolean;
    profile_exists boolean;
    column_count integer;
BEGIN
    -- Check if buyer_profiles table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'buyer_profiles'
    ) INTO table_exists;
    
    RAISE NOTICE 'buyer_profiles table exists: %', table_exists;
    
    IF table_exists THEN
        -- Get column information
        RAISE NOTICE '=== BUYER_PROFILES TABLE STRUCTURE ===';
        
        SELECT COUNT(*) INTO column_count
        FROM information_schema.columns 
        WHERE table_name = 'buyer_profiles';
        
        RAISE NOTICE 'Total columns: %', column_count;
        
        -- Show all columns
        FOR rec IN 
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'buyer_profiles' 
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE 'Column: % | Type: % | Nullable: % | Default: %', 
                rec.column_name, rec.data_type, rec.is_nullable, rec.column_default;
        END LOOP;
        
        -- Check for Christopher's user record
        SELECT EXISTS (
            SELECT FROM users 
            WHERE id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
        ) INTO user_exists;
        
        RAISE NOTICE 'Christopher user exists: %', user_exists;
        
        IF user_exists THEN
            -- Show user details
            RAISE NOTICE '=== CHRISTOPHER USER DETAILS ===';
            FOR rec IN 
                SELECT id, email, full_name, user_type, company_name, onboarding_completed
                FROM users 
                WHERE id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
            LOOP
                RAISE NOTICE 'User ID: %', rec.id;
                RAISE NOTICE 'Email: %', rec.email;
                RAISE NOTICE 'Full Name: %', rec.full_name;
                RAISE NOTICE 'User Type: %', rec.user_type;
                RAISE NOTICE 'Company: %', rec.company_name;
                RAISE NOTICE 'Onboarding Complete: %', rec.onboarding_completed;
            END LOOP;
        END IF;
        
        -- Check for Christopher's buyer profile
        SELECT EXISTS (
            SELECT FROM buyer_profiles 
            WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
        ) INTO profile_exists;
        
        RAISE NOTICE 'Christopher buyer profile exists: %', profile_exists;
        
        IF profile_exists THEN
            RAISE NOTICE '=== CHRISTOPHER BUYER PROFILE ===';
            FOR rec IN 
                SELECT *
                FROM buyer_profiles 
                WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
            LOOP
                RAISE NOTICE 'Profile found with ID: %', rec.id;
                RAISE NOTICE 'Created at: %', rec.created_at;
                RAISE NOTICE 'Updated at: %', rec.updated_at;
            END LOOP;
        ELSE
            RAISE NOTICE 'No buyer profile found for Christopher';
        END IF;
        
        -- Check RLS policies
        RAISE NOTICE '=== RLS POLICIES FOR BUYER_PROFILES ===';
        FOR rec IN 
            SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
            FROM pg_policies 
            WHERE tablename = 'buyer_profiles'
        LOOP
            RAISE NOTICE 'Policy: % | Command: % | Roles: %', 
                rec.policyname, rec.cmd, rec.roles;
        END LOOP;
        
    ELSE
        RAISE NOTICE 'buyer_profiles table does not exist!';
        
        -- Check if we have any profile-related tables
        RAISE NOTICE '=== EXISTING PROFILE TABLES ===';
        FOR rec IN 
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE '%profile%'
        LOOP
            RAISE NOTICE 'Found table: %', rec.table_name;
        END LOOP;
    END IF;
    
END $$;
