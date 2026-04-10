-- Simple marketplace fixes without touching enum status

-- 1. Add view_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_listings' AND column_name = 'view_count') THEN
        ALTER TABLE supplier_listings ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Update view counts for existing listings
UPDATE supplier_listings 
SET view_count = CASE 
    WHEN title LIKE '%Premium%' OR title LIKE '%Samsung%' OR title LIKE '%HP%' THEN 15
    WHEN title LIKE '%Fresh%' OR title LIKE '%Highland%' THEN 12
    ELSE 8
END
WHERE view_count IS NULL OR view_count = 0;

-- 3. Update availability_status to be consistent
UPDATE supplier_listings 
SET availability_status = 'available' 
WHERE availability_status IS NULL;

-- 4. Ensure all materials have proper sectors
UPDATE materials 
SET sector = CASE 
    WHEN name IN ('Portland Cement', 'Steel Reinforcement Bars', 'Clay Bricks', 'Iron Roofing Sheets', 'River Sand', 'Crushed Stones', 'Floor Tiles', 'PVC Pipes', 'Electrical Cables', 'Wall Paint') THEN 'construction'
    WHEN name IN ('Maize', 'Rice', 'Irish Potatoes', 'Sweet Potatoes', 'Red Beans', 'Bananas', 'Coffee Beans', 'Tea Leaves', 'Tomatoes', 'Onions', 'Carrots', 'Cabbage', 'Fertilizer', 'Seeds') THEN 'food'
    WHEN name IN ('Smartphones', 'Laptops', 'Desktop PCs', 'LED TVs', 'Refrigerators', 'Solar Panels', 'Solar Batteries', 'Inverters', 'Washing Machines', 'Air Conditioners', 'Printers', 'Tablets') THEN 'electronics'
    ELSE sector
END
WHERE sector IS NULL OR sector = '';

-- 5. Update profiles to have better supplier data
UPDATE profiles 
SET 
    is_verified_supplier = COALESCE(is_verified_supplier, true),
    average_rating = COALESCE(average_rating, 4.2 + (RANDOM() * 0.6)),
    total_reviews = COALESCE(total_reviews, FLOOR(RANDOM() * 20) + 5)
WHERE role = 'supplier';

-- 6. Check current status values to understand the enum
SELECT DISTINCT status, COUNT(*) 
FROM supplier_listings 
GROUP BY status;

-- 7. Show what we have now
SELECT 
    'Total listings' as info,
    COUNT(*) as count
FROM supplier_listings 

UNION ALL

SELECT 
    'Listings with view_count > 0' as info,
    COUNT(*) as count
FROM supplier_listings 
WHERE view_count > 0

UNION ALL

SELECT 
    'Available listings' as info,
    COUNT(*) as count
FROM supplier_listings 
WHERE availability_status = 'available'

UNION ALL

SELECT 
    'Materials with sectors' as info,
    COUNT(*) as count
FROM materials 
WHERE sector IS NOT NULL AND sector != '';