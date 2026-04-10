-- Test script to verify supplier data is available
-- Run this in Supabase SQL Editor to check your supplier information

-- Check what profiles exist with business names
SELECT 
  id,
  email,
  full_name,
  business_name,
  is_verified_supplier,
  average_rating,
  location,
  created_at
FROM profiles
WHERE business_name IS NOT NULL OR is_verified_supplier = true
ORDER BY created_at DESC;

-- Check your specific listings with supplier info
SELECT 
  sl.id,
  sl.title,
  sl.supplier_id,
  sl.price,
  sl.status,
  p.business_name,
  p.full_name,
  p.is_verified_supplier,
  p.location,
  m.name as material_name
FROM supplier_listings sl
LEFT JOIN profiles p ON sl.supplier_id = p.id
LEFT JOIN materials m ON sl.material_id = m.id
WHERE sl.status = 'active'
ORDER BY sl.created_at DESC;

-- Test if you can find your own profile
-- Replace 'your-email@example.com' with your actual email
-- SELECT * FROM profiles WHERE email = 'your-email@example.com';