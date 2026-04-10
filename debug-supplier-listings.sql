-- Debug and fix supplier_listings table issues
-- Run this in your Supabase SQL Editor

-- 1. Check the current structure of supplier_listings table
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'supplier_listings' 
ORDER BY ordinal_position;

-- 2. Check current RLS policies
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

-- 3. Temporarily disable RLS for testing (CAUTION: Only for development)
ALTER TABLE supplier_listings DISABLE ROW LEVEL SECURITY;

-- 4. Check if there are any records in the table
SELECT COUNT(*) as total_records FROM supplier_listings;

-- 5. Show sample data structure
SELECT * FROM supplier_listings LIMIT 1;

-- 6. Check materials table structure for reference
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'materials' 
ORDER BY ordinal_position;