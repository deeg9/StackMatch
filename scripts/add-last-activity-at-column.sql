-- Add last_activity_at column to deal_rooms table
DO $$ 
BEGIN
    -- Check if the column doesn't exist before adding it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'deal_rooms' 
        AND column_name = 'last_activity_at'
    ) THEN
        ALTER TABLE deal_rooms 
        ADD COLUMN last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        -- Update existing records to set last_activity_at to created_at
        UPDATE deal_rooms 
        SET last_activity_at = created_at 
        WHERE last_activity_at IS NULL;
        
        RAISE NOTICE 'Added last_activity_at column to deal_rooms table';
    ELSE
        RAISE NOTICE 'Column last_activity_at already exists in deal_rooms table';
    END IF;
END $$;
