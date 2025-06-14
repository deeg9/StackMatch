-- Create deal_rooms table if it doesn't exist
CREATE TABLE IF NOT EXISTS deal_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    room_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED', 'ARCHIVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique combination of listing, buyer, and seller
    UNIQUE(listing_id, buyer_id, seller_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deal_rooms_listing_id ON deal_rooms(listing_id);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_buyer_id ON deal_rooms(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_seller_id ON deal_rooms(seller_id);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_proposal_id ON deal_rooms(proposal_id);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_status ON deal_rooms(status);

-- Enable RLS
ALTER TABLE deal_rooms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view deal rooms they participate in" ON deal_rooms
    FOR SELECT USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id
    );

CREATE POLICY "Buyers can create deal rooms for their listings" ON deal_rooms
    FOR INSERT WITH CHECK (
        auth.uid() = buyer_id AND
        EXISTS (
            SELECT 1 FROM listings 
            WHERE id = listing_id AND buyer_id = auth.uid()
        )
    );

CREATE POLICY "Participants can update deal room status" ON deal_rooms
    FOR UPDATE USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_deal_rooms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_deal_rooms_updated_at
    BEFORE UPDATE ON deal_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_deal_rooms_updated_at();
