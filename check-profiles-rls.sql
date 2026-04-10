-- Check RLS policies on profiles table
-- Run this in Supabase SQL Editor

-- Check if RLS is enabled on profiles
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check what RLS policies exist on profiles
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
WHERE tablename = 'profiles';

-- Test if you can query your own profile
SELECT 
  id,
  business_name,
  full_name,
  is_verified_supplier
FROM profiles 
WHERE id = auth.uid();

-- Test if you can query the specific supplier profile
SELECT 
  id,
  business_name,
  full_name,
  is_verified_supplier
FROM profiles 
WHERE id = 'e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1';