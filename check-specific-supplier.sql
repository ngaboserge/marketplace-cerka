-- Check specific supplier data
-- Run this in Supabase SQL Editor

-- Check the specific supplier that's showing as null
SELECT 
  id,
  email,
  full_name,
  business_name,
  is_verified_supplier,
  location,
  created_at
FROM profiles 
WHERE id = 'e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1';

-- Check all profiles to see what data exists
SELECT 
  id,
  email,
  full_name,
  business_name,
  is_verified_supplier
FROM profiles 
ORDER BY created_at DESC
LIMIT 5;

-- Check if there are any supplier_listings for this user
SELECT 
  sl.id,
  sl.title,
  sl.supplier_id,
  p.business_name,
  p.full_name
FROM supplier_listings sl
LEFT JOIN profiles p ON sl.supplier_id = p.id
WHERE sl.supplier_id = 'e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1';