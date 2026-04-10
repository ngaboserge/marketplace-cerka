-- Debug script to check supplier listings
-- Run this in Supabase SQL Editor to see what's happening with your listings

-- Check if there are any supplier listings at all
SELECT 
  'Total Listings' as check_type,
  COUNT(*) as count
FROM supplier_listings;

-- Check listings by status
SELECT 
  status,
  COUNT(*) as count
FROM supplier_listings
GROUP BY status;

-- Check if there are any listings with materials
SELECT 
  sl.id,
  sl.title,
  sl.status,
  sl.supplier_id,
  sl.created_at,
  m.name as material_name,
  m.category,
  m.sector
FROM supplier_listings sl
LEFT JOIN materials m ON sl.material_id = m.id
ORDER BY sl.created_at DESC
LIMIT 10;

-- Check if there are any profiles (suppliers)
SELECT 
  'Total Profiles' as check_type,
  COUNT(*) as count
FROM profiles;

-- Check profiles with supplier info
SELECT 
  id,
  full_name,
  business_name,
  is_verified_supplier,
  created_at
FROM profiles
WHERE is_verified_supplier = true OR business_name IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;

-- Check for any RLS policy issues by testing a simple query
-- This will show if RLS is blocking the query
SELECT 
  sl.id,
  sl.title,
  sl.supplier_id,
  p.full_name,
  p.business_name
FROM supplier_listings sl
LEFT JOIN profiles p ON sl.supplier_id = p.id
WHERE sl.status IN ('active', 'inactive')
ORDER BY sl.created_at DESC
LIMIT 5;