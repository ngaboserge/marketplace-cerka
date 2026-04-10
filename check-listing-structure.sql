-- Check supplier_listings table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'supplier_listings' 
ORDER BY ordinal_position;

-- Check if title column exists
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'supplier_listings' 
    AND column_name = 'title'
) as title_column_exists;

-- Check sample listings to see what data we have
SELECT 
    id,
    title,
    material_id,
    supplier_id,
    price,
    location,
    status,
    created_at
FROM supplier_listings 
ORDER BY created_at DESC 
LIMIT 5;