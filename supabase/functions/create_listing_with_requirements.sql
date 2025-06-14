CREATE OR REPLACE FUNCTION create_listing_with_requirements(
  p_title TEXT,
  p_description TEXT,
  p_buyer_id UUID,
  p_category_id UUID,
  p_budget_min NUMERIC DEFAULT NULL,
  p_budget_max NUMERIC DEFAULT NULL,
  p_bid_deadline TIMESTAMPTZ DEFAULT NULL,
  p_project_start_date DATE DEFAULT NULL,
  p_project_duration TEXT DEFAULT NULL,
  p_required_skills TEXT[] DEFAULT NULL,
  p_location_preference TEXT DEFAULT NULL,
  p_remote_preference TEXT DEFAULT NULL,
  p_requirements JSONB DEFAULT '[]'::JSONB
) RETURNS JSONB AS $$
DECLARE
  v_listing_id UUID;
  v_result JSONB;
  v_req JSONB;
BEGIN
  -- Insert the listing
  INSERT INTO listings (
    buyer_id,
    category_id,
    status,
    title,
    description,
    budget_min,
    budget_max,
    bid_deadline,
    project_start_date,
    project_duration,
    required_skills,
    location_preference,
    remote_preference,
    created_at,
    updated_at,
    view_count
  ) VALUES (
    p_buyer_id,
    p_category_id,
    'DRAFT',
    p_title,
    p_description,
    p_budget_min,
    p_budget_max,
    p_bid_deadline,
    p_project_start_date,
    p_project_duration,
    p_required_skills,
    p_location_preference,
    p_remote_preference,
    NOW(),
    NOW(),
    0
  ) RETURNING id INTO v_listing_id;
  
  -- Insert requirements if any
  IF jsonb_array_length(p_requirements) > 0 THEN
    FOR v_req IN SELECT * FROM jsonb_array_elements(p_requirements)
    LOOP
      INSERT INTO listing_requirements (
        listing_id,
        requirement,
        priority,
        order_index
      ) VALUES (
        v_listing_id,
        v_req->>'requirement',
        v_req->>'priority',
        (v_req->>'order_index')::INTEGER
      );
    END LOOP;
  END IF;
  
  -- Get the complete listing with requirements
  SELECT jsonb_build_object(
    'listing', row_to_json(l),
    'requirements', COALESCE(
      (SELECT jsonb_agg(row_to_json(r))
       FROM listing_requirements r
       WHERE r.listing_id = l.id),
      '[]'::jsonb
    )
  ) INTO v_result
  FROM listings l
  WHERE l.id = v_listing_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
