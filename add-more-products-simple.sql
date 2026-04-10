-- Add more diverse products across Agriculture, Electronics, and Construction Materials

-- First, add more materials to expand the product catalog
INSERT INTO materials (name, category, sector, unit, description, created_at) VALUES

-- ADDITIONAL CONSTRUCTION MATERIALS
('Concrete Blocks', 'Blocks', 'construction', 'piece', 'Hollow concrete blocks for construction', now()),
('Ceramic Tiles', 'Tiles', 'construction', 'square meter', 'High-quality ceramic wall and floor tiles', now()),
('Aluminum Roofing', 'Roofing', 'construction', 'sheet', 'Lightweight aluminum roofing sheets', now()),
('Plywood Sheets', 'Wood', 'construction', 'sheet', 'Marine grade plywood sheets', now()),
('Steel Doors', 'Doors', 'construction', 'piece', 'Security steel doors for residential use', now()),
('Window Frames', 'Windows', 'construction', 'piece', 'Aluminum window frames with glass', now()),
('Bathroom Fixtures', 'Plumbing', 'construction', 'set', 'Complete bathroom fixture sets', now()),
('Ceiling Boards', 'Ceiling', 'construction', 'square meter', 'Gypsum ceiling boards', now()),
('Insulation Material', 'Insulation', 'construction', 'roll', 'Thermal insulation materials', now()),
('Concrete Mixer', 'Equipment', 'construction', 'piece', 'Portable concrete mixing machines', now()),

-- ADDITIONAL AGRICULTURE/FOOD MATERIALS
('Wheat Flour', 'Grains', 'food', 'kg', 'High-quality wheat flour for baking', now()),
('Cooking Oil', 'Oils', 'food', 'liter', 'Refined cooking oil from sunflower', now()),
('Dairy Milk', 'Dairy', 'food', 'liter', 'Fresh pasteurized cow milk', now()),
('Chicken Meat', 'Meat', 'food', 'kg', 'Fresh chicken meat from local farms', now()),
('Fish (Tilapia)', 'Fish', 'food', 'kg', 'Fresh tilapia fish from Lake Kivu', now()),
('Honey', 'Natural', 'food', 'kg', 'Pure natural honey from local beekeepers', now()),
('Avocados', 'Fruits', 'food', 'kg', 'Fresh Hass avocados for export', now()),
('Pineapples', 'Fruits', 'food', 'piece', 'Sweet pineapples from local farms', now()),
('Passion Fruits', 'Fruits', 'food', 'kg', 'Fresh passion fruits for juice production', now()),
('Groundnuts', 'Nuts', 'food', 'kg', 'Roasted groundnuts (peanuts)', now()),
('Sorghum', 'Grains', 'food', 'kg', 'Drought-resistant sorghum grain', now()),
('Cassava Flour', 'Flour', 'food', 'kg', 'Processed cassava flour', now()),
('Pesticides', 'Inputs', 'food', 'liter', 'Organic pesticides for crop protection', now()),
('Farm Tools', 'Tools', 'food', 'piece', 'Hand tools for farming activities', now()),

-- ADDITIONAL ELECTRONICS
('Desktop Computers', 'Computers', 'electronics', 'piece', 'Complete desktop computer systems', now()),
('Computer Monitors', 'Computers', 'electronics', 'piece', 'LED computer monitors various sizes', now()),
('Keyboards & Mice', 'Accessories', 'electronics', 'set', 'Wireless keyboard and mouse sets', now()),
('External Hard Drives', 'Storage', 'electronics', 'piece', 'Portable external storage drives', now()),
('USB Flash Drives', 'Storage', 'electronics', 'piece', 'High-speed USB flash drives', now()),
('Headphones', 'Audio', 'electronics', 'piece', 'Wireless and wired headphones', now()),
('Speakers', 'Audio', 'electronics', 'piece', 'Bluetooth and wired speakers', now()),
('Power Banks', 'Accessories', 'electronics', 'piece', 'Portable phone chargers', now()),
('Phone Cases', 'Accessories', 'electronics', 'piece', 'Protective cases for smartphones', now()),
('Cables & Chargers', 'Accessories', 'electronics', 'piece', 'USB cables and phone chargers', now()),
('Security Cameras', 'Security', 'electronics', 'piece', 'IP security cameras for surveillance', now()),
('WiFi Routers', 'Networking', 'electronics', 'piece', 'Wireless internet routers', now()),
('UPS Systems', 'Power', 'electronics', 'piece', 'Uninterruptible power supply units', now()),
('Electric Generators', 'Power', 'electronics', 'piece', 'Portable electric generators', now())

ON CONFLICT (name) DO NOTHING;

-- Add more product listings using existing suppliers
-- CONSTRUCTION MATERIALS LISTINGS
INSERT INTO supplier_listings (
    supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
    location, availability_status, photos, view_count, created_at, updated_at
) 
SELECT 
    p.id as supplier_id,
    m.id as material_id,
    listing_data.title,
    listing_data.description,
    listing_data.price,
    listing_data.min_quantity,
    listing_data.max_quantity,
    listing_data.location,
    listing_data.availability_status,
    listing_data.photos::jsonb,
    listing_data.view_count,
    listing_data.created_at,
    listing_data.updated_at
FROM profiles p
CROSS JOIN (
    VALUES 
    ('Concrete Blocks', 'Hollow Concrete Blocks 15cm', 'Standard hollow concrete blocks for wall construction. High strength and durability. Perfect for residential and commercial buildings.', 450, 100, 10000, 'Kigali', 'available', '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]', 12, now() - interval '1 day', now()),
    ('Ceramic Tiles', 'Premium Ceramic Wall Tiles', 'High-quality ceramic tiles for bathrooms and kitchens. Water-resistant and easy to clean. Various colors and patterns available.', 25000, 5, 200, 'Kigali', 'available', '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500", "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500"]', 18, now() - interval '2 days', now()),
    ('Steel Doors', 'Security Steel Doors', 'Heavy-duty steel doors for maximum security. Anti-theft design with multiple locking points. Suitable for homes and offices.', 180000, 1, 20, 'Kigali', 'available', '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]', 9, now() - interval '3 days', now()),
    ('Plywood Sheets', 'Marine Grade Plywood 18mm', 'High-quality marine grade plywood sheets. Water-resistant and durable. Perfect for furniture making and construction.', 35000, 5, 100, 'Huye', 'available', '["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500", "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"]', 8, now() - interval '4 days', now()),
    ('Window Frames', 'Aluminum Window Frames with Glass', 'Complete aluminum window frames with double-glazed glass. Energy efficient and weather resistant. Various sizes available.', 45000, 2, 50, 'Musanze', 'available', '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]', 10, now() - interval '5 days', now()),
    ('Aluminum Roofing', 'Lightweight Aluminum Roofing Sheets', 'Corrosion-resistant aluminum roofing sheets. Lightweight yet durable. Perfect for modern construction projects.', 15000, 20, 500, 'Rubavu', 'available', '["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500", "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"]', 11, now() - interval '2 days', now())
) AS listing_data(material_name, title, description, price, min_quantity, max_quantity, location, availability_status, photos, view_count, created_at, updated_at)
JOIN materials m ON m.name = listing_data.material_name
WHERE p.role = 'supplier'
LIMIT 6;

-- AGRICULTURE/FOOD LISTINGS
INSERT INTO supplier_listings (
    supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
    location, availability_status, photos, view_count, created_at, updated_at
) 
SELECT 
    p.id as supplier_id,
    m.id as material_id,
    listing_data.title,
    listing_data.description,
    listing_data.price,
    listing_data.min_quantity,
    listing_data.max_quantity,
    listing_data.location,
    listing_data.availability_status,
    listing_data.photos::jsonb,
    listing_data.view_count,
    listing_data.created_at,
    listing_data.updated_at
FROM profiles p
CROSS JOIN (
    VALUES 
    ('Wheat Flour', 'Premium Wheat Flour Grade A', 'High-quality wheat flour perfect for bread making and baking. Finely milled and enriched with vitamins. Bulk supply available.', 1800, 25, 2000, 'Kayonza', 'available', '["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500", "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500"]', 14, now() - interval '1 day', now()),
    ('Avocados', 'Export Quality Hass Avocados', 'Premium Hass avocados ready for export. Perfectly ripened and sorted by size. Direct from highland farms with consistent supply.', 3500, 50, 1000, 'Kayonza', 'available', '["https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500"]', 22, now() - interval '2 days', now()),
    ('Honey', 'Pure Natural Honey', 'Raw unprocessed honey from local beekeepers. Rich in natural enzymes and antioxidants. Perfect for health-conscious consumers.', 8500, 5, 100, 'Kayonza', 'available', '["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500"]', 16, now() - interval '1 day', now()),
    ('Passion Fruits', 'Fresh Passion Fruits for Juice', 'High-quality passion fruits perfect for juice production. Sweet and aromatic. Harvested at optimal ripeness for maximum flavor.', 4200, 20, 500, 'Huye', 'available', '["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500", "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500"]', 17, now() - interval '2 days', now()),
    ('Sorghum', 'Drought-Resistant Sorghum Grain', 'High-quality sorghum grain suitable for animal feed and human consumption. Drought-resistant variety with high nutritional value.', 1200, 50, 2000, 'Musanze', 'available', '["https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500"]', 7, now() - interval '3 days', now()),
    ('Cooking Oil', 'Refined Sunflower Cooking Oil', 'Premium refined sunflower oil for cooking and frying. Heart-healthy and cholesterol-free. Available in bulk quantities.', 3200, 10, 500, 'Kigali', 'available', '["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500", "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500"]', 13, now() - interval '1 day', now())
) AS listing_data(material_name, title, description, price, min_quantity, max_quantity, location, availability_status, photos, view_count, created_at, updated_at)
JOIN materials m ON m.name = listing_data.material_name
WHERE p.role = 'supplier'
LIMIT 6;

-- ELECTRONICS LISTINGS
INSERT INTO supplier_listings (
    supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
    location, availability_status, photos, view_count, created_at, updated_at
) 
SELECT 
    p.id as supplier_id,
    m.id as material_id,
    listing_data.title,
    listing_data.description,
    listing_data.price,
    listing_data.min_quantity,
    listing_data.max_quantity,
    listing_data.location,
    listing_data.availability_status,
    listing_data.photos::jsonb,
    listing_data.view_count,
    listing_data.created_at,
    listing_data.updated_at
FROM profiles p
CROSS JOIN (
    VALUES 
    ('Desktop Computers', 'Business Desktop Computers', 'Complete desktop systems with Intel i5 processor, 8GB RAM, 256GB SSD. Perfect for office work and business applications. 3-year warranty.', 650000, 1, 50, 'Rwamagana', 'available', '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"]', 11, now() - interval '2 days', now()),
    ('Security Cameras', 'IP Security Camera System', 'High-definition IP security cameras with night vision. Remote monitoring via smartphone app. Complete with recording system.', 85000, 1, 30, 'Rwamagana', 'available', '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=500"]', 19, now() - interval '1 day', now()),
    ('Power Banks', 'High Capacity Power Banks 20000mAh', 'Fast-charging power banks with multiple USB ports. LED display shows remaining power. Compatible with all smartphone brands.', 25000, 5, 200, 'Rwamagana', 'available', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"]', 13, now() - interval '3 days', now()),
    ('Computer Monitors', '24" LED Computer Monitors', 'High-resolution LED monitors perfect for office work and gaming. Full HD display with multiple connectivity options.', 180000, 1, 30, 'Kigali', 'available', '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"]', 15, now() - interval '2 days', now()),
    ('WiFi Routers', 'High-Speed WiFi Routers', 'Dual-band wireless routers with high-speed internet connectivity. Perfect for homes and small offices. Easy setup and management.', 45000, 1, 50, 'Kigali', 'available', '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=500"]', 12, now() - interval '4 days', now()),
    ('Headphones', 'Wireless Bluetooth Headphones', 'Premium wireless headphones with noise cancellation. Long battery life and superior sound quality. Compatible with all devices.', 35000, 2, 100, 'Kigali', 'available', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"]', 18, now() - interval '1 day', now())
) AS listing_data(material_name, title, description, price, min_quantity, max_quantity, location, availability_status, photos, view_count, created_at, updated_at)
JOIN materials m ON m.name = listing_data.material_name
WHERE p.role = 'supplier'
LIMIT 6;

-- Update some existing listings to have better view counts for variety
UPDATE supplier_listings 
SET view_count = CASE 
    WHEN title LIKE '%Premium%' OR title LIKE '%Samsung%' OR title LIKE '%HP%' OR title LIKE '%Export%' THEN 20 + FLOOR(RANDOM() * 10)
    WHEN title LIKE '%Fresh%' OR title LIKE '%Highland%' OR title LIKE '%Security%' THEN 15 + FLOOR(RANDOM() * 8)
    ELSE 8 + FLOOR(RANDOM() * 5)
END
WHERE view_count < 10;

-- Show summary of what we added
SELECT 
    'Total materials' as summary,
    COUNT(*) as count
FROM materials

UNION ALL

SELECT 
    'Construction materials' as summary,
    COUNT(*) as count
FROM materials 
WHERE sector = 'construction'

UNION ALL

SELECT 
    'Food/Agriculture materials' as summary,
    COUNT(*) as count
FROM materials 
WHERE sector = 'food'

UNION ALL

SELECT 
    'Electronics materials' as summary,
    COUNT(*) as count
FROM materials 
WHERE sector = 'electronics'

UNION ALL

SELECT 
    'Total listings' as summary,
    COUNT(*) as count
FROM supplier_listings

UNION ALL

SELECT 
    'Listings with high view count (>15)' as summary,
    COUNT(*) as count
FROM supplier_listings 
WHERE view_count > 15;