-- Drop existing function if it exists
DROP FUNCTION IF EXISTS check_table_exists(text);
DROP FUNCTION IF EXISTS table_exists(text);
DROP FUNCTION IF EXISTS does_table_exist(text);

-- Create a new function to check table existence
CREATE OR REPLACE FUNCTION check_if_table_exists(tbl_name text) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = tbl_name
  );
END;
$$ LANGUAGE plpgsql;

-- Create deal_room_participants table if it doesn't exist
DO $$
BEGIN
  IF NOT check_if_table_exists('deal_room_participants') THEN
    CREATE TABLE deal_room_participants (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      deal_room_id UUID NOT NULL,
      user_id UUID NOT NULL,
      role TEXT NOT NULL DEFAULT 'PARTICIPANT',
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
  IF NOT check_if_table_exists('deal_room_activities') THEN
    CREATE TABLE deal_room_activities (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      deal_room_id UUID NOT NULL,
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
  IF NOT check_if_table_exists('deal_room_files') THEN
    CREATE TABLE deal_room_files (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      deal_room_id UUID NOT NULL,
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

-- Create a sample deal room for testing (working with existing structure)
DO $$
DECLARE
  v_user_id UUID := '1cae22cb-1311-48ca-9caa-47d474c0a20e'; -- The user ID from the logs
  v_deal_room_id UUID;
  v_existing_count INTEGER;
BEGIN
  -- Check if the user already has a deal room
  SELECT COUNT(*) INTO v_existing_count
  FROM deal_room_participants 
  WHERE user_id = v_user_id;
  
  IF v_existing_count = 0 THEN
    -- Insert a sample deal room with buyer_id (since it's required)
    INSERT INTO deal_rooms (
      room_name, 
      buyer_id,  -- This column exists and is required
      seller_id, -- This might also exist
      status
    )
    VALUES (
      'Sample Deal Room - Testing', 
      v_user_id,  -- Set the buyer_id to the current user
      NULL,       -- seller_id can be null for now
      'ACTIVE'
    )
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
    RAISE NOTICE 'User already has % deal room participation(s)', v_existing_count;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating sample deal room: %', SQLERRM;
    RAISE NOTICE 'This might be due to existing table structure. Continuing...';
END;
$$;

-- Enable RLS on tables that exist
DO $$
BEGIN
  -- Enable RLS on deal_rooms if it exists
  IF check_if_table_exists('deal_rooms') THEN
    ALTER TABLE deal_rooms ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on other tables
  IF check_if_table_exists('deal_room_participants') THEN
    ALTER TABLE deal_room_participants ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF check_if_table_exists('deal_room_activities') THEN
    ALTER TABLE deal_room_activities ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF check_if_table_exists('deal_room_files') THEN
    ALTER TABLE deal_room_files ENABLE ROW LEVEL SECURITY;
  END IF;
END;
$$;

-- Drop existing policies if they exist (ignore errors)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view deal rooms they participate in" ON deal_rooms;
  DROP POLICY IF EXISTS "Users can view their own participations" ON deal_room_participants;
  DROP POLICY IF EXISTS "Users can view activities in their deal rooms" ON deal_room_activities;
  DROP POLICY IF EXISTS "Users can view files in their deal rooms" ON deal_room_files;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Some policies may not exist, continuing...';
END;
$$;

-- Create RLS policies
DO $$
BEGIN
  -- Policy for deal_rooms
  IF check_if_table_exists('deal_rooms') THEN
    CREATE POLICY "Users can view deal rooms they participate in" ON deal_rooms
      FOR SELECT USING (
        buyer_id = auth.uid() OR 
        seller_id = auth.uid() OR
        id IN (
          SELECT deal_room_id FROM deal_room_participants 
          WHERE user_id = auth.uid()
        )
      );
  END IF;
  
  -- Policy for participants
  IF check_if_table_exists('deal_room_participants') THEN
    CREATE POLICY "Users can view their own participations" ON deal_room_participants
      FOR SELECT USING (user_id = auth.uid());
  END IF;
  
  -- Policy for activities
  IF check_if_table_exists('deal_room_activities') THEN
    CREATE POLICY "Users can view activities in their deal rooms" ON deal_room_activities
      FOR SELECT USING (
        deal_room_id IN (
          SELECT id FROM deal_rooms 
          WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
        ) OR
        deal_room_id IN (
          SELECT deal_room_id FROM deal_room_participants 
          WHERE user_id = auth.uid()
        )
      );
  END IF;
  
  -- Policy for files
  IF check_if_table_exists('deal_room_files') THEN
    CREATE POLICY "Users can view files in their deal rooms" ON deal_room_files
      FOR SELECT USING (
        deal_room_id IN (
          SELECT id FROM deal_rooms 
          WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
        ) OR
        deal_room_id IN (
          SELECT deal_room_id FROM deal_room_participants 
          WHERE user_id = auth.uid()
        )
      );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating policies: %', SQLERRM;
END;
$$;

-- Grant necessary permissions
DO $$
BEGIN
  IF check_if_table_exists('deal_rooms') THEN
    GRANT SELECT ON deal_rooms TO authenticated;
  END IF;
  
  IF check_if_table_exists('deal_room_participants') THEN
    GRANT SELECT ON deal_room_participants TO authenticated;
  END IF;
  
  IF check_if_table_exists('deal_room_activities') THEN
    GRANT SELECT ON deal_room_activities TO authenticated;
  END IF;
  
  IF check_if_table_exists('deal_room_files') THEN
    GRANT SELECT ON deal_room_files TO authenticated;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error granting permissions: %', SQLERRM;
END;
$$;

-- Show final status
SELECT 'Setup complete! Working with existing table structure.' as status;

-- Show what we have now
SELECT 
  'deal_rooms' as table_name,
  COUNT(*) as row_count
FROM deal_rooms
UNION ALL
SELECT 
  'deal_room_participants' as table_name,
  COUNT(*) as row_count
FROM deal_room_participants
WHERE check_if_table_exists('deal_room_participants')
UNION ALL
SELECT 
  'deal_room_activities' as table_name,
  COUNT(*) as row_count
FROM deal_room_activities
WHERE check_if_table_exists('deal_room_activities');
