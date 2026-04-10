-- Temporary fix to test category filtering without authentication issues
-- Run this in your Supabase SQL Editor

-- 1. Temporarily disable RLS on key tables for testing
ALTER TABLE supplier_listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;

-- 2. Add some test materials with sectors and categories
INSERT INTO materials (name, unit, category, sector, icon, status) VALUES
  ('Portland Cement', 'bag', 'Building Materials', 'construction', '🏗️', 'active'),
  ('Reinforcement Steel', 'kg', 'Building Materials', 'construction', '🔩', 'active'),
  ('River Sand', 'truck', 'Building Materials', 'construction', '🏖️', 'active'),
  ('Clay Bricks', 'piece', 'Building Materials', 'construction', '🧱', 'active'),
  
  ('White Rice', 'kg', 'Grains', 'agriculture', '🌾', 'active'),
  ('Red Beans', 'kg', 'Grains', 'agriculture', '🫘', 'active'),
  ('Sweet Potatoes', 'kg', 'Vegetables', 'agriculture', '🍠', 'active'),
  ('Irish Potatoes', 'kg', 'Vegetables', 'agriculture', '🥔', 'active'),
  
  ('Cooking Oil', 'liter', 'Food Products', 'food', '🛢️', 'active'),
  ('Sugar', 'kg', 'Food Products', 'food', '🍯', 'active'),
  ('Salt', 'kg', 'Food Products', 'food', '🧂', 'active'),
  
  ('Mobile Phones', 'piece', 'Electronics', 'electronics', '📱', 'active'),
  ('Laptops', 'piece', 'Electronics', 'electronics', '💻', 'active')
ON CONFLICT (name) DO NOTHING;

-- 3. Show materials by sector and category for verification
SELECT 
  sector,
  category,
  name,
  unit,
  status
FROM materials
WHERE sector IS NOT NULL
ORDER BY sector, category, name;

-- 4. Test query that the frontend is trying to make
SELECT 
  sl.*,
  m.name as material_name,
  m.unit as material_unit,
  m.category as material_category,
  m.sector as material_sector
FROM supplier_listings sl
LEFT JOIN materials m ON sl.material_id = m.id
LIMIT 5;

-- Note: After testing, you should re-enable RLS with proper policies
-- ALTER TABLE supplier_listings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE materials ENABLE ROW LEVEL SECURITY;