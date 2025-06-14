-- Check what columns exist in buyer_profiles table after our updates
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'buyer_profiles' 
ORDER BY ordinal_position;

-- Also check if there are any existing buyer profile records
SELECT COUNT(*) as total_buyer_profiles FROM buyer_profiles;

-- Check if Christopher Fill (the buyer) has a buyer profile
SELECT bp.*, p.full_name, p.email 
FROM buyer_profiles bp
JOIN profiles p ON bp.user_id = p.id
WHERE p.user_type = 'buyer';
