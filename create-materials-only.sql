-- Simple materials data for testing category filtering
-- Run this in your Supabase SQL Editor

-- Update existing materials with sectors and icons
UPDATE materials SET 
  sector = 'construction',
  icon = '🏗️'
WHERE category IN ('Building Materials', 'steel', 'cement', 'concrete') AND sector IS NULL;

UPDATE materials SET 
  sector = 'agriculture',
  icon = '🌾'
WHERE category IN ('Grains', 'seeds', 'fertilizer') AND sector IS NULL;

UPDATE materials SET 
  sector = 'food',
  icon = '🍽️'
WHERE category IN ('food', 'beverages') AND sector IS NULL;

-- Add more sample materials with proper sectors and icons
INSERT INTO materials (name, unit, category, sector, icon, status) VALUES
  ('Portland Cement', 'bag', 'Building Materials', 'construction', '🏗️', 'active'),
  ('Reinforcement Steel', 'kg', 'Building Materials', 'construction', '🔩', 'active'),
  ('River Sand', 'truck', 'Building Materials', 'construction', '🏖️', 'active'),
  ('Clay Bricks', 'piece', 'Building Materials', 'construction', '🧱', 'active'),
  ('Roofing Sheets', 'piece', 'Building Materials', 'construction', '🏠', 'active'),
  
  ('White Rice', 'kg', 'Grains', 'agriculture', '🌾', 'active'),
  ('Red Beans', 'kg', 'Grains', 'agriculture', '🫘', 'active'),
  ('Yellow Maize', 'kg', 'Grains', 'agriculture', '🌽', 'active'),
  ('Sweet Potatoes', 'kg', 'Vegetables', 'agriculture', '🍠', 'active'),
  ('Irish Potatoes', 'kg', 'Vegetables', 'agriculture', '🥔', 'active'),
  
  ('Cooking Oil', 'liter', 'Food Products', 'food', '🛢️', 'active'),
  ('Sugar', 'kg', 'Food Products', 'food', '🍯', 'active'),
  ('Salt', 'kg', 'Food Products', 'food', '🧂', 'active'),
  ('Wheat Flour', 'kg', 'Food Products', 'food', '🌾', 'active'),
  
  ('Mobile Phones', 'piece', 'Electronics', 'electronics', '📱', 'active'),
  ('Laptops', 'piece', 'Electronics', 'electronics', '💻', 'active'),
  ('Solar Panels', 'piece', 'Electronics', 'electronics', '☀️', 'active')
ON CONFLICT (name) DO NOTHING;

-- Show summary of materials created
SELECT 
  'Materials with sectors' as table_name,
  COUNT(*) as record_count
FROM materials
WHERE sector IS NOT NULL;

-- Show materials by sector
SELECT 
  sector,
  category,
  COUNT(*) as product_count
FROM materials
WHERE sector IS NOT NULL
GROUP BY sector, category
ORDER BY sector, category;