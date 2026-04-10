-- Debug script to find your specific listings
-- Run this in Supabase SQL Editor

-- First, let's see what users exist in the profiles table
SELECT 
  id,
  email,
  full_name,
  business_name,
  role,
  is_verified_supplier,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- Check if there are any supplier_listings at all
SELECT 
  COUNT(*) as total_listings,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_listings,
  COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_listings
FROM supplier_listings;

-- Show all listings with their supplier info
SELECT 
  sl.id,
  sl.title,
  sl.supplier_id,
  sl.status,
  sl.price,
  sl.created_at,
  p.email,
  p.full_name,
  p.business_name,
  m.name as material_name
FROM supplier_listings sl
LEFT JOIN profiles p ON sl.supplier_id = p.id
LEFT JOIN materials m ON sl.material_id = m.id
ORDER BY sl.created_at DESC;

-- Check if there are any foreign key constraints that might be causing issues
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='supplier_listings';

-- Test the exact query that the app is using
-- Replace 'YOUR_USER_ID' with your actual user ID if you know it
-- SELECT 
--   sl.*,
--   m.*,
--   p.id as supplier_id,
--   p.full_name,
--   p.business_name,
--   p.location,
--   p.is_verified_supplier,
--   p.average_rating,
--   p.total_reviews
-- FROM supplier_listings sl
-- LEFT JOIN materials m ON sl.material_id = m.id
-- LEFT JOIN profiles p ON sl.supplier_id = p.id
-- WHERE sl.supplier_id = 'YOUR_USER_ID'
--   AND sl.status IN ('active', 'inactive')
-- ORDER BY sl.created_at DESC;