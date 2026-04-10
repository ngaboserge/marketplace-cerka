-- Fix marketplace issues with demo data

-- 1. Add missing columns to supplier_listings if they don't exist
DO $$ 
BEGIN
    -- Add view_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_listings' AND column_name = 'view_count') THEN
        ALTER TABLE supplier_listings ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Update all existing listings to have proper status and view counts
-- Handle status enum properly
UPDATE supplier_listings 
SET 
    status = 'active'::listing_status,
    view_count = CASE 
        WHEN title LIKE '%Premium%' OR title LIKE '%Samsung%' OR title LIKE '%HP%' THEN 15
        WHEN title LIKE '%Fresh%' OR title LIKE '%Highland%' THEN 12
        ELSE 8
    END
WHERE status IS NULL;

-- If the above fails, try without enum cast
UPDATE supplier_listings 
SET 
    view_count = CASE 
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

-- 5. Create some sample listing analytics for better functionality (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'listing_analytics') THEN
        INSERT INTO listing_analytics (listing_id, view_count, quote_request_count, last_viewed_at, created_at)
        SELECT 
            sl.id,
            COALESCE(sl.view_count, 8),
            FLOOR(RANDOM() * 5) + 1, -- Random quote requests between 1-5
            NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 7), -- Random last viewed in past week
            sl.created_at
        FROM supplier_listings sl
        WHERE NOT EXISTS (
            SELECT 1 FROM listing_analytics la WHERE la.listing_id = sl.id
        );
    END IF;
END $$;

-- 6. Update profiles to have better supplier data
UPDATE profiles 
SET 
    is_verified_supplier = true,
    average_rating = 4.2 + (RANDOM() * 0.6), -- Random rating between 4.2-4.8
    total_reviews = FLOOR(RANDOM() * 20) + 5 -- Random reviews between 5-25
WHERE role = 'supplier' AND (is_verified_supplier IS NULL OR average_rating IS NULL);

-- Verify the fixes
SELECT 
    'Total listings' as check_type,
    COUNT(*) as count
FROM supplier_listings 

UNION ALL

SELECT 
    'Listings with view_count' as check_type,
    COUNT(*) as count
FROM supplier_listings 
WHERE view_count > 0

UNION ALL

SELECT 
    'Materials with sectors' as check_type,
    COUNT(*) as count
FROM materials 
WHERE sector IS NOT NULL AND sector != ''

UNION ALL

SELECT 
    'Verified suppliers' as check_type,
    COUNT(*) as count
FROM profiles 
WHERE role = 'supplier' AND is_verified_supplier = true;