-- Fixed version - count rows in all tables
DO $$
DECLARE
    r RECORD;
    row_count INTEGER;
BEGIN
    RAISE NOTICE 'Table | Row Count';
    RAISE NOTICE '-------------------';
    
    FOR r IN 
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema IN ('public', 'auth')
        AND table_type = 'BASE TABLE'
        ORDER BY table_schema, table_name
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM %I.%I', r.table_schema, r.table_name) INTO row_count;
        RAISE NOTICE '%s.%s | %s', r.table_schema, r.table_name, row_count;
    END LOOP;
END $$;
