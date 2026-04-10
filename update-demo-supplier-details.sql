-- Update demo supplier profiles with business details after they are created
-- Run this AFTER running create-demo-suppliers.sql

-- Update Kigali suppliers
UPDATE profiles SET 
    location = 'Kigali',
    business_name = 'BuildMax Construction Supplies',
    business_description = 'Comprehensive construction materials supplier in Kigali. We stock cement, steel, bricks, and all building materials. Fast delivery and competitive prices for contractors and individuals.',
    is_verified_supplier = true,
    phone = '+250788111001'
WHERE email = 'buildmax.kigali@demo.rw';

UPDATE profiles SET 
    location = 'Kigali',
    business_name = 'FreshMart Agro Hub',
    business_description = 'Leading fresh produce supplier in Kigali. We source directly from farmers to provide the freshest vegetables, fruits, and grains. Serving restaurants, hotels, and retail markets.',
    is_verified_supplier = true,
    phone = '+250788111002'
WHERE email = 'freshmart.kigali@demo.rw';

UPDATE profiles SET 
    location = 'Kigali',
    business_name = 'DigiTech Electronics Store',
    business_description = 'Modern electronics retailer specializing in smartphones, computers, and home appliances. Authorized dealer for major brands with warranty support and technical service.',
    is_verified_supplier = true,
    phone = '+250788111003'
WHERE email = 'digitech.kigali@demo.rw';

-- Update Northern Province suppliers
UPDATE profiles SET 
    location = 'Musanze',
    business_name = 'Volcano Stone Works',
    business_description = 'Specialized quarry and construction materials supplier in Northern Province. We extract and process volcanic stones, sand, and aggregates. Eco-friendly construction solutions.',
    is_verified_supplier = true,
    phone = '+250788222001'
WHERE email = 'volcano.musanze@demo.rw';

UPDATE profiles SET 
    location = 'Musanze',
    business_name = 'Highland Fresh Produce',
    business_description = 'Mountain agriculture specialist providing premium potatoes, vegetables, and seeds. We work with highland farmers to ensure quality and consistent supply.',
    is_verified_supplier = true,
    phone = '+250788222002'
WHERE email = 'highland.musanze@demo.rw';

-- Update Southern Province suppliers
UPDATE profiles SET 
    location = 'Huye',
    business_name = 'Southern Materials Hub',
    business_description = 'Complete construction materials supplier for Southern Province. Specializing in finishing materials, tiles, paints, and electrical supplies. Quality guaranteed.',
    is_verified_supplier = true,
    phone = '+250788333001'
WHERE email = 'southern.huye@demo.rw';

UPDATE profiles SET 
    location = 'Huye',
    business_name = 'Premium Coffee Collective',
    business_description = 'Specialty coffee and agricultural products supplier. We process and supply high-quality Arabica coffee, bananas, and other cash crops. Fair trade certified.',
    is_verified_supplier = true,
    phone = '+250788333002'
WHERE email = 'coffee.huye@demo.rw';

-- Update Eastern Province suppliers
UPDATE profiles SET 
    location = 'Kayonza',
    business_name = 'Eastern Grain Processors',
    business_description = 'Major grain processing facility serving Eastern Rwanda. We supply rice, maize, beans, and other staple foods. Modern processing equipment ensures quality.',
    is_verified_supplier = true,
    phone = '+250788444001'
WHERE email = 'eastern.kayonza@demo.rw';

UPDATE profiles SET 
    location = 'Rwamagana',
    business_name = 'Solar Solutions East',
    business_description = 'Renewable energy specialist providing solar panels, batteries, and complete solar systems. Serving rural electrification and commercial projects.',
    is_verified_supplier = true,
    phone = '+250788444002'
WHERE email = 'solar.rwamagana@demo.rw';

-- Update Western Province suppliers
UPDATE profiles SET 
    location = 'Rubavu',
    business_name = 'Lakeside Construction Co',
    business_description = 'Waterfront construction specialist providing marine-grade materials and specialized building supplies. Expert in lakeside construction projects.',
    is_verified_supplier = true,
    phone = '+250788555001'
WHERE email = 'lakeside.rubavu@demo.rw';

UPDATE profiles SET 
    location = 'Karongi',
    business_name = 'Western Agro Processing',
    business_description = 'Tea, coffee, and agricultural processing facility. We supply processed agricultural products and organic fertilizers. Sustainable farming advocate.',
    is_verified_supplier = true,
    phone = '+250788555002'
WHERE email = 'western.karongi@demo.rw';