-- Check what the sender_type constraint allows
SELECT 
    tc.constraint_name, 
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'deal_room_messages' 
    AND tc.constraint_type = 'CHECK'
    AND tc.table_schema = 'public';

-- Also check if there's an enum type for sender_type
SELECT 
    t.typname,
    e.enumlabel
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname LIKE '%sender%' OR t.typname LIKE '%message%'
ORDER BY t.typname, e.enumsortorder;
