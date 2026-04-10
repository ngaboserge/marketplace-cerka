-- Create demo suppliers across Rwanda with realistic data
-- All accounts use password: "demo123"

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

-- Create supplier profiles
INSERT INTO profiles (
  id, 
  email, 
  full_name, 
  role, 
  created_at,
  updated_at
) VALUES 
-- KIGALI SUPPLIERS
(
  gen_random_uuid(),
  'buildmax.kigali@demo.rw',
  'Patrick Uwimana',
  'supplier',
  now() - interval '8 months',
  now()
),
(
  gen_random_uuid(),
  'freshmart.kigali@demo.rw',
  'Agnes Mukamana',
  'supplier',
  now() - interval '1 year',
  now()
),
(
  gen_random_uuid(),
  'digitech.kigali@demo.rw',
  'Samuel Nkurunziza',
  'supplier',
  now() - interval '2 years',
  now()
),

-- NORTHERN PROVINCE (Musanze)
(
  gen_random_uuid(),
  'volcano.musanze@demo.rw',
  'Jean Claude Habimana',
  'supplier',
  now() - interval '3 years',
  now()
),
(
  gen_random_uuid(),
  'highland.musanze@demo.rw',
  'Rose Nyiramana',
  'supplier',
  now() - interval '18 months',
  now()
),

-- SOUTHERN PROVINCE (Huye)
(
  gen_random_uuid(),
  'southern.huye@demo.rw',
  'Eric Nzeyimana',
  'supplier',
  now() - interval '2.5 years',
  now()
),
(
  gen_random_uuid(),
  'coffee.huye@demo.rw',
  'Beatrice Uwamahoro',
  'supplier',
  now() - interval '4 years',
  now()
),

-- EASTERN PROVINCE (Kayonza)
(
  gen_random_uuid(),
  'eastern.kayonza@demo.rw',
  'Vincent Nsengimana',
  'supplier',
  now() - interval '5 years',
  now()
),
(
  gen_random_uuid(),
  'solar.rwamagana@demo.rw',
  'Grace Mukamana',
  'supplier',
  now() - interval '1.5 years',
  now()
),

-- WESTERN PROVINCE (Rubavu)
(
  gen_random_uuid(),
  'lakeside.rubavu@demo.rw',
  'Innocent Bizimana',
  'supplier',
  now() - interval '3.5 years',
  now()
),
(
  gen_random_uuid(),
  'western.karongi@demo.rw',
  'Esperance Mukamazimpaka',
  'supplier',
  now() - interval '6 years',
  now()
);

-- Create realistic supplier listings with competitive pricing
DO $$
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

    -- MUSANZE AGRO SUPPLIER (Highland Fresh Produce)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'highland.musanze@demo.rw'
    LOOP
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Irish Potatoes'), 
         'Musanze Highland Potatoes', 
         'Premium Irish potatoes from Musanze highlands. Export quality. High starch content. Perfect for processing.',
         750, 100, 10000, 'Musanze', 'available', 
         '["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500", "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Seeds'), 
         'Certified Potato Seeds', 
         'Certified potato seeds for planting. Disease-free. High yield varieties. Suitable for highland conditions.',
         2500, 10, 500, 'Musanze', 'available', 
         '["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Carrots'), 
         'Highland Carrots', 
         'Sweet highland carrots. Premium quality. Rich in nutrients. Perfect for export and local markets.',
         1000, 50, 1000, 'Musanze', 'available', 
         '["https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500"]',
         now() - interval '1 day', now());
    END LOOP;

    -- HUYE CONSTRUCTION SUPPLIER (Southern Materials Hub)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'southern.huye@demo.rw'
    LOOP
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Wall Paint'), 
         'Premium Interior Paint', 
         'High-coverage interior paint. Washable finish. Low VOC formula. Available in all colors. Professional quality.',
         12000, 5, 200, 'Huye', 'available', 
         '["https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500", "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'PVC Pipes'), 
         'PVC Water Pipes', 
         'High-quality PVC pipes for water supply. Pressure rated. Various diameters. UV resistant for outdoor use.',
         2400, 50, 1000, 'Huye', 'available', 
         '["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500", "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Electrical Cables'), 
         'Copper Electrical Cables', 
         'High-grade copper electrical cables. Various gauges available. Meets safety standards. Bulk pricing available.',
         850, 100, 5000, 'Huye', 'available', 
         '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]',
         now() - interval '3 days', now());
    END LOOP;

    -- HUYE AGRO SUPPLIER (Premium Coffee Collective)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'coffee.huye@demo.rw'
    LOOP
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Coffee Beans'), 
         'Premium Arabica Coffee', 
         'Specialty grade Arabica coffee beans. Fully washed processing. Cupping score 85+. Fair trade certified.',
         4200, 50, 2000, 'Huye', 'available', 
         '["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Bananas'), 
         'Fresh Cooking Bananas', 
         'Fresh cooking bananas from local farms. Uniform size. Good shelf life. Perfect for institutions.',
         2300, 20, 500, 'Huye', 'available', 
         '["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500", "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Fertilizer'), 
         'Organic Fertilizer', 
         'Organic compost fertilizer. Rich in nutrients. Environmentally friendly. Perfect for sustainable farming.',
         15000, 10, 200, 'Huye', 'available', 
         '["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500"]',
         now() - interval '1 day', now());
    END LOOP;

    -- KAYONZA AGRO SUPPLIER (Eastern Grain Processors)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'eastern.kayonza@demo.rw'
    LOOP
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Rice'), 
         'Premium Milled Rice', 
         'High-quality milled rice from Eastern Province. Modern processing facility. Consistent quality. Bulk supply available.',
         1100, 100, 10000, 'Kayonza', 'available', 
         '["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500", "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Red Beans'), 
         'Red Kidney Beans', 
         'Premium red kidney beans. Export quality. High protein content. Properly dried and sorted.',
         1750, 50, 5000, 'Kayonza', 'available', 
         '["https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500", "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Maize'), 
         'Dried Maize Grain', 
         'Quality dried maize grain. Low moisture content. Perfect for animal feed and human consumption.',
         900, 100, 8000, 'Kayonza', 'available', 
         '["https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500"]',
         now() - interval '1 day', now());
    END LOOP;

    -- RWAMAGANA ELECTRONICS SUPPLIER (Solar Solutions East)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'solar.rwamagana@demo.rw'
    LOOP
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Solar Batteries'), 
         'Deep Cycle Solar Batteries 200Ah', 
         '200Ah deep cycle batteries for solar systems. Long lifespan. Maintenance-free. Perfect for off-grid use.',
         380000, 1, 50, 'Rwamagana', 'available', 
         '["https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=500", "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Inverters'), 
         'Pure Sine Wave Inverters 3000W', 
         '3000W pure sine wave inverters. High efficiency. Built-in battery charger. Perfect for solar systems.',
         450000, 1, 20, 'Rwamagana', 'available', 
         '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Solar Panels'), 
         'Tier 1 Solar Panels 400W', 
         '400W monocrystalline solar panels. Tier 1 manufacturer. 25-year warranty. High efficiency rating.',
         320000, 1, 100, 'Rwamagana', 'available', 
         '["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500", "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=500"]',
         now() - interval '3 days', now());
    END LOOP;

    -- RUBAVU CONSTRUCTION SUPPLIER (Lakeside Construction Co)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'lakeside.rubavu@demo.rw'
    LOOP
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Portland Cement'), 
         'Marine Grade Cement', 
         'Special marine-grade cement for waterfront construction. Sulfate resistant. Perfect for lakeside projects.',
         19500, 10, 500, 'Rubavu', 'available', 
         '["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500"]',
         now() - interval '2 days', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Iron Roofing Sheets'), 
         'Coastal Roofing Sheets', 
         'Specially coated roofing sheets for coastal areas. Extra corrosion resistance. Perfect for lakeside buildings.',
         13500, 25, 1000, 'Rubavu', 'available', 
         '["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500", "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"]',
         now() - interval '1 day', now());
    END LOOP;

    -- KARONGI AGRO SUPPLIER (Western Agro Processing)
    FOR supplier_record IN 
        SELECT id FROM profiles WHERE email = 'western.karongi@demo.rw'
    LOOP
        INSERT INTO supplier_listings (
            supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
            location, availability_status, photos, created_at, updated_at
        ) VALUES
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Tea Leaves'), 
         'Premium CTC Tea Leaves', 
         'High-quality CTC tea leaves from Western Province plantations. Fresh processing. Export quality.',
         3100, 25, 1000, 'Karongi', 'available', 
         '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500"]',
         now() - interval '1 day', now()),
        
        (supplier_record.id, (SELECT id FROM materials WHERE name = 'Coffee Beans'), 
         'Washed Arabica Coffee', 
         'Fully washed Arabica coffee beans. High altitude grown. Excellent cup quality. Direct from farmers.',
         4000, 50, 1500, 'Karongi', 'available', 
         '["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500"]',
         now() - interval '2 days', now());
    END LOOP;

END $$;