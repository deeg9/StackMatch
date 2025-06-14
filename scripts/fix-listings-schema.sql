-- Check if timeline column exists in listings table
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'listings'
        AND column_name = 'timeline'
    ) INTO column_exists;

    IF NOT column_exists THEN
        RAISE NOTICE 'Adding timeline column to listings table';
        EXECUTE 'ALTER TABLE listings ADD COLUMN timeline JSONB DEFAULT NULL';
    ELSE
        RAISE NOTICE 'Timeline column already exists in listings table';
    END IF;
END $$;

-- Check if attachments column exists in listings table
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'listings'
        AND column_name = 'attachments'
    ) INTO column_exists;

    IF NOT column_exists THEN
        RAISE NOTICE 'Adding attachments column to listings table';
        EXECUTE 'ALTER TABLE listings ADD COLUMN attachments JSONB DEFAULT NULL';
    ELSE
        RAISE NOTICE 'Attachments column already exists in listings table';
    END IF;
END $$;

-- Check if attachments column exists in proposals table
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'proposals'
        AND column_name = 'attachments'
    ) INTO column_exists;

    IF NOT column_exists THEN
        RAISE NOTICE 'Adding attachments column to proposals table';
        EXECUTE 'ALTER TABLE proposals ADD COLUMN attachments JSONB DEFAULT NULL';
    ELSE
        RAISE NOTICE 'Attachments column already exists in proposals table';
    END IF;
END $$;
