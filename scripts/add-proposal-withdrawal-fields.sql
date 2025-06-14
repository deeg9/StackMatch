-- Add withdrawal fields to proposals table
ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS withdrawn_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS withdrawal_reason TEXT;

-- Update the status enum to include WITHDRAWN if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'WITHDRAWN' 
        AND enumtypid = (
            SELECT oid FROM pg_type WHERE typname = 'proposal_status'
        )
    ) THEN
        ALTER TYPE proposal_status ADD VALUE 'WITHDRAWN';
    END IF;
END $$;

-- Add index for withdrawn proposals
CREATE INDEX IF NOT EXISTS idx_proposals_withdrawn_at ON proposals(withdrawn_at) WHERE withdrawn_at IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN proposals.withdrawn_at IS 'Timestamp when the proposal was withdrawn by the seller';
COMMENT ON COLUMN proposals.withdrawal_reason IS 'Optional reason provided by seller for withdrawing the proposal';
