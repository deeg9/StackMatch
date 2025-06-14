-- Create a stored procedure to handle the transaction for confirming a deal room closure
CREATE OR REPLACE FUNCTION confirm_deal_room_closure(
  p_deal_room_id UUID,
  p_user_id UUID,
  p_user_role TEXT,
  p_outcome_type TEXT,
  p_feedback_rating INTEGER,
  p_feedback_comment TEXT
) RETURNS JSONB AS $$
DECLARE
  v_closure_id UUID;
  v_finalized_at TIMESTAMPTZ;
  v_new_status TEXT;
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
    
    -- Set the new deal room status based on outcome type
    IF p_outcome_type = 'SUCCESSFUL' THEN
      v_new_status := 'CLOSED_SUCCESSFULLY';
    ELSIF p_outcome_type = 'UNSUCCESSFUL' THEN
      v_new_status := 'CLOSED_UNSUCCESSFULLY';
    ELSE
      RAISE EXCEPTION 'Invalid outcome type: %', p_outcome_type;
    END IF;
    
    -- Update deal room status
    UPDATE deal_rooms
    SET 
      status = v_new_status,
      completed_at = NOW()
    WHERE id = p_deal_room_id;
    
    -- Update closure record
    UPDATE deal_room_closures
    SET 
      outcome_type = p_outcome_type,
      finalized_at = NOW()
    WHERE id = v_closure_id
    RETURNING finalized_at INTO v_finalized_at;
    
    -- Add feedback based on user role
    IF p_user_role = 'BUYER' THEN
      UPDATE deal_room_closures
      SET 
        feedback_buyer_rating = p_feedback_rating,
        feedback_buyer_comment = p_feedback_comment
      WHERE id = v_closure_id;
    ELSIF p_user_role = 'SELLER' THEN
      UPDATE deal_room_closures
      SET 
        feedback_seller_rating = p_feedback_rating,
        feedback_seller_comment = p_feedback_comment
      WHERE id = v_closure_id;
    END IF;
    
    -- Create system message about the closure confirmation
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
      format('Deal room has been %s closed by %s.',
             LOWER(p_outcome_type),
             p_user_role),
      NOW(),
      false
    );
    
    -- Return the confirmation data
    RETURN jsonb_build_object(
      'finalized_at', v_finalized_at
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback transaction on error
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql;
