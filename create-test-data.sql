-- Create test data for marketplace
-- Run this in your Supabase SQL Editor

-- First, let's check if the aggregated_prices table has the submission_count column
-- If not, add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aggregated_prices' 
        AND column_name = 'submission_count'
    ) THEN
        ALTER TABLE aggregated_prices ADD COLUMN submission_count INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

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

-- Create some sample aggregated prices for price intelligence
INSERT INTO aggregated_prices (material_id, location, median_price, min_price, max_price, submission_count) 
SELECT 
  m.id,
  location,
  median_price,
  min_price,
  max_price,
  submission_count
FROM materials m
CROSS JOIN (
  VALUES 
    ('Kigali', 850.00, 800.00, 900.00, 15),
    ('Huye', 820.00, 780.00, 860.00, 12),
    ('Musanze', 870.00, 830.00, 920.00, 8),
    ('Rubavu', 840.00, 800.00, 880.00, 10)
) AS prices(location, median_price, min_price, max_price, submission_count)
WHERE m.name = 'Portland Cement'
ON CONFLICT (material_id, location) DO NOTHING;

INSERT INTO aggregated_prices (material_id, location, median_price, min_price, max_price, submission_count) 
SELECT 
  m.id,
  location,
  median_price,
  min_price,
  max_price,
  submission_count
FROM materials m
CROSS JOIN (
  VALUES 
    ('Kigali', 1200.00, 1150.00, 1250.00, 20),
    ('Huye', 1180.00, 1120.00, 1220.00, 15),
    ('Musanze', 1220.00, 1180.00, 1280.00, 12),
    ('Rubavu', 1190.00, 1140.00, 1240.00, 18)
) AS prices(location, median_price, min_price, max_price, submission_count)
WHERE m.name = 'Reinforcement Steel'
ON CONFLICT (material_id, location) DO NOTHING;

INSERT INTO aggregated_prices (material_id, location, median_price, min_price, max_price, submission_count) 
SELECT 
  m.id,
  location,
  median_price,
  min_price,
  max_price,
  submission_count
FROM materials m
CROSS JOIN (
  VALUES 
    ('Kigali', 650.00, 620.00, 680.00, 25),
    ('Huye', 630.00, 600.00, 660.00, 20),
    ('Musanze', 670.00, 640.00, 700.00, 15),
    ('Rubavu', 640.00, 610.00, 670.00, 22)
) AS prices(location, median_price, min_price, max_price, submission_count)
WHERE m.name = 'White Rice'
ON CONFLICT (material_id, location) DO NOTHING;

-- Create price history for trends (last 30 days)
INSERT INTO price_history (material_id, location, date, median_price, min_price, max_price, submission_count)
SELECT 
  m.id,
  'Kigali',
  CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 29),
  850 + (random() * 100 - 50), -- Random variation around 850
  800 + (random() * 50 - 25),  -- Random variation around 800
  900 + (random() * 50 - 25),  -- Random variation around 900
  (random() * 10 + 5)::integer -- Random submission count 5-15
FROM materials m
WHERE m.name = 'Portland Cement'
ON CONFLICT (material_id, location, date) DO NOTHING;

-- Add some sample price submissions
INSERT INTO price_submissions (user_id, material_id, price, quantity, location, status, submitted_at)
SELECT 
  NULL, -- No user_id since we don't have test users yet
  m.id,
  price,
  quantity,
  location,
  'approved',
  NOW() - INTERVAL '1 day' * (random() * 30)
FROM materials m
CROSS JOIN (
  VALUES 
    (850, 50, 'Kigali'),
    (820, 100, 'Huye'),
    (870, 25, 'Musanze'),
    (840, 75, 'Rubavu')
) AS submissions(price, quantity, location)
WHERE m.name = 'Portland Cement'
LIMIT 20;

-- Create a sample admin user profile (for testing)
-- Note: This won't work without actual auth user, but shows the structure
-- INSERT INTO profiles (id, email, role, name, business_name) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'admin@marketplace.rw', 'admin', 'Admin User', 'Marketplace Admin');

-- Show summary of test data created
SELECT 
  'Materials' as table_name,
  COUNT(*) as record_count
FROM materials
WHERE sector IS NOT NULL

UNION ALL

SELECT 
  'Aggregated Prices' as table_name,
  COUNT(*) as record_count
FROM aggregated_prices

UNION ALL

SELECT 
  'Price History' as table_name,
  COUNT(*) as record_count
FROM price_history

UNION ALL

SELECT 
  'Price Submissions' as table_name,
  COUNT(*) as record_count
FROM price_submissions;