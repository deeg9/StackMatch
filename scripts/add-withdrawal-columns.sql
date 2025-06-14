-- Check if the columns exist and add them if they don't
DO $$
BEGIN
    -- Check if withdrawn_at column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'proposals'
        AND column_name = 'withdrawn_at'
    ) THEN
        -- Add withdrawn_at column
        ALTER TABLE proposals ADD COLUMN withdrawn_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added withdrawn_at column to proposals table';
    ELSE
        RAISE NOTICE 'withdrawn_at column already exists';
    END IF;

    -- Check if withdrawal_reason column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'proposals'
        AND column_name = 'withdrawal_reason'
    ) THEN
        -- Add withdrawal_reason column
        ALTER TABLE proposals ADD COLUMN withdrawal_reason TEXT;
        RAISE NOTICE 'Added withdrawal_reason column to proposals table';
    ELSE
        RAISE NOTICE 'withdrawal_reason column already exists';
    END IF;
END $$;

-- Verify the columns exist
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'proposals'
AND column_name IN ('withdrawn_at', 'withdrawal_reason')
ORDER BY column_name;
