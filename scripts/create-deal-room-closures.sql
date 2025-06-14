-- Check if the deal_room_status type exists and has the required values
DO $$
BEGIN
    -- Check if the type exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deal_room_status') THEN
        -- Add new values if they don't exist
        BEGIN
            ALTER TYPE deal_room_status ADD VALUE IF NOT EXISTS 'PENDING_CLOSURE';
        EXCEPTION
            WHEN duplicate_object THEN
                RAISE NOTICE 'Value PENDING_CLOSURE already exists in deal_room_status';
        END;
        
        BEGIN
            ALTER TYPE deal_room_status ADD VALUE IF NOT EXISTS 'CLOSED_SUCCESSFULLY';
        EXCEPTION
            WHEN duplicate_object THEN
                RAISE NOTICE 'Value CLOSED_SUCCESSFULLY already exists in deal_room_status';
        END;
        
        BEGIN
            ALTER TYPE deal_room_status ADD VALUE IF NOT EXISTS 'CLOSED_UNSUCCESSFULLY';
        EXCEPTION
            WHEN duplicate_object THEN
                RAISE NOTICE 'Value CLOSED_UNSUCCESSFULLY already exists in deal_room_status';
        END;
    ELSE
        -- If the type doesn't exist, the status is likely stored as text
        -- We'll just make sure the deal_rooms table exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'deal_rooms') THEN
            RAISE EXCEPTION 'deal_rooms table does not exist';
        END IF;
    END IF;
END$$;

-- Create deal_room_closures table
CREATE TABLE IF NOT EXISTS deal_room_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
  initiator_id UUID NOT NULL REFERENCES profiles(id),
  initiator_type TEXT NOT NULL CHECK (initiator_type IN ('BUYER', 'SELLER')),
  reason_category TEXT NOT NULL,
  reason_description TEXT,
  outcome_type TEXT NOT NULL CHECK (outcome_type IN ('SUCCESSFUL', 'UNSUCCESSFUL', 'CANCELLED')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finalized_at TIMESTAMPTZ,
  cooling_period_ends_at TIMESTAMPTZ,
  feedback_buyer_rating INTEGER CHECK (feedback_buyer_rating BETWEEN 1 AND 5),
  feedback_buyer_comment TEXT,
  feedback_seller_rating INTEGER CHECK (feedback_seller_rating BETWEEN 1 AND 5),
  feedback_seller_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_deal_room_closures_deal_room_id ON deal_room_closures(deal_room_id);
CREATE INDEX IF NOT EXISTS idx_deal_room_closures_initiator_id ON deal_room_closures(initiator_id);
CREATE INDEX IF NOT EXISTS idx_deal_room_closures_outcome_type ON deal_room_closures(outcome_type);

-- Add RLS policies
ALTER TABLE deal_room_closures ENABLE ROW LEVEL SECURITY;

-- Participants can view closures for their deal rooms
CREATE POLICY "Users can view closures for their deal rooms" ON deal_room_closures
  FOR SELECT USING (
    deal_room_id IN (
      SELECT id FROM deal_rooms
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid() OR
      id IN (SELECT deal_room_id FROM deal_room_participants WHERE user_id = auth.uid())
    )
  );

-- Only participants can create closures
CREATE POLICY "Users can create closures for their deal rooms" ON deal_room_closures
  FOR INSERT WITH CHECK (
    deal_room_id IN (
      SELECT id FROM deal_rooms
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid() OR
      id IN (SELECT deal_room_id FROM deal_room_participants WHERE user_id = auth.uid())
    )
  );

-- Only the initiator or admin can update closures
CREATE POLICY "Users can update their own closures" ON deal_room_closures
  FOR UPDATE USING (
    initiator_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'ADMIN')
  );

-- Create a function to update the deal_room's last_activity_at when a closure is created or updated
CREATE OR REPLACE FUNCTION update_deal_room_last_activity_on_closure()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE deal_rooms
  SET last_activity_at = NOW()
  WHERE id = NEW.deal_room_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function
DROP TRIGGER IF EXISTS update_deal_room_last_activity_on_closure_trigger ON deal_room_closures;
CREATE TRIGGER update_deal_room_last_activity_on_closure_trigger
AFTER INSERT OR UPDATE ON deal_room_closures
FOR EACH ROW
EXECUTE FUNCTION update_deal_room_last_activity_on_closure();
