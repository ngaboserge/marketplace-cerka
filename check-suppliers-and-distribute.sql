-- Check existing suppliers and distribute listings properly

-- First, let's see what suppliers we have
SELECT 
    id,
    email,
    full_name,
    business_name,
    location,
    role
FROM profiles 
WHERE role = 'supplier'
ORDER BY created_at;

-- Check how listings are currently distributed
SELECT 
    p.email,
    p.full_name,
    p.business_name,
    p.location,
    COUNT(sl.id) as listing_count
FROM profiles p
LEFT JOIN supplier_listings sl ON p.id = sl.supplier_id
WHERE p.role = 'supplier'
GROUP BY p.id, p.email, p.full_name, p.business_name, p.location
ORDER BY listing_count DESC;

-- Show some sample listings to see the current distribution
SELECT 
    sl.title,
    sl.price,
    sl.location as listing_location,
    p.email as supplier_email,
    p.business_name,
    p.location as supplier_location,
    m.name as material_name,
    m.sector
FROM supplier_listings sl
JOIN profiles p ON sl.supplier_id = p.id
JOIN materials m ON sl.material_id = m.id
ORDER BY sl.created_at DESC
LIMIT 10;