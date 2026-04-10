-- Debug the actual data structure in supplier_listings
SELECT 
    sl.id,
    sl.title,
    sl.price,
    sl.photos,
    sl.availability_status,
    sl.location,
    sl.created_at,
    m.name as material_name,
    m.sector,
    m.category,
    m.unit,
    p.full_name,
    p.business_name,
    p.location as supplier_location,
    p.is_verified_supplier
FROM supplier_listings sl
LEFT JOIN materials m ON sl.material_id = m.id
LEFT JOIN profiles p ON sl.supplier_id = p.id
WHERE sl.status = 'active' OR sl.status IS NULL
ORDER BY sl.created_at DESC
LIMIT 10;