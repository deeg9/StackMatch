-- Create a stored procedure to handle submitting feedback for a deal room closure
CREATE OR REPLACE FUNCTION submit_deal_room_feedback(
  p_deal_room_id UUID,
  p_user_role TEXT,
  p_rating INTEGER,
  p_comment TEXT
) RETURNS JSONB AS $$
DECLARE
  v_closure_id UUID;
  v_submitted_at TIMESTAMPTZ;
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
      RAISE EXCEPTION 'No closure record found for deal room %', p_deal_room_id;
    END IF;
    
    -- Set the current timestamp
    v_submitted_at := NOW();
    
    -- Update the closure record with feedback based on user role
    IF p_user_role = 'BUYER' THEN
      UPDATE deal_room_closures
      SET 
        feedback_buyer_rating = p_rating,
        feedback_buyer_comment = p_comment,
        updated_at = v_submitted_at
      WHERE id = v_closure_id;
    ELSIF p_user_role = 'SELLER' THEN
      UPDATE deal_room_closures
      SET 
        feedback_seller_rating = p_rating,
        feedback_seller_comment = p_comment,
        updated_at = v_submitted_at
      WHERE id = v_closure_id;
    ELSE
      RAISE EXCEPTION 'Invalid user role: %', p_user_role;
    END IF;
    
    -- Return the submission data
    RETURN jsonb_build_object(
      'submitted_at', v_submitted_at
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback transaction on error
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql;
