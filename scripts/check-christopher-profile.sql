-- Check if Christopher's profile exists in the profiles table
-- (assuming profiles table exists)
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
) as profiles_table_exists;

-- If profiles table exists, check for Christopher's profile
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) THEN
        RAISE NOTICE 'Checking for Christopher''s profile...';
        
        -- Check if id column exists in profiles
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'id'
        ) THEN
            -- Check for Christopher's profile by ID
            RAISE NOTICE 'Checking by ID...';
            PERFORM * FROM public.profiles WHERE id = '1cae22cb-1311-48ca-9caa-47d474c0a20e';
            IF FOUND THEN
                RAISE NOTICE 'Found Christopher''s profile by ID';
            ELSE
                RAISE NOTICE 'Christopher''s profile not found by ID';
            END IF;
        END IF;
        
        -- Check if email column exists in profiles
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'email'
        ) THEN
            -- Check for Christopher's profile by email
            RAISE NOTICE 'Checking by email...';
            PERFORM * FROM public.profiles WHERE email = 'buyer@example.com';
            IF FOUND THEN
                RAISE NOTICE 'Found Christopher''s profile by email';
            ELSE
                RAISE NOTICE 'Christopher''s profile not found by email';
            END IF;
        END IF;
    ELSE
        RAISE NOTICE 'Profiles table does not exist';
    END IF;
END $$;
