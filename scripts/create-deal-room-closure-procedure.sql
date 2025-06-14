-- Create a stored procedure to handle the transaction for creating a deal room closure
CREATE OR REPLACE FUNCTION create_deal_room_closure(
  p_deal_room_id UUID,
  p_initiator_id UUID,
  p_initiator_type TEXT,
  p_reason_category TEXT,
  p_reason_description TEXT,
  p_cooling_period_ends_at TIMESTAMPTZ
) RETURNS JSONB AS $$
DECLARE
  v_closure_id UUID;
  v_requested_at TIMESTAMPTZ;
BEGIN
  -- Start transaction
  BEGIN
    -- Update deal room status to PENDING_CLOSURE
    UPDATE deal_rooms
    SET status = 'PENDING_CLOSURE'
    WHERE id = p_deal_room_id;
    
    -- Create closure record
    INSERT INTO deal_room_closures (
      deal_room_id,
      initiator_id,
      initiator_type,
      reason_category,
      reason_description,
      outcome_type,
      requested_at,
      cooling_period_ends_at
    ) VALUES (
      p_deal_room_id,
      p_initiator_id,
      p_initiator_type,
      p_reason_category,
      p_reason_description,
      'CANCELLED', -- Default outcome until confirmed
      NOW(),
      p_cooling_period_ends_at
    )
    RETURNING id, requested_at INTO v_closure_id, v_requested_at;
    
    -- Create system message about the closure request
    INSERT INTO deal_room_messages (
      deal_room_id,
      sender_id,
      sender_type,
      content,
      created_at,
      is_read
    ) VALUES (
      p_deal_room_id,
      p_initiator_id,
      'SYSTEM',
      format('Deal room closure has been requested by %s. Reason: %s. The cooling period ends on %s.',
             p_initiator_type,
             p_reason_category,
             to_char(p_cooling_period_ends_at, 'YYYY-MM-DD HH24:MI:SS')),
      NOW(),
      false
    );
    
    -- Return the created closure data
    RETURN jsonb_build_object(
      'id', v_closure_id,
      'requested_at', v_requested_at
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback transaction on error
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql;
