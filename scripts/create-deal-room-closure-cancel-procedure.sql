-- Create a stored procedure to handle the transaction for cancelling a deal room closure
CREATE OR REPLACE FUNCTION cancel_deal_room_closure(
  p_deal_room_id UUID,
  p_user_id UUID,
  p_user_role TEXT
) RETURNS JSONB AS $$
DECLARE
  v_closure_id UUID;
  v_cancelled_at TIMESTAMPTZ;
BEGIN
  -- Start transaction
  BEGIN
    -- Get the closure record
    SELECT id INTO v_closure_id
    FROM deal_room_closures
    WHERE deal_room_id = p_deal_room_id
    ORDER BY requested_at DESC
    LIMIT 1;
    
    IF v_closure_id IS NULL THEN
      RAISE EXCEPTION 'No closure request found for deal room %', p_deal_room_id;
    END IF;
    
    -- Update deal room status back to ACTIVE
    UPDATE deal_rooms
    SET status = 'ACTIVE'
    WHERE id = p_deal_room_id;
    
    -- Update closure record
    UPDATE deal_room_closures
    SET 
      outcome_type = 'CANCELLED',
      finalized_at = NOW()
    WHERE id = v_closure_id
    RETURNING finalized_at INTO v_cancelled_at;
    
    -- Create system message about the cancellation
    INSERT INTO deal_room_messages (
      deal_room_id,
      sender_id,
      sender_type,
      content,
      created_at,
      is_read
    ) VALUES (
      p_deal_room_id,
      p_user_id,
      'SYSTEM',
      format('Deal room closure request has been cancelled by %s.',
             p_user_role),
      NOW(),
      false
    );
    
    -- Return the cancellation data
    RETURN jsonb_build_object(
      'cancelled_at', v_cancelled_at
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback transaction on error
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql;
