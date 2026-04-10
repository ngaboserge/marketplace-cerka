-- Simple demo suppliers creation that works around auth constraints
-- This creates materials and listings only, using existing supplier profiles

-- First, create materials if they don't exist
INSERT INTO materials (name, category, sector, unit, description, created_at) VALUES
-- CONSTRUCTION MATERIALS
('Portland Cement', 'Cement', 'construction', 'bag (50kg)', 'High-quality Portland cement for construction', now()),
('Steel Reinforcement Bars', 'Steel', 'construction', 'ton', 'Grade 60 steel rebar for concrete reinforcement', now()),
('Clay Bricks', 'Bricks', 'construction', 'piece', 'Standard clay bricks for construction', now()),
('Iron Roofing Sheets', 'Roofing', 'construction', 'sheet', 'Galvanized iron roofing sheets', now()),
('River Sand', 'Aggregates', 'construction', 'truck load', 'Clean river sand for construction', now()),
('Crushed Stones', 'Aggregates', 'construction', 'truck load', 'Machine crushed stones for concrete', now()),
('Floor Tiles', 'Tiles', 'construction', 'square meter', 'Ceramic floor tiles', now()),
('PVC Pipes', 'Plumbing', 'construction', 'meter', 'PVC pipes for water systems', now()),
('Electrical Cables', 'Electrical', 'construction', 'meter', 'Copper electrical cables', now()),
('Wall Paint', 'Paint', 'construction', 'liter', 'Interior and exterior wall paint', now()),

-- FOOD & AGRICULTURE
('Maize', 'Grains', 'food', 'kg', 'Fresh maize from local farms', now()),
('Rice', 'Grains', 'food', 'kg', 'Premium quality rice', now()),
('Irish Potatoes', 'Vegetables', 'food', 'kg', 'Fresh Irish potatoes', now()),
('Sweet Potatoes', 'Vegetables', 'food', 'kg', 'Orange-fleshed sweet potatoes', now()),
('Red Beans', 'Legumes', 'food', 'kg', 'High-protein red beans', now()),
('Bananas', 'Fruits', 'food', 'bunch', 'Fresh cooking bananas', now()),
('Coffee Beans', 'Cash Crops', 'food', 'kg', 'Arabica coffee beans', now()),
('Tea Leaves', 'Cash Crops', 'food', 'kg', 'Quality tea leaves', now()),
('Tomatoes', 'Vegetables', 'food', 'kg', 'Fresh tomatoes', now()),
('Onions', 'Vegetables', 'food', 'kg', 'Red and white onions', now()),
('Carrots', 'Vegetables', 'food', 'kg', 'Fresh carrots', now()),
('Cabbage', 'Vegetables', 'food', 'kg', 'Fresh cabbage heads', now()),
('Fertilizer', 'Inputs', 'food', 'bag (50kg)', 'NPK fertilizer for crops', now()),
('Seeds', 'Inputs', 'food', 'kg', 'Certified crop seeds', now()),

-- ELECTRONICS
('Smartphones', 'Mobile', 'electronics', 'piece', 'Android and iOS smartphones', now()),
('Laptops', 'Computers', 'electronics', 'piece', 'Business and personal laptops', now()),
('Desktop PCs', 'Computers', 'electronics', 'piece', 'Complete desktop systems', now()),
('LED TVs', 'Appliances', 'electronics', 'piece', 'Smart LED televisions', now()),
('Refrigerators', 'Appliances', 'electronics', 'piece', 'Energy-efficient refrigerators', now()),
('Solar Panels', 'Solar', 'electronics', 'piece', 'Solar panels for renewable energy', now()),
('Solar Batteries', 'Solar', 'electronics', 'piece', 'Deep cycle batteries', now()),
('Inverters', 'Solar', 'electronics', 'piece', 'Power inverters for solar systems', now()),
('Washing Machines', 'Appliances', 'electronics', 'piece', 'Automatic washing machines', now()),
('Air Conditioners', 'Appliances', 'electronics', 'piece', 'Split air conditioning units', now()),
('Printers', 'Office', 'electronics', 'piece', 'Inkjet and laser printers', now()),
('Tablets', 'Mobile', 'electronics', 'piece', 'Android and iOS tablets', now())
ON CONFLICT (name) DO NOTHING;

-- Create demo listings using your existing supplier profile
-- This will use the first supplier found in your profiles table

-- Create sample listings for construction materials
INSERT INTO supplier_listings (
    supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
    location, availability_status, photos, created_at, updated_at
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
    listing_data.created_at,
    listing_data.updated_at
FROM profiles p
CROSS JOIN (
    VALUES 
    ('Portland Cement', 'Premium Portland Cement 42.5N', 'High-grade Portland cement suitable for all construction projects. Meets ASTM standards. Fast setting and high strength. Bulk discounts available.', 18000, 10, 1000, 'Kigali', 'available', '["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]', now() - interval '2 days', now()),
    ('Steel Reinforcement Bars', 'Grade 60 Steel Rebar - All Sizes', 'High-tensile steel reinforcement bars. Available in 8mm to 32mm diameter. Certified quality with mill test certificates. Competitive bulk pricing.', 1800000, 1, 50, 'Kigali', 'available', '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]', now() - interval '1 day', now()),
    ('Clay Bricks', 'Machine-Made Clay Bricks', 'Uniform machine-made clay bricks. Standard size 215x102x65mm. High compressive strength. Perfect for load-bearing walls.', 175, 1000, 50000, 'Kigali', 'available', '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"]', now() - interval '3 days', now()),
    ('Tomatoes', 'Fresh Greenhouse Tomatoes', 'Premium greenhouse tomatoes. Pesticide-free. Harvested daily. Perfect for restaurants and supermarkets. Consistent quality guaranteed.', 1200, 50, 2000, 'Kigali', 'available', '["https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=500", "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500"]', now() - interval '1 day', now()),
    ('Irish Potatoes', 'Highland Irish Potatoes', 'Fresh Irish potatoes from Musanze highlands. Excellent for chips and cooking. Washed and sorted. Available year-round.', 800, 100, 5000, 'Kigali', 'available', '["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500", "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500"]', now() - interval '2 days', now()),
    ('Smartphones', 'Samsung Galaxy A34 5G', 'Latest Samsung Galaxy A34 with 5G connectivity. 128GB storage, 6GB RAM. 1-year warranty. Bulk discounts available for businesses.', 420000, 1, 100, 'Kigali', 'available', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"]', now() - interval '2 days', now()),
    ('Laptops', 'HP Pavilion 15 Business Laptop', 'HP Pavilion 15 with Intel i5 processor, 8GB RAM, 512GB SSD. Perfect for business and education. Volume pricing available.', 850000, 1, 50, 'Kigali', 'available', '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"]', now() - interval '1 day', now()),
    ('LED TVs', 'LG 43" 4K Smart TV', 'LG 43-inch 4K Smart TV with WebOS. Built-in WiFi, Netflix, YouTube. Energy efficient. 2-year warranty.', 520000, 1, 20, 'Kigali', 'available', '["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500", "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500"]', now() - interval '3 days', now()),
    ('Solar Panels', 'Monocrystalline Solar Panels 300W', '300W monocrystalline solar panels. 25-year performance warranty. High efficiency rating. Perfect for residential use.', 280000, 1, 100, 'Kigali', 'available', '["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500", "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=500"]', now() - interval '4 days', now()),
    ('Coffee Beans', 'Premium Arabica Coffee', 'Specialty grade Arabica coffee beans. Fully washed processing. Cupping score 85+. Fair trade certified.', 4200, 50, 2000, 'Kigali', 'available', '["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500"]', now() - interval '1 day', now())
) AS listing_data(material_name, title, description, price, min_quantity, max_quantity, location, availability_status, photos, created_at, updated_at)
JOIN materials m ON m.name = listing_data.material_name
WHERE p.role = 'supplier'
LIMIT 10;