-- Fix missing profiles for the 8 newly created supplier auth users
-- These users exist in auth.users but have no row in profiles table

-- Insert profiles for all 8 suppliers using their auth user IDs
-- The IDs come from the script output

INSERT INTO profiles (id, email, full_name, role, location, business_name, business_description, phone, is_verified_supplier, average_rating, total_reviews, created_at, updated_at)
VALUES
  (
    '91db2115-c01d-40e3-a87c-3a668856ea5f',
    'patrick.uwimana@cerka.rw',
    'Patrick Uwimana',
    'supplier',
    'Kigali',
    'Uwimana Building Supplies',
    'Supplying quality construction materials in Kigali since 2018. Cement, steel, bricks and finishing materials. Fast delivery within Kigali.',
    '+250788301001',
    true,
    4.6,
    14,
    now() - interval '2 years',
    now()
  ),
  (
    'e137d729-de62-4374-909b-3025ff445e39',
    'jean.habimana@cerka.rw',
    'Jean Claude Habimana',
    'supplier',
    'Musanze',
    'Volcano Stone & Aggregates',
    'Quarry and aggregates supplier in Northern Province. Volcanic stone, sand, and crushed stones. Serving Musanze, Burera, Rulindo districts.',
    '+250788302002',
    true,
    4.4,
    11,
    now() - interval '3 years',
    now()
  ),
  (
    'deb1852f-2211-4a92-a60f-243e691e364d',
    'eric.nzeyimana@cerka.rw',
    'Eric Nzeyimana',
    'supplier',
    'Huye',
    'Southern Finishing Materials',
    'Finishing materials specialist in Southern Province. Tiles, paint, plumbing and electrical supplies. Serving Huye, Nyanza, Gisagara.',
    '+250788303003',
    true,
    4.5,
    18,
    now() - interval '2.5 years',
    now()
  ),
  (
    '0b0b55bc-dc10-4f3e-b944-034c2fa126a6',
    'innocent.bizimana@cerka.rw',
    'Innocent Bizimana',
    'supplier',
    'Rubavu',
    'Lakeside Hardware & Construction',
    'Construction materials supplier in Western Province. Specializing in materials for lakeside and humid environments. Serving Rubavu, Rutsiro, Nyamasheke.',
    '+250788304004',
    true,
    4.3,
    9,
    now() - interval '3.5 years',
    now()
  ),
  (
    'e4bd5e09-e611-4c9b-9773-14acd6e5a7c9',
    'agnes.mukamana@cerka.rw',
    'Agnes Mukamana',
    'supplier',
    'Kigali',
    'FreshMart Agro Kigali',
    'Fresh produce aggregator in Kigali. We source directly from farmers in Musanze, Ruhango, and Kayonza. Daily supply to restaurants, hotels, and supermarkets.',
    '+250788305005',
    true,
    4.7,
    22,
    now() - interval '1 year',
    now()
  ),
  (
    'c88f5aba-06f9-41f5-9c99-90534c48b068',
    'vincent.nsengimana@cerka.rw',
    'Vincent Nsengimana',
    'supplier',
    'Kayonza',
    'Eastern Grain Processors Ltd',
    'Grain processing and wholesale in Eastern Province. Modern milling facility. Supplying rice, maize, beans to wholesalers and institutions across Rwanda.',
    '+250788306006',
    true,
    4.5,
    16,
    now() - interval '5 years',
    now()
  ),
  (
    '0c9db524-1260-47e7-ad33-6a9bf57e2c16',
    'beatrice.uwamahoro@cerka.rw',
    'Beatrice Uwamahoro',
    'supplier',
    'Huye',
    'Premium Coffee & Agro Huye',
    'Specialty coffee and agricultural products from Southern Province. Fair trade certified. Supplying Arabica coffee, bananas, and seasonal produce.',
    '+250788307007',
    true,
    4.8,
    25,
    now() - interval '4 years',
    now()
  ),
  (
    'd65aa57a-ed88-4506-a76f-77b69bb6da66',
    'esperance.mukamazimpaka@cerka.rw',
    'Esperance Mukamazimpaka',
    'supplier',
    'Karongi',
    'Western Agro Processing Karongi',
    'Tea, coffee, and agricultural processing in Western Province. Supplying processed tea, Arabica coffee, and organic fertilizers. Sustainable farming advocate.',
    '+250788308008',
    true,
    4.4,
    13,
    now() - interval '6 years',
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  location = EXCLUDED.location,
  business_name = EXCLUDED.business_name,
  business_description = EXCLUDED.business_description,
  phone = EXCLUDED.phone,
  is_verified_supplier = EXCLUDED.is_verified_supplier,
  average_rating = EXCLUDED.average_rating,
  total_reviews = EXCLUDED.total_reviews,
  updated_at = now();

-- Verify all profiles were created
SELECT 
  id,
  email,
  full_name,
  role,
  location,
  business_name,
  is_verified_supplier
FROM profiles
WHERE email LIKE '%@cerka.rw'
ORDER BY created_at;