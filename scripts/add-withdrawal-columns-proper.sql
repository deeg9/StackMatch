-- Add withdrawal columns to proposals table if they don't exist
DO $$ 
BEGIN
    -- Add withdrawn_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'proposals' 
        AND column_name = 'withdrawn_at'
    ) THEN
        ALTER TABLE proposals ADD COLUMN withdrawn_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added withdrawn_at column to proposals table';
    ELSE
        RAISE NOTICE 'withdrawn_at column already exists in proposals table';
    END IF;

    -- Add withdrawal_reason column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'proposals' 
        AND column_name = 'withdrawal_reason'
    ) THEN
        ALTER TABLE proposals ADD COLUMN withdrawal_reason TEXT;
        RAISE NOTICE 'Added withdrawal_reason column to proposals table';
    ELSE
        RAISE NOTICE 'withdrawal_reason column already exists in proposals table';
    END IF;
END $$;

-- Verify the columns were added
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'proposals' 
AND column_name IN ('withdrawn_at', 'withdrawal_reason')
ORDER BY column_name;
