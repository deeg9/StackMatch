-- Comprehensive buyer profiles diagnostics (FIXED)
DO $$
DECLARE
    table_exists boolean;
    user_exists boolean;
    profile_exists boolean;
    column_count integer;
    rec record;
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
            -- Show user details (check what columns actually exist first)
            RAISE NOTICE '=== CHRISTOPHER USER DETAILS ===';
            RAISE NOTICE 'Checking users table structure first...';
            
            -- Show users table columns
            FOR rec IN 
                SELECT column_name, data_type
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                ORDER BY ordinal_position
            LOOP
                RAISE NOTICE 'Users column: % (%)', rec.column_name, rec.data_type;
            END LOOP;
            
            -- Get user data with only columns that exist
            FOR rec IN 
                SELECT id, email, 
                       COALESCE(full_name, 'N/A') as full_name,
                       COALESCE(user_type, 'N/A') as user_type,
                       COALESCE(onboarding_completed, false) as onboarding_completed
                FROM users 
                WHERE id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
            LOOP
                RAISE NOTICE 'User ID: %', rec.id;
                RAISE NOTICE 'Email: %', rec.email;
                RAISE NOTICE 'Full Name: %', rec.full_name;
                RAISE NOTICE 'User Type: %', rec.user_type;
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
                SELECT id, user_id, created_at, updated_at
                FROM buyer_profiles 
                WHERE user_id = '1cae22cb-1311-48ca-9caa-47d474c0a20e'
            LOOP
                RAISE NOTICE 'Profile ID: %', rec.id;
                RAISE NOTICE 'User ID: %', rec.user_id;
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
        
        -- Show users table structure to understand what we're working with
        RAISE NOTICE '=== USERS TABLE STRUCTURE ===';
        FOR rec IN 
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE 'Users column: % | Type: % | Nullable: %', 
                rec.column_name, rec.data_type, rec.is_nullable;
        END LOOP;
    END IF;
    
END $$;
