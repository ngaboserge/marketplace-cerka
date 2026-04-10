-- Check what sectors are actually available in the database
-- Run this in your Supabase SQL Editor

-- 1. Check all sectors in materials table
SELECT DISTINCT sector, COUNT(*) as material_count
FROM materials 
WHERE sector IS NOT NULL AND status = 'active'
GROUP BY sector
ORDER BY material_count DESC;

-- 2. Check sectors that have actual listings
SELECT DISTINCT m.sector, COUNT(sl.*) as listing_count
FROM materials m
LEFT JOIN supplier_listings sl ON m.id = sl.material_id AND sl.status = 'active'
WHERE m.sector IS NOT NULL AND m.status = 'active'
GROUP BY m.sector
ORDER BY listing_count DESC;

-- 3. Check all materials with their sectors
SELECT name, category, sector, unit, icon
FROM materials 
WHERE status = 'active'
ORDER BY sector, category, name;