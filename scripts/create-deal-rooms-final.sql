-- Drop existing function if it exists
DROP FUNCTION IF EXISTS check_table_exists(text);
DROP FUNCTION IF EXISTS table_exists(text);

-- Create a new function with a different name to avoid conflicts
CREATE OR REPLACE FUNCTION does_table_exist(tbl_name text) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = tbl_name
  );
END;
$$ LANGUAGE plpgsql;

-- Create deal_rooms table if it doesn't exist
DO $$
BEGIN
  IF NOT does_table_exist('deal_rooms') THEN
    CREATE TABLE deal_rooms (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      room_name TEXT NOT NULL,
      listing_id UUID,
      proposal_id UUID,
      status TEXT DEFAULT 'ACTIVE',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    RAISE NOTICE 'Created deal_rooms table';
  ELSE
    RAISE NOTICE 'deal_rooms table already exists';
  END IF;
END;
$$;

-- Create deal_room_participants table if it doesn't exist
DO $$
BEGIN
  IF NOT does_table_exist('deal_room_participants') THEN
    CREATE TABLE deal_room_participants (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
      user_id UUID NOT NULL,
      role TEXT NOT NULL,
      joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(deal_room_id, user_id)
    );
    
    RAISE NOTICE 'Created deal_room_participants table';
  ELSE
    RAISE NOTICE 'deal_room_participants table already exists';
  END IF;
END;
$$;

-- Create deal_room_activities table if it doesn't exist
DO $$
BEGIN
  IF NOT does_table_exist('deal_room_activities') THEN
    CREATE TABLE deal_room_activities (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
      user_id UUID,
      activity_type TEXT NOT NULL,
      content JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    RAISE NOTICE 'Created deal_room_activities table';
  ELSE
    RAISE NOTICE 'deal_room_activities table already exists';
  END IF;
END;
$$;

-- Create deal_room_files table if it doesn't exist
DO $$
BEGIN
  IF NOT does_table_exist('deal_room_files') THEN
    CREATE TABLE deal_room_files (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      deal_room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_size BIGINT,
      file_type TEXT,
      uploaded_by UUID,
      category TEXT DEFAULT 'GENERAL',
      version INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    RAISE NOTICE 'Created deal_room_files table';
  ELSE
    RAISE NOTICE 'deal_room_files table already exists';
  END IF;
END;
$$;

-- Create a sample deal room for testing
DO $$
DECLARE
  v_user_id UUID := '1cae22cb-1311-48ca-9caa-47d474c0a20e'; -- The user ID from the logs
  v_deal_room_id UUID;
BEGIN
  -- Check if the user already has a deal room
  IF NOT EXISTS (
    SELECT 1 FROM deal_room_participants 
    WHERE user_id = v_user_id
  ) THEN
    -- Insert a sample deal room
    INSERT INTO deal_rooms (room_name, status)
    VALUES ('Sample Deal Room - Testing', 'ACTIVE')
    RETURNING id INTO v_deal_room_id;
    
    -- Add the user as a participant
    INSERT INTO deal_room_participants (deal_room_id, user_id, role)
    VALUES (v_deal_room_id, v_user_id, 'BUYER');
    
    -- Add a sample activity
    INSERT INTO deal_room_activities (deal_room_id, user_id, activity_type, content)
    VALUES (
      v_deal_room_id, 
      v_user_id, 
      'ROOM_CREATED', 
      '{"message": "Deal room created for testing purposes"}'::jsonb
    );
    
    RAISE NOTICE 'Created sample deal room with ID: %', v_deal_room_id;
  ELSE
    RAISE NOTICE 'User already has deal room participation';
  END IF;
END;
$$;

-- Enable RLS on all tables
ALTER TABLE deal_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_room_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_room_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view deal rooms they participate in" ON deal_rooms;
DROP POLICY IF EXISTS "Users can view their own participations" ON deal_room_participants;
DROP POLICY IF EXISTS "Users can view activities in their deal rooms" ON deal_room_activities;
DROP POLICY IF EXISTS "Users can view files in their deal rooms" ON deal_room_files;

-- Create RLS policies
CREATE POLICY "Users can view deal rooms they participate in" ON deal_rooms
  FOR SELECT USING (
    id IN (
      SELECT deal_room_id FROM deal_room_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own participations" ON deal_room_participants
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view activities in their deal rooms" ON deal_room_activities
  FOR SELECT USING (
    deal_room_id IN (
      SELECT deal_room_id FROM deal_room_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view files in their deal rooms" ON deal_room_files
  FOR SELECT USING (
    deal_room_id IN (
      SELECT deal_room_id FROM deal_room_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Grant necessary permissions
GRANT SELECT ON deal_rooms TO authenticated;
GRANT SELECT ON deal_room_participants TO authenticated;
GRANT SELECT ON deal_room_activities TO authenticated;
GRANT SELECT ON deal_room_files TO authenticated;

-- Show final status
SELECT 'Setup complete! Tables created and sample data inserted.' as status;
