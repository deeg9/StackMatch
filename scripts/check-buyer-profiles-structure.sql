-- Check the actual structure of buyer_profiles table
DO $$
DECLARE
    rec record;
BEGIN
    RAISE NOTICE '=== BUYER_PROFILES TABLE STRUCTURE ===';
    
    -- Show all columns in buyer_profiles table
    FOR rec IN 
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'buyer_profiles' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'Column: % | Type: % | Nullable: % | Default: %', 
            rec.column_name, rec.data_type, rec.is_nullable, rec.column_default;
    END LOOP;
    
    -- Check if table has any data
    DECLARE
        row_count integer;
    BEGIN
        EXECUTE 'SELECT COUNT(*) FROM buyer_profiles' INTO row_count;
        RAISE NOTICE 'Total rows in buyer_profiles: %', row_count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error counting rows: %', SQLERRM;
    END;
    
    -- Show sample data if any exists
    RAISE NOTICE '=== SAMPLE DATA (if any) ===';
    FOR rec IN 
        SELECT * FROM buyer_profiles LIMIT 3
    LOOP
        RAISE NOTICE 'Sample row: %', rec;
    END LOOP;
    
END $$;
