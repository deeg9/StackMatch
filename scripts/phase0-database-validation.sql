-- Phase 0: Database Validation & Foundation
-- This script validates and sets up the complete database structure for deal rooms

-- 1. VERIFY CORE TABLES EXIST
DO $$
BEGIN
    -- Check if core tables exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        RAISE EXCEPTION 'profiles table does not exist';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'listings') THEN
        RAISE EXCEPTION 'listings table does not exist';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'proposals') THEN
        RAISE EXCEPTION 'proposals table does not exist';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'deal_rooms') THEN
        RAISE EXCEPTION 'deal_rooms table does not exist';
    END IF;
    
    RAISE NOTICE 'All core tables exist ✓';
END $$;

-- 2. VALIDATE PROPOSALS TABLE STRUCTURE
DO $$
BEGIN
    -- Check if proposals table has all required fields
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'proposals' AND column_name = 'proposal_text'
    ) THEN
        ALTER TABLE proposals ADD COLUMN proposal_text TEXT;
        RAISE NOTICE 'Added proposal_text column to proposals table';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'proposals' AND column_name = 'technical_approach'
    ) THEN
        ALTER TABLE proposals ADD COLUMN technical_approach TEXT;
        RAISE NOTICE 'Added technical_approach column to proposals table';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'proposals' AND column_name = 'proposed_budget'
    ) THEN
        ALTER TABLE proposals ADD COLUMN proposed_budget DECIMAL(12,2);
        RAISE NOTICE 'Added proposed_budget column to proposals table';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'proposals' AND column_name = 'proposed_timeline'
    ) THEN
        ALTER TABLE proposals ADD COLUMN proposed_timeline TEXT;
        RAISE NOTICE 'Added proposed_timeline column to proposals table';
    END IF;
    
    RAISE NOTICE 'Proposals table structure validated ✓';
END $$;

-- 3. VALIDATE DEAL_ROOMS TABLE STRUCTURE AND ENUMS
DO $$
BEGIN
    -- Create deal room status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deal_room_status') THEN
        CREATE TYPE deal_room_status AS ENUM ('ACTIVE', 'COMPLETED', 'CLOSED', 'ARCHIVED');
        RAISE NOTICE 'Created deal_room_status enum';
    END IF;
    
    -- Check if deal_rooms table has proper status column
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'deal_rooms' AND column_name = 'status'
    ) THEN
        ALTER TABLE deal_rooms ADD COLUMN status deal_room_status DEFAULT 'ACTIVE';
        RAISE NOTICE 'Added status column to deal_rooms table';
    END IF;
    
    -- Add last_activity_at for sorting
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'deal_rooms' AND column_name = 'last_activity_at'
    ) THEN
        ALTER TABLE deal_rooms ADD COLUMN last_activity_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added last_activity_at column to deal_rooms table';
    END IF;
    
    -- Add room_name if missing
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'deal_rooms' AND column_name = 'room_name'
    ) THEN
        ALTER TABLE deal_rooms ADD COLUMN room_name TEXT;
        RAISE NOTICE 'Added room_name column to deal_rooms table';
    END IF;
    
    RAISE NOTICE 'Deal rooms table structure validated ✓';
END $$;

-- 4. CREATE NOTIFICATIONS TABLE FOR DEAL ROOMS
CREATE TABLE IF NOT EXISTS deal_room_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL CHECK (notification_type IN (
        'new_deal_room', 'new_message', 'status_change', 'file_upload', 
        'proposal_update', 'listing_update', 'milestone_update'
    )),
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ NULL
);

-- 5. CREATE ACTIVITY LOG TABLE
CREATE TABLE IF NOT EXISTS deal_room_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'created', 'message_sent', 'file_uploaded', 'status_changed', 
        'proposal_updated', 'listing_updated', 'milestone_created'
    )),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADD ESSENTIAL INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_deal_rooms_buyer_id ON deal_rooms(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_seller_id ON deal_rooms(seller_id);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_listing_id ON deal_rooms(listing_id);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_proposal_id ON deal_rooms(proposal_id);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_status ON deal_rooms(status);
CREATE INDEX IF NOT EXISTS idx_deal_rooms_last_activity ON deal_rooms(last_activity_at DESC);

CREATE INDEX IF NOT EXISTS idx_proposals_listing_id ON proposals(listing_id);
CREATE INDEX IF NOT EXISTS idx_proposals_seller_id ON proposals(seller_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);

CREATE INDEX IF NOT EXISTS idx_deal_room_notifications_user_id ON deal_room_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_room_notifications_unread ON deal_room_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_deal_room_notifications_deal_room ON deal_room_notifications(deal_room_id);

CREATE INDEX IF NOT EXISTS idx_deal_room_activities_deal_room ON deal_room_activities(deal_room_id);
CREATE INDEX IF NOT EXISTS idx_deal_room_activities_created_at ON deal_room_activities(created_at DESC);

-- 7. VERIFY FOREIGN KEY CONSTRAINTS
DO $$
BEGIN
    -- Check deal_rooms foreign keys
    IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'deal_rooms' AND tc.constraint_type = 'FOREIGN KEY' 
        AND kcu.column_name = 'buyer_id'
    ) THEN
        ALTER TABLE deal_rooms ADD CONSTRAINT fk_deal_rooms_buyer 
        FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added buyer_id foreign key constraint';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'deal_rooms' AND tc.constraint_type = 'FOREIGN KEY' 
        AND kcu.column_name = 'seller_id'
    ) THEN
        ALTER TABLE deal_rooms ADD CONSTRAINT fk_deal_rooms_seller 
        FOREIGN KEY (seller_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added seller_id foreign key constraint';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'deal_rooms' AND tc.constraint_type = 'FOREIGN KEY' 
        AND kcu.column_name = 'listing_id'
    ) THEN
        ALTER TABLE deal_rooms ADD CONSTRAINT fk_deal_rooms_listing 
        FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added listing_id foreign key constraint';
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'deal_rooms' AND tc.constraint_type = 'FOREIGN KEY' 
        AND kcu.column_name = 'proposal_id'
    ) THEN
        ALTER TABLE deal_rooms ADD CONSTRAINT fk_deal_rooms_proposal 
        FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added proposal_id foreign key constraint';
    END IF;
    
    RAISE NOTICE 'Foreign key constraints validated ✓';
END $$;

-- 8. ENABLE ROW LEVEL SECURITY
ALTER TABLE deal_room_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_room_activities ENABLE ROW LEVEL SECURITY;

-- 9. CREATE RLS POLICIES FOR NEW TABLES
-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON deal_room_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON deal_room_notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Activities policies  
CREATE POLICY "Users can view activities in their deal rooms" ON deal_room_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM deal_rooms dr 
            WHERE dr.id = deal_room_activities.deal_room_id 
            AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert activities in their deal rooms" ON deal_room_activities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM deal_rooms dr 
            WHERE dr.id = deal_room_activities.deal_room_id 
            AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
        )
    );

-- 10. CREATE FUNCTION TO UPDATE LAST ACTIVITY
CREATE OR REPLACE FUNCTION update_deal_room_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE deal_rooms 
    SET last_activity_at = NOW() 
    WHERE id = NEW.deal_room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for activity updates
DROP TRIGGER IF EXISTS trigger_update_deal_room_activity_messages ON deal_room_messages;
CREATE TRIGGER trigger_update_deal_room_activity_messages
    AFTER INSERT ON deal_room_messages
    FOR EACH ROW EXECUTE FUNCTION update_deal_room_last_activity();

DROP TRIGGER IF EXISTS trigger_update_deal_room_activity_files ON deal_room_files;
CREATE TRIGGER trigger_update_deal_room_activity_files
    AFTER INSERT ON deal_room_files
    FOR EACH ROW EXECUTE FUNCTION update_deal_room_last_activity();

RAISE NOTICE '🎉 Phase 0 Database Validation Complete! All tables, indexes, and constraints are ready.';
