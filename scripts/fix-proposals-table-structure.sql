-- Check if proposals table exists and has correct structure
DO $$
BEGIN
    -- Check if proposals table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'proposals') THEN
        RAISE NOTICE 'Proposals table exists';
        
        -- Check if seller_id column exists and what it references
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'seller_id') THEN
            RAISE NOTICE 'seller_id column exists in proposals table';
        ELSE
            RAISE NOTICE 'seller_id column does not exist in proposals table';
        END IF;
        
        -- Check if seller_profile_id column exists (old structure)
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'seller_profile_id') THEN
            RAISE NOTICE 'seller_profile_id column exists in proposals table (old structure)';
            
            -- Rename seller_profile_id to seller_id if needed
            ALTER TABLE proposals RENAME COLUMN seller_profile_id TO seller_id;
            RAISE NOTICE 'Renamed seller_profile_id to seller_id';
        END IF;
        
    ELSE
        RAISE NOTICE 'Proposals table does not exist';
    END IF;
END $$;

-- Ensure the proposals table has the correct structure
CREATE TABLE IF NOT EXISTS public.proposals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id uuid NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    status proposal_status DEFAULT 'DRAFT',
    cover_letter text NOT NULL,
    proposed_budget numeric NOT NULL,
    proposed_timeline text,
    technical_approach text,
    relevant_experience text,
    attachments jsonb DEFAULT '[]'::jsonb,
    is_sealed boolean DEFAULT false,
    submitted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create proposal_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE proposal_status AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the status column to use the enum if it's not already
DO $$
BEGIN
    -- Check if the column is already using the enum
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'proposals' 
        AND column_name = 'status' 
        AND udt_name = 'proposal_status'
    ) THEN
        -- Update existing status values to match enum
        UPDATE proposals SET status = 'DRAFT' WHERE status IS NULL OR status = '';
        UPDATE proposals SET status = 'SUBMITTED' WHERE status = 'pending';
        UPDATE proposals SET status = 'ACCEPTED' WHERE status = 'accepted';
        UPDATE proposals SET status = 'REJECTED' WHERE status = 'rejected';
        UPDATE proposals SET status = 'WITHDRAWN' WHERE status = 'withdrawn';
        
        -- Change column type to enum
        ALTER TABLE proposals ALTER COLUMN status TYPE proposal_status USING status::proposal_status;
        ALTER TABLE proposals ALTER COLUMN status SET DEFAULT 'DRAFT';
    END IF;
END $$;

-- Create proposal_milestones table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.proposal_milestones (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    deliverables text[] DEFAULT '{}',
    amount numeric,
    duration_days integer,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_milestones ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_seller_id ON public.proposals(seller_id);
CREATE INDEX IF NOT EXISTS idx_proposals_listing_id ON public.proposals(listing_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposal_milestones_proposal_id ON public.proposal_milestones(proposal_id);

-- Create RLS policies for proposal_milestones
DROP POLICY IF EXISTS "Sellers can manage milestones for their proposals" ON public.proposal_milestones;
CREATE POLICY "Sellers can manage milestones for their proposals" ON public.proposal_milestones
    FOR ALL USING (
        proposal_id IN (
            SELECT id FROM public.proposals 
            WHERE seller_id IN (
                SELECT id FROM public.seller_profiles 
                WHERE user_id = auth.uid()
            )
        )
    );

DROP POLICY IF EXISTS "Buyers can read milestones for proposals on their listings" ON public.proposal_milestones;
CREATE POLICY "Buyers can read milestones for proposals on their listings" ON public.proposal_milestones
    FOR SELECT USING (
        proposal_id IN (
            SELECT p.id FROM public.proposals p
            JOIN public.listings l ON l.id = p.listing_id
            WHERE l.buyer_id = auth.uid()
        )
    );

-- Show final structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('proposals', 'proposal_milestones')
ORDER BY table_name, ordinal_position;
