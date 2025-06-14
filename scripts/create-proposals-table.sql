-- Create proposals table
CREATE TABLE IF NOT EXISTS public.proposals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_profile_id uuid REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    listing_id uuid, -- We'll add the listings table reference later
    title text NOT NULL,
    description text,
    proposed_budget numeric,
    timeline_weeks integer,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    submitted_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Create listings table if it doesn't exist (needed for proposals)
CREATE TABLE IF NOT EXISTS public.listings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    budget_min numeric,
    budget_max numeric,
    category text,
    status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add foreign key constraint for proposals -> listings
ALTER TABLE public.proposals 
ADD CONSTRAINT fk_proposals_listing 
FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;

-- Enable RLS on proposals table
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Enable RLS on listings table
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for proposals table
CREATE POLICY "Users can view proposals for their seller profile" ON public.proposals
    FOR SELECT USING (
        seller_profile_id IN (
            SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert proposals for their seller profile" ON public.proposals
    FOR INSERT WITH CHECK (
        seller_profile_id IN (
            SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own proposals" ON public.proposals
    FOR UPDATE USING (
        seller_profile_id IN (
            SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for listings table
CREATE POLICY "Users can view all active listings" ON public.listings
    FOR SELECT USING (status = 'active' OR user_id = auth.uid());

CREATE POLICY "Users can manage their own listings" ON public.listings
    FOR ALL USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_seller_profile_id ON public.proposals(seller_profile_id);
CREATE INDEX IF NOT EXISTS idx_proposals_listing_id ON public.proposals(listing_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);

-- Insert some sample data for testing
INSERT INTO public.listings (user_id, title, description, budget_min, budget_max, category) VALUES
(
    (SELECT id FROM auth.users WHERE email = 'seller@example.com' LIMIT 1),
    'Sample Web Development Project',
    'Need a modern website built with React and Node.js',
    5000,
    10000,
    'Web Development'
) ON CONFLICT DO NOTHING;

-- Insert a sample proposal for testing
INSERT INTO public.proposals (seller_profile_id, listing_id, title, description, proposed_budget, timeline_weeks) VALUES
(
    (SELECT id FROM public.seller_profiles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'seller@example.com' LIMIT 1) LIMIT 1),
    (SELECT id FROM public.listings LIMIT 1),
    'Web Development Proposal',
    'I can build your website using modern technologies',
    7500,
    8
) ON CONFLICT DO NOTHING;
