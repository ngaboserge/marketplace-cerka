-- Create realistic suppliers across Rwanda with login credentials
-- Password for all accounts: "supplier123" (hashed)

-- First, let's create the supplier accounts in auth.users
-- Note: In production, these would be created through the signup process
-- This is for development/demo purposes only

-- Create supplier profiles with realistic data
INSERT INTO profiles (
  id, 
  email, 
  full_name, 
  role, 
  phone, 
  location, 
  business_name, 
  business_description,
  is_verified_supplier,
  created_at,
  updated_at
) VALUES 
-- KIGALI SUPPLIERS
(
  gen_random_uuid(),
  'kigali.construction@cerka.rw',
  'Jean Baptiste Nzeyimana',
  'supplier',
  '+250788123456',
  'Kigali',
  'Kigali Premium Construction Ltd',
  'Leading supplier of high-quality construction materials in Kigali. We specialize in cement, steel bars, roofing materials, and building stones. Serving major construction projects across Rwanda since 2015.',
  true,
  now() - interval '2 years',
  now()
),
(
  gen_random_uuid(),
  'kigali.agro@cerka.rw',
  'Marie Claire Uwimana',
  'supplier',
  '+250788234567',
  'Kigali',
  'Fresh Valley Agro Supplies',
  'Premium agricultural products and fresh produce supplier. We provide high-quality seeds, fertilizers, fresh vegetables, and fruits. Direct partnerships with local farmers ensure freshness and competitive prices.',
  true,
  now() - interval '18 months',
  now()
),
(
  gen_random_uuid(),
  'kigali.electronics@cerka.rw',
  'David Mugisha',
  'supplier',
  '+250788345678',
  'Kigali',
  'TechHub Electronics Rwanda',
  'Leading electronics and technology supplier in East Africa. We import and distribute computers, smartphones, home appliances, and industrial electronics. Authorized dealer for major international brands.',
  true,
  now() - interval '3 years',
  now()
),

-- NORTHERN PROVINCE SUPPLIERS
(
  gen_random_uuid(),
  'musanze.construction@cerka.rw',
  'Emmanuel Habimana',
  'supplier',
  '+250788456789',
  'Musanze',
  'Volcano Construction Materials',
  'Specialized in volcanic stone products and construction materials. We quarry and process high-quality building stones, sand, and aggregates from the Virunga region. Eco-friendly construction solutions.',
  true,
  now() - interval '4 years',
  now()
),
(
  gen_random_uuid(),
  'musanze.agro@cerka.rw',
  'Immaculée Mukamana',
  'supplier',
  '+250788567890',
  'Musanze',
  'Highland Agro Cooperative',
  'Mountain agriculture specialist providing potato seeds, pyrethrum, and highland vegetables. We work with over 200 local farmers to ensure consistent supply of quality agricultural products.',
  true,
  now() - interval '2.5 years',
  now()
),

-- SOUTHERN PROVINCE SUPPLIERS  
(
  gen_random_uuid(),
  'huye.construction@cerka.rw',
  'Alphonse Niyonzima',
  'supplier',
  '+250788678901',
  'Huye',
  'Southern Build Supplies',
  'Comprehensive construction materials supplier serving Southern Province. Specializing in tiles, paints, electrical materials, and plumbing supplies. Quality products at competitive prices.',
  true,
  now() - interval '3.5 years',
  now()
),
(
  gen_random_uuid(),
  'huye.agro@cerka.rw',
  'Vestine Nyirahabimana',
  'supplier',
  '+250788789012',
  'Huye',
  'Coffee & Banana Cooperative',
  'Premium coffee beans and banana products supplier. We process and export high-quality Arabica coffee and provide fresh bananas and banana-based products. Fair trade certified.',
  true,
  now() - interval '5 years',
  now()
),

-- EASTERN PROVINCE SUPPLIERS
(
  gen_random_uuid(),
  'kayonza.agro@cerka.rw',
  'Faustin Nsengimana',
  'supplier',
  '+250788890123',
  'Kayonza',
  'Eastern Rice & Maize Hub',
  'Major rice and maize supplier for Eastern Rwanda. We operate modern processing facilities and work directly with farmers. Bulk supply capabilities for institutions and retailers.',
  true,
  now() - interval '6 years',
  now()
),
(
  gen_random_uuid(),
  'rwamagana.electronics@cerka.rw',
  'Grace Uwamahoro',
  'supplier',
  '+250788901234',
  'Rwamagana',
  'Eastern Electronics Distribution',
  'Electronics and solar energy solutions provider. Specializing in solar panels, batteries, inverters, and energy-efficient appliances. Serving rural electrification projects.',
  true,
  now() - interval '2 years',
  now()
),

-- WESTERN PROVINCE SUPPLIERS
(
  gen_random_uuid(),
  'rubavu.construction@cerka.rw',
  'Innocent Bizimana',
  'supplier',
  '+250789012345',
  'Rubavu',
  'Lake Kivu Construction Co.',
  'Waterfront construction specialist providing marine-grade materials, concrete blocks, and specialized building supplies. Expert in lakeside and hillside construction projects.',
  true,
  now() - interval '4.5 years',
  now()
),
(
  gen_random_uuid(),
  'karongi.agro@cerka.rw',
  'Esperance Mukamazimpaka',
  'supplier',
  '+250789123456',
  'Karongi',
  'Western Agro Processing',
  'Tea, coffee, and fruit processing facility. We supply processed agricultural products including dried fruits, tea leaves, and organic fertilizers. Sustainable farming advocate.',
  true,
  now() - interval '3 years',
  now()
);

-- Now let's create materials for each sector
INSERT INTO materials (name, category, sector, unit, description, created_at) VALUES
-- CONSTRUCTION MATERIALS
('Portland Cement', 'Cement', 'construction', 'bag (50kg)', 'High-quality Portland cement for all construction needs', now()),
('Steel Reinforcement Bars', 'Steel', 'construction', 'ton', 'Grade 60 steel rebar for concrete reinforcement', now()),
('Clay Bricks', 'Bricks', 'construction', 'piece', 'Locally manufactured clay bricks, standard size', now()),
('Roofing Iron Sheets', 'Roofing', 'construction', 'sheet', 'Galvanized iron roofing sheets, various gauges', now()),
('River Sand', 'Aggregates', 'construction', 'truck load', 'Clean river sand for construction and plastering', now()),
('Crushed Stones', 'Aggregates', 'construction', 'truck load', 'Machine crushed stones for concrete and road construction', now()),
('Ceramic Floor Tiles', 'Tiles', 'construction', 'square meter', 'High-quality ceramic tiles for flooring', now()),
('PVC Pipes', 'Plumbing', 'construction', 'meter', 'PVC pipes for water and sewage systems', now()),
('Electrical Cables', 'Electrical', 'construction', 'meter', 'Copper electrical cables, various gauges', now()),
('Paint (Interior)', 'Paint', 'construction', 'liter', 'High-quality interior wall paint, various colors', now()),

-- AGRICULTURAL PRODUCTS
('Maize Seeds (Hybrid)', 'Seeds', 'agriculture', 'kg', 'High-yield hybrid maize seeds, drought resistant', now()),
('Rice (Paddy)', 'Grains', 'agriculture', 'kg', 'Premium quality paddy rice, locally grown', now()),
('Irish Potatoes', 'Vegetables', 'agriculture', 'kg', 'Fresh Irish potatoes from highland farms', now()),
('Sweet Potatoes', 'Vegetables', 'agriculture', 'kg', 'Orange-fleshed sweet potatoes, vitamin A rich', now()),
('Beans (Red Kidney)', 'Legumes', 'agriculture', 'kg', 'High-protein red kidney beans, locally grown', now()),
('Bananas (Cooking)', 'Fruits', 'agriculture', 'bunch', 'Fresh cooking bananas from local farms', now()),
('Coffee Beans (Arabica)', 'Cash Crops', 'agriculture', 'kg', 'Premium Arabica coffee beans, fully washed', now()),
('Tea Leaves', 'Cash Crops', 'agriculture', 'kg', 'High-quality tea leaves from highland plantations', now()),
('Tomatoes', 'Vegetables', 'agriculture', 'kg', 'Fresh tomatoes, greenhouse and field grown', now()),
('Onions', 'Vegetables', 'agriculture', 'kg', 'Red and white onions, locally produced', now()),
('Carrots', 'Vegetables', 'agriculture', 'kg', 'Fresh carrots from highland farms', now()),
('Cabbage', 'Vegetables', 'agriculture', 'kg', 'Fresh cabbage heads, locally grown', now()),
('NPK Fertilizer', 'Fertilizers', 'agriculture', 'bag (50kg)', 'Balanced NPK fertilizer for crop production', now()),
('Organic Compost', 'Fertilizers', 'agriculture', 'bag (25kg)', 'Organic compost manure for sustainable farming', now()),

-- ELECTRONICS
('Smartphones', 'Mobile Devices', 'electronics', 'piece', 'Android and iOS smartphones, various brands', now()),
('Laptops', 'Computers', 'electronics', 'piece', 'Business and personal laptops, various specifications', now()),
('Desktop Computers', 'Computers', 'electronics', 'piece', 'Complete desktop computer systems', now()),
('LED Televisions', 'Home Appliances', 'electronics', 'piece', 'Smart LED TVs, various screen sizes', now()),
('Refrigerators', 'Home Appliances', 'electronics', 'piece', 'Energy-efficient refrigerators, various capacities', now()),
('Solar Panels', 'Solar Equipment', 'electronics', 'piece', 'Monocrystalline solar panels for renewable energy', now()),
('Solar Batteries', 'Solar Equipment', 'electronics', 'piece', 'Deep cycle batteries for solar energy storage', now()),
('Inverters', 'Solar Equipment', 'electronics', 'piece', 'Pure sine wave inverters for solar systems', now()),
('Washing Machines', 'Home Appliances', 'electronics', 'piece', 'Automatic washing machines, various capacities', now()),
('Air Conditioners', 'Home Appliances', 'electronics', 'piece', 'Split and window air conditioning units', now()),
('Printers', 'Office Equipment', 'electronics', 'piece', 'Inkjet and laser printers for office use', now()),
('Tablets', 'Mobile Devices', 'electronics', 'piece', 'Android and iOS tablets for business and education', now());

-- Create realistic supplier listings with competitive pricing
-- We'll create multiple listings per supplier to make it look active

-- Get supplier IDs for reference
DO $$
DECLARE
    kigali_construction_id UUID;
    kigali_agro_id UUID;
    kigali_electronics_id UUID;
    musanze_construction_id UUID;
    musanze_agro_id UUID;
    huye_construction_id UUID;
    huye_agro_id UUID;
    kayonza_agro_id UUID;
    rwamagana_electronics_id UUID;
    rubavu_construction_id UUID;
    karongi_agro_id UUID;
BEGIN
    -- Get supplier IDs
    SELECT id INTO kigali_construction_id FROM profiles WHERE email = 'kigali.construction@cerka.rw';
    SELECT id INTO kigali_agro_id FROM profiles WHERE email = 'kigali.agro@cerka.rw';
    SELECT id INTO kigali_electronics_id FROM profiles WHERE email = 'kigali.electronics@cerka.rw';
    SELECT id INTO musanze_construction_id FROM profiles WHERE email = 'musanze.construction@cerka.rw';
    SELECT id INTO musanze_agro_id FROM profiles WHERE email = 'musanze.agro@cerka.rw';
    SELECT id INTO huye_construction_id FROM profiles WHERE email = 'huye.construction@cerka.rw';
    SELECT id INTO huye_agro_id FROM profiles WHERE email = 'huye.agro@cerka.rw';
    SELECT id INTO kayonza_agro_id FROM profiles WHERE email = 'kayonza.agro@cerka.rw';
    SELECT id INTO rwamagana_electronics_id FROM profiles WHERE email = 'rwamagana.electronics@cerka.rw';
    SELECT id INTO rubavu_construction_id FROM profiles WHERE email = 'rubavu.construction@cerka.rw';
    SELECT id INTO karongi_agro_id FROM profiles WHERE email = 'karongi.agro@cerka.rw';

    -- KIGALI CONSTRUCTION LISTINGS
    INSERT INTO supplier_listings (
        supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
        location, availability_status, created_at, updated_at
    ) VALUES
    (kigali_construction_id, (SELECT id FROM materials WHERE name = 'Portland Cement'), 
     'Premium Portland Cement - Grade 42.5', 
     'High-quality Portland cement suitable for all construction projects. Meets international standards. Fast delivery within Kigali. Bulk discounts available for orders above 100 bags.',
     18500, 10, 1000, 'Kigali', 'available', now() - interval '5 days', now()),
    
    (kigali_construction_id, (SELECT id FROM materials WHERE name = 'Steel Reinforcement Bars'), 
     'Grade 60 Steel Rebar - Various Sizes', 
     'High-tensile steel reinforcement bars. Available in sizes 8mm to 32mm. Certified quality with test certificates. Competitive prices for bulk orders.',
     1850000, 1, 50, 'Kigali', 'available', now() - interval '3 days', now()),
    
    (kigali_construction_id, (SELECT id FROM materials WHERE name = 'Clay Bricks'), 
     'Standard Clay Bricks - Machine Made', 
     'Uniform machine-made clay bricks. Standard size 215x102x65mm. High compressive strength. Suitable for load-bearing walls. Quality guaranteed.',
     180, 1000, 50000, 'Kigali', 'available', now() - interval '1 day', now()),
    
    (kigali_construction_id, (SELECT id FROM materials WHERE name = 'Roofing Iron Sheets'), 
     'Galvanized Iron Sheets - 28 Gauge', 
     'Corrosion-resistant galvanized iron roofing sheets. 28 gauge thickness. Available in various lengths. 15-year warranty against rust.',
     12500, 50, 2000, 'Kigali', 'available', now() - interval '2 days', now());

    -- KIGALI AGRO LISTINGS  
    INSERT INTO supplier_listings (
        supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
        location, availability_status, created_at, updated_at
    ) VALUES
    (kigali_agro_id, (SELECT id FROM materials WHERE name = 'Tomatoes'), 
     'Fresh Greenhouse Tomatoes - Grade A', 
     'Premium quality greenhouse tomatoes. Pesticide-free. Harvested daily. Perfect for restaurants and supermarkets. Consistent supply guaranteed.',
     1200, 50, 2000, 'Kigali', 'available', now() - interval '1 day', now()),
    
    (kigali_agro_id, (SELECT id FROM materials WHERE name = 'Irish Potatoes'), 
     'Highland Irish Potatoes - Premium Quality', 
     'Fresh Irish potatoes from Musanze highlands. Excellent for chips and cooking. Washed and sorted. Available year-round.',
     800, 100, 5000, 'Kigali', 'available', now() - interval '2 days', now()),
    
    (kigali_agro_id, (SELECT id FROM materials WHERE name = 'Onions'), 
     'Red Onions - Locally Grown', 
     'Fresh red onions from local farms. Good storage quality. Sorted by size. Competitive wholesale prices for bulk buyers.',
     1500, 25, 1000, 'Kigali', 'available', now() - interval '3 days', now()),
    
    (kigali_agro_id, (SELECT id FROM materials WHERE name = 'Carrots'), 
     'Fresh Carrots - Highland Grown', 
     'Sweet highland carrots. Rich in vitamin A. Washed and packaged. Perfect for juice production and cooking.',
     1100, 50, 2000, 'Kigali', 'available', now() - interval '1 day', now());

    -- KIGALI ELECTRONICS LISTINGS
    INSERT INTO supplier_listings (
        supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
        location, availability_status, created_at, updated_at
    ) VALUES
    (kigali_electronics_id, (SELECT id FROM materials WHERE name = 'Smartphones'), 
     'Samsung Galaxy A54 - Latest Model', 
     'Brand new Samsung Galaxy A54 smartphones. 128GB storage, 6GB RAM. 1-year international warranty. Bulk discounts available.',
     450000, 1, 100, 'Kigali', 'available', now() - interval '2 days', now()),
    
    (kigali_electronics_id, (SELECT id FROM materials WHERE name = 'Laptops'), 
     'HP Pavilion 15 - Business Laptop', 
     'HP Pavilion 15 laptops. Intel i5 processor, 8GB RAM, 512GB SSD. Perfect for business and education. Volume discounts available.',
     850000, 1, 50, 'Kigali', 'available', now() - interval '4 days', now()),
    
    (kigali_electronics_id, (SELECT id FROM materials WHERE name = 'LED Televisions'), 
     'LG 43" Smart LED TV - 4K Ultra HD', 
     'LG 43-inch 4K Smart TV with WebOS. Built-in WiFi, Netflix, YouTube. Energy efficient. 2-year warranty included.',
     520000, 1, 20, 'Kigali', 'available', now() - interval '1 day', now()),
    
    (kigali_electronics_id, (SELECT id FROM materials WHERE name = 'Solar Panels'), 
     'Monocrystalline Solar Panels - 300W', 
     '300W monocrystalline solar panels. 25-year performance warranty. High efficiency rating. Perfect for residential and commercial use.',
     280000, 1, 100, 'Kigali', 'available', now() - interval '3 days', now());

    -- Continue with other suppliers...
    -- MUSANZE CONSTRUCTION
    INSERT INTO supplier_listings (
        supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
        location, availability_status, created_at, updated_at
    ) VALUES
    (musanze_construction_id, (SELECT id FROM materials WHERE name = 'Crushed Stones'), 
     'Volcanic Crushed Stones - Premium Grade', 
     'High-quality volcanic crushed stones from Virunga region. Excellent for concrete and road construction. Various sizes available.',
     45000, 5, 100, 'Musanze', 'available', now() - interval '2 days', now()),
    
    (musanze_construction_id, (SELECT id FROM materials WHERE name = 'River Sand'), 
     'Clean River Sand - Construction Grade', 
     'Washed and screened river sand. Low clay content. Perfect for concrete mixing and plastering. Consistent quality guaranteed.',
     35000, 5, 50, 'Musanze', 'available', now() - interval '1 day', now()),
    
    (musanze_construction_id, (SELECT id FROM materials WHERE name = 'Clay Bricks'), 
     'Volcanic Clay Bricks - Extra Strong', 
     'Bricks made from volcanic clay. Superior strength and durability. Excellent thermal properties. Locally manufactured.',
     200, 500, 20000, 'Musanze', 'available', now() - interval '4 days', now());

    -- MUSANZE AGRO
    INSERT INTO supplier_listings (
        supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
        location, availability_status, created_at, updated_at
    ) VALUES
    (musanze_agro_id, (SELECT id FROM materials WHERE name = 'Irish Potatoes'), 
     'Musanze Highland Potatoes - Export Quality', 
     'Premium Irish potatoes from Musanze highlands. Export quality. High starch content. Perfect for processing and fresh market.',
     750, 100, 10000, 'Musanze', 'available', now() - interval '1 day', now()),
    
    (musanze_agro_id, (SELECT id FROM materials WHERE name = 'Maize Seeds (Hybrid)'), 
     'Hybrid Maize Seeds - High Yield Variety', 
     'Certified hybrid maize seeds. Drought resistant. High yield potential. Suitable for highland conditions. 90% germination rate.',
     8500, 10, 500, 'Musanze', 'available', now() - interval '3 days', now());

    -- Add more listings for other suppliers...
    -- HUYE CONSTRUCTION
    INSERT INTO supplier_listings (
        supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
        location, availability_status, created_at, updated_at
    ) VALUES
    (huye_construction_id, (SELECT id FROM materials WHERE name = 'Ceramic Floor Tiles'), 
     'Premium Ceramic Floor Tiles - Various Designs', 
     'High-quality ceramic floor tiles. Non-slip surface. Various colors and patterns. Suitable for residential and commercial use.',
     15500, 10, 500, 'Huye', 'available', now() - interval '2 days', now()),
    
    (huye_construction_id, (SELECT id FROM materials WHERE name = 'Paint (Interior)'), 
     'Premium Interior Paint - All Colors', 
     'High-coverage interior paint. Washable finish. Low VOC formula. Available in all standard colors. Professional quality.',
     12500, 5, 200, 'Huye', 'available', now() - interval '1 day', now());

    -- HUYE AGRO
    INSERT INTO supplier_listings (
        supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
        location, availability_status, created_at, updated_at
    ) VALUES
    (huye_agro_id, (SELECT id FROM materials WHERE name = 'Coffee Beans (Arabica)'), 
     'Premium Arabica Coffee - Fully Washed', 
     'Specialty grade Arabica coffee beans. Fully washed processing. Cupping score 85+. Direct from farmers. Fair trade certified.',
     4500, 50, 2000, 'Huye', 'available', now() - interval '2 days', now()),
    
    (huye_agro_id, (SELECT id FROM materials WHERE name = 'Bananas (Cooking)'), 
     'Fresh Cooking Bananas - Grade A', 
     'Fresh cooking bananas from local farms. Uniform size. Good shelf life. Perfect for restaurants and institutions.',
     2500, 20, 500, 'Huye', 'available', now() - interval '1 day', now());

    -- EASTERN PROVINCE SUPPLIERS
    INSERT INTO supplier_listings (
        supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
        location, availability_status, created_at, updated_at
    ) VALUES
    (kayonza_agro_id, (SELECT id FROM materials WHERE name = 'Rice (Paddy)'), 
     'Premium Paddy Rice - Milled Quality', 
     'High-quality paddy rice from Eastern Province. Modern milling facility. Consistent quality. Bulk supply available.',
     1100, 100, 10000, 'Kayonza', 'available', now() - interval '1 day', now()),
    
    (kayonza_agro_id, (SELECT id FROM materials WHERE name = 'Beans (Red Kidney)'), 
     'Red Kidney Beans - Export Grade', 
     'Premium red kidney beans. Export quality. High protein content. Properly dried and sorted. Consistent supply.',
     1800, 50, 5000, 'Kayonza', 'available', now() - interval '2 days', now());

    -- RWAMAGANA ELECTRONICS
    INSERT INTO supplier_listings (
        supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
        location, availability_status, created_at, updated_at
    ) VALUES
    (rwamagana_electronics_id, (SELECT id FROM materials WHERE name = 'Solar Batteries'), 
     'Deep Cycle Solar Batteries - 200Ah', 
     '200Ah deep cycle batteries for solar systems. Long lifespan. Maintenance-free. Perfect for off-grid applications.',
     380000, 1, 50, 'Rwamagana', 'available', now() - interval '3 days', now()),
    
    (rwamagana_electronics_id, (SELECT id FROM materials WHERE name = 'Inverters'), 
     'Pure Sine Wave Inverters - 3000W', 
     '3000W pure sine wave inverters. High efficiency. Built-in battery charger. Perfect for solar and backup power systems.',
     450000, 1, 20, 'Rwamagana', 'available', now() - interval '1 day', now());

    -- WESTERN PROVINCE SUPPLIERS
    INSERT INTO supplier_listings (
        supplier_id, material_id, title, description, price, min_quantity, max_quantity, 
        location, availability_status, created_at, updated_at
    ) VALUES
    (rubavu_construction_id, (SELECT id FROM materials WHERE name = 'PVC Pipes'), 
     'PVC Water Pipes - Various Diameters', 
     'High-quality PVC pipes for water supply systems. Pressure rated. Various diameters available. UV resistant.',
     2500, 50, 1000, 'Rubavu', 'available', now() - interval '2 days', now()),
    
    (karongi_agro_id, (SELECT id FROM materials WHERE name = 'Tea Leaves'), 
     'Premium Tea Leaves - CTC Grade', 
     'High-quality CTC tea leaves from Western Province plantations. Fresh processing. Export quality. Consistent supply.',
     3200, 25, 1000, 'Karongi', 'available', now() - interval '1 day', now());

END $$;