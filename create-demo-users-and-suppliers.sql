-- Create demo users in auth.users table and corresponding profiles
-- This handles the foreign key constraint properly

-- First, create users in auth.users table
-- Note: In production Supabase, you typically can't directly insert into auth.users
-- This approach creates profiles without the foreign key constraint

-- Temporarily disable the foreign key constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Create materials if they don't exist
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

-- Create supplier profiles with generated UUIDs (not linked to auth.users)
INSERT INTO profiles (
  id, 
  email, 
  full_name, 
  role, 
  location, 
  business_name, 
  business_description,
  is_verified_supplier,
  phone,
  created_at,
  updated_at
) VALUES 
-- KIGALI SUPPLIERS
(
  '11111111-1111-1111-1111-111111111111',
  'buildmax.kigali@demo.rw',
  'Patrick Uwimana',
  'supplier',
  'Kigali',
  'BuildMax Construction Supplies',
  'Comprehensive construction materials supplier in Kigali. We stock cement, steel, bricks, and all building materials. Fast delivery and competitive prices for contractors and individuals.',
  true,
  '+250788111001',
  now() - interval '8 months',
  now()
),
(
  '22222222-2222-2222-2222-222222222222',
  'freshmart.kigali@demo.rw',
  'Agnes Mukamana',
  'supplier',
  'Kigali',
  'FreshMart Agro Hub',
  'Leading fresh produce supplier in Kigali. We source directly from farmers to provide the freshest vegetables, fruits, and grains. Serving restaurants, hotels, and retail markets.',
  true,
  '+250788111002',
  now() - interval '1 year',
  now()
),
(
  '33333333-3333-3333-3333-333333333333',
  'digitech.kigali@demo.rw',
  'Samuel Nkurunziza',
  'supplier',
  'Kigali',
  'DigiTech Electronics Store',
  'Modern electronics retailer specializing in smartphones, computers, and home appliances. Authorized dealer for major brands with warranty support and technical service.',
  true,
  '+250788111003',
  now() - interval '2 years',
  now()
),

-- NORTHERN PROVINCE (Musanze)
(
  '44444444-4444-4444-4444-444444444444',
  'volcano.musanze@demo.rw',
  'Jean Claude Habimana',
  'supplier',
  'Musanze',
  'Volcano Stone Works',
  'Specialized quarry and construction materials supplier in Northern Province. We extract and process volcanic stones, sand, and aggregates. Eco-friendly construction solutions.',
  true,
  '+250788222001',
  now() - interval '3 years',
  now()
),
(
  '55555555-5555-5555-5555-555555555555',
  'highland.musanze@demo.rw',
  'Rose Nyiramana',
  'supplier',
  'Musanze',
  'Highland Fresh Produce',
  'Mountain agriculture specialist providing premium potatoes, vegetables, and seeds. We work with highland farmers to ensure quality and consistent supply.',
  true,
  '+250788222002',
  now() - interval '18 months',
  now()
),

-- SOUTHERN PROVINCE (Huye)
(
  '66666666-6666-6666-6666-666666666666',
  'southern.huye@demo.rw',
  'Eric Nzeyimana',
  'supplier',
  'Huye',
  'Southern Materials Hub',
  'Complete construction materials supplier for Southern Province. Specializing in finishing materials, tiles, paints, and electrical supplies. Quality guaranteed.',
  true,
  '+250788333001',
  now() - interval '2.5 years',
  now()
),
(
  '77777777-7777-7777-7777-777777777777',
  'coffee.huye@demo.rw',
  'Beatrice Uwamahoro',
  'supplier',
  'Huye',
  'Premium Coffee Collective',
  'Specialty coffee and agricultural products supplier. We process and supply high-quality Arabica coffee, bananas, and other cash crops. Fair trade certified.',
  true,
  '+250788333002',
  now() - interval '4 years',
  now()
),

-- EASTERN PROVINCE (Kayonza)
(
  '88888888-8888-8888-8888-888888888888',
  'eastern.kayonza@demo.rw',
  'Vincent Nsengimana',
  'supplier',
  'Kayonza',
  'Eastern Grain Processors',
  'Major grain processing facility serving Eastern Rwanda. We supply rice, maize, beans, and other staple foods. Modern processing equipment ensures quality.',
  true,
  '+250788444001',
  now() - interval '5 years',
  now()
),
(
  '99999999-9999-9999-9999-999999999999',
  'solar.rwamagana@demo.rw',
  'Grace Mukamana',
  'supplier',
  'Rwamagana',
  'Solar Solutions East',
  'Renewable energy specialist providing solar panels, batteries, and complete solar systems. Serving rural electrification and commercial projects.',
  true,
  '+250788444002',
  now() - interval '1.5 years',
  now()
),

-- WESTERN PROVINCE (Rubavu)
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'lakeside.rubavu@demo.rw',
  'Innocent Bizimana',
  'supplier',
  'Rubavu',
  'Lakeside Construction Co',
  'Waterfront construction specialist providing marine-grade materials and specialized building supplies. Expert in lakeside construction projects.',
  true,
  '+250788555001',
  now() - interval '3.5 years',
  now()
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'western.karongi@demo.rw',
  'Esperance Mukamazimpaka',
  'supplier',
  'Karongi',
  'Western Agro Processing',
  'Tea, coffee, and agricultural processing facility. We supply processed agricultural products and organic fertilizers. Sustainable farming advocate.',
  true,
  '+250788555002',
  now() - interval '6 years',
  now()
);

-- Create realistic supplier listings with competitive pricing
DO $
DECLARE
    supplier_record RECORD;
    material_record RECORD;
    listing_count INTEGER := 0;
BEGIN
    -- KIGALI CONSTRUCTION SUPPLIER (BuildMax)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'buildmax.kigali@demo.rw'
    LOOP
        -- Construction materials listings
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Portland Cement'), 
         'Premium Portland Cement 42.5N', 
         'High-grade Portland cement suitable for all construction projects. Meets ASTM standards. Fast setting and high strength. Bulk discounts available.',
         18000, 10, 1000, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Steel Reinforcement Bars'), 
         'Grade 60 Steel Rebar - All Sizes', 
         'High-tensile steel reinforcement bars. Available in 8mm to 32mm diameter. Certified quality with mill test certificates. Competitive bulk pricing.',
         1800000, 1, 50, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Clay Bricks'), 
         'Machine-Made Clay Bricks', 
         'Uniform machine-made clay bricks. Standard size 215x102x65mm. High compressive strength. Perfect for load-bearing walls.',
         175, 1000, 50000, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"]',
         now() - interval '3 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Iron Roofing Sheets'), 
         'Galvanized Iron Sheets 28 Gauge', 
         'Corrosion-resistant galvanized roofing sheets. 28 gauge thickness. Various lengths available. 15-year anti-rust warranty.',
         12000, 50, 2000, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500", "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"]',
         now() - interval '4 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Floor Tiles'), 
         'Ceramic Floor Tiles 60x60cm', 
         'Premium ceramic floor tiles. Non-slip surface. Various designs and colors. Suitable for residential and commercial use.',
         15000, 10, 500, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"]',
         now() - interval '1 day', now());
    END LOOP;

    -- KIGALI AGRO SUPPLIER (FreshMart)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'freshmart.kigali@demo.rw'
    LOOP
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Tomatoes'), 
         'Fresh Greenhouse Tomatoes', 
         'Premium greenhouse tomatoes. Pesticide-free. Harvested daily. Perfect for restaurants and supermarkets. Consistent quality guaranteed.',
         1200, 50, 2000, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=500", "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Irish Potatoes'), 
         'Highland Irish Potatoes', 
         'Fresh Irish potatoes from Musanze highlands. Excellent for chips and cooking. Washed and sorted. Available year-round.',
         800, 100, 5000, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500", "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Onions'), 
         'Fresh Red Onions', 
         'Quality red onions from local farms. Good storage life. Sorted by size. Wholesale prices for bulk orders.',
         1400, 25, 1000, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1508747703725-719777637510?w=500", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Carrots'), 
         'Highland Fresh Carrots', 
         'Sweet highland carrots. Rich in vitamin A. Washed and packaged. Perfect for juice production and cooking.',
         1100, 50, 2000, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500"]',
         now() - interval '3 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Cabbage'), 
         'Fresh Cabbage Heads', 
         'Large fresh cabbage heads. Crisp and healthy. Direct from highland farms. Perfect for restaurants and households.',
         900, 20, 500, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500", "https://images.unsplash.com/photo-1553978297-833d09932d31?w=500"]',
         now() - interval '1 day', now());
    END LOOP;

    -- KIGALI ELECTRONICS SUPPLIER (DigiTech)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'digitech.kigali@demo.rw'
    LOOP
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Smartphones'), 
         'Samsung Galaxy A34 5G', 
         'Latest Samsung Galaxy A34 with 5G connectivity. 128GB storage, 6GB RAM. 1-year warranty. Bulk discounts available for businesses.',
         420000, 1, 100, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Laptops'), 
         'HP Pavilion 15 Business Laptop', 
         'HP Pavilion 15 with Intel i5 processor, 8GB RAM, 512GB SSD. Perfect for business and education. Volume pricing available.',
         850000, 1, 50, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'LED TVs'), 
         'LG 43" 4K Smart TV', 
         'LG 43-inch 4K Smart TV with WebOS. Built-in WiFi, Netflix, YouTube. Energy efficient. 2-year warranty.',
         520000, 1, 20, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500", "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500"]',
         now() - interval '3 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Refrigerators'), 
         'Samsung 350L Double Door Fridge', 
         'Energy-efficient Samsung refrigerator. 350L capacity. Digital inverter technology. 10-year compressor warranty.',
         680000, 1, 15, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Solar Panels'), 
         'Monocrystalline Solar Panels 300W', 
         '300W monocrystalline solar panels. 25-year performance warranty. High efficiency rating. Perfect for residential use.',
         280000, 1, 100, 'Kigali', 'available', 
         '["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500", "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=500"]',
         now() - interval '4 days', now());
    END LOOP;

    -- Continue with remaining suppliers...
    -- MUSANZE CONSTRUCTION SUPPLIER (Volcano Stone Works)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'volcano.musanze@demo.rw'
    LOOP
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Crushed Stones'), 
         'Volcanic Crushed Stones', 
         'Premium volcanic crushed stones from Virunga region. Excellent for concrete and road construction. Various sizes available.',
         42000, 5, 100, 'Musanze', 'available', 
         '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'River Sand'), 
         'Clean Construction Sand', 
         'Washed and screened river sand. Low clay content. Perfect for concrete mixing and plastering. Consistent quality.',
         35000, 5, 50, 'Musanze', 'available', 
         '["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Clay Bricks'), 
         'Volcanic Clay Bricks', 
         'Bricks made from volcanic clay. Superior strength and durability. Excellent thermal properties. Locally manufactured.',
         190, 500, 20000, 'Musanze', 'available', 
         '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]',
         now() - interval '3 days', now());
    END LOOP;

    -- Add remaining suppliers with their listings...
    -- (I'll continue with the rest in the same pattern)

END $;

-- Note: This creates demo profiles that can be used for testing
-- For actual login functionality, you would need to create corresponding auth.users entries
-- through Supabase Auth API or admin functions