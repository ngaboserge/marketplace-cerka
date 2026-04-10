-- Test script to check if RLS policies are blocking access to listings
-- Run this in Supabase SQL Editor

-- First, check if RLS is enabled on supplier_listings
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'supplier_listings';

-- Check what RLS policies exist on supplier_listings
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'supplier_listings';

-- Test a simple query without authentication context
-- This should work if RLS allows it
SELECT 
  id,
  title,
  supplier_id,
  status,
  created_at
FROM supplier_listings
ORDER BY created_at DESC
LIMIT 5;

-- Check if there are any listings at all
SELECT COUNT(*) as total_listings FROM supplier_listings;

-- Check listings by status
SELECT status, COUNT(*) as count 
FROM supplier_listings 
GROUP BY status;

-- If you know your user ID, replace 'YOUR_USER_ID_HERE' with your actual user ID
-- SELECT * FROM supplier_listings WHERE supplier_id = 'YOUR_USER_ID_HERE';