-- Get the exact constraint definition
SELECT 
    tc.constraint_name,
    cc.check_clause,
    tc.table_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'deal_room_messages' 
    AND tc.constraint_type = 'CHECK'
    AND tc.table_schema = 'public'
    AND tc.constraint_name LIKE '%sender_type%';

-- Also check the column definition
SELECT 
    column_name,
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'deal_room_messages' 
    AND column_name = 'sender_type'
    AND table_schema = 'public';

-- Check if there are any existing records to see what values work
SELECT DISTINCT sender_type 
FROM deal_room_messages 
LIMIT 10;
