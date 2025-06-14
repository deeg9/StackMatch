-- Smart migration: Handle cases where same user is both buyer and seller
-- We'll give them the "buyer" role in such cases, or create separate logic

-- First, let's see what we're working with
DO $$
DECLARE
    deal_room_record RECORD;
    user_is_both_buyer_and_seller BOOLEAN;
BEGIN
    -- Loop through each deal room that needs participant records
    FOR deal_room_record IN 
        SELECT DISTINCT dr.id, dr.buyer_id, dr.seller_id, dr.room_name
        FROM deal_rooms dr
        WHERE dr.buyer_id IS NOT NULL OR dr.seller_id IS NOT NULL
    LOOP
        -- Check if the same user is both buyer and seller
        user_is_both_buyer_and_seller := (deal_room_record.buyer_id = deal_room_record.seller_id);
        
        RAISE NOTICE 'Processing deal room: % (%) - Buyer: %, Seller: %, Same user: %', 
            deal_room_record.room_name, 
            deal_room_record.id, 
            deal_room_record.buyer_id, 
            deal_room_record.seller_id,
            user_is_both_buyer_and_seller;

        IF user_is_both_buyer_and_seller THEN
            -- Same user is both buyer and seller - create one record with "buyer" role
            -- (We can extend this logic later if needed)
            INSERT INTO deal_room_participants (deal_room_id, user_id, role, joined_at)
            VALUES (
                deal_room_record.id,
                deal_room_record.buyer_id,
                'buyer',
                NOW()
            )
            ON CONFLICT (deal_room_id, user_id) DO NOTHING;
            
            RAISE NOTICE 'Created single participant record for user % as buyer (same user scenario)', deal_room_record.buyer_id;
            
        ELSE
            -- Different users for buyer and seller - create separate records
            
            -- Insert buyer participant if buyer exists and no record exists
            IF deal_room_record.buyer_id IS NOT NULL THEN
                INSERT INTO deal_room_participants (deal_room_id, user_id, role, joined_at)
                VALUES (
                    deal_room_record.id,
                    deal_room_record.buyer_id,
                    'buyer',
                    NOW()
                )
                ON CONFLICT (deal_room_id, user_id) DO NOTHING;
                
                RAISE NOTICE 'Created buyer participant record for user %', deal_room_record.buyer_id;
            END IF;

            -- Insert seller participant if seller exists and no record exists
            IF deal_room_record.seller_id IS NOT NULL THEN
                INSERT INTO deal_room_participants (deal_room_id, user_id, role, joined_at)
                VALUES (
                    deal_room_record.id,
                    deal_room_record.seller_id,
                    'seller',
                    NOW()
                )
                ON CONFLICT (deal_room_id, user_id) DO NOTHING;
                
                RAISE NOTICE 'Created seller participant record for user %', deal_room_record.seller_id;
            END IF;
        END IF;
        
    END LOOP;
    
    RAISE NOTICE 'Migration completed successfully!';
END $$;

-- Verify the results
SELECT 
  dr.id as deal_room_id,
  dr.room_name,
  dr.buyer_id,
  dr.seller_id,
  drp.user_id as participant_user_id,
  drp.role as participant_role,
  drp.joined_at,
  CASE 
    WHEN dr.buyer_id = dr.seller_id THEN 'SAME_USER_SCENARIO'
    WHEN drp.user_id = dr.buyer_id THEN 'BUYER_MATCH'
    WHEN drp.user_id = dr.seller_id THEN 'SELLER_MATCH'
    ELSE 'NO_MATCH'
  END as scenario_type
FROM deal_rooms dr
LEFT JOIN deal_room_participants drp ON dr.id = drp.deal_room_id
ORDER BY dr.created_at, drp.joined_at;
