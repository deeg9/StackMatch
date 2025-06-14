-- Check if withdrawal fields exist and add them if they don't
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
        RAISE NOTICE 'withdrawn_at column already exists';
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
        RAISE NOTICE 'withdrawal_reason column already exists';
    END IF;

    -- Check if WITHDRAWN status exists in the enum
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'WITHDRAWN' 
        AND enumtypid = (
            SELECT oid FROM pg_type WHERE typname = 'proposal_status'
        )
    ) THEN
        ALTER TYPE proposal_status ADD VALUE 'WITHDRAWN';
        RAISE NOTICE 'Added WITHDRAWN status to proposal_status enum';
    ELSE
        RAISE NOTICE 'WITHDRAWN status already exists in enum';
    END IF;
END $$;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'proposals' 
AND column_name IN ('withdrawn_at', 'withdrawal_reason')
ORDER BY column_name;

-- Check enum values
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
    SELECT oid FROM pg_type WHERE typname = 'proposal_status'
)
ORDER BY enumlabel;
