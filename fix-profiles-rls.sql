-- Fix RLS policies for profiles table to allow reading supplier info
-- Run this in Supabase SQL Editor

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Create a policy to allow reading basic supplier information
-- This allows users to see business names and basic info of other users (needed for marketplace)
DROP POLICY IF EXISTS "Allow reading supplier info" ON profiles;
CREATE POLICY "Allow reading supplier info" ON profiles
  FOR SELECT USING (true);  -- Allow reading basic profile info for marketplace functionality

-- Alternative more restrictive policy (if the above is too open)
-- DROP POLICY IF EXISTS "Allow reading supplier info" ON profiles;
-- CREATE POLICY "Allow reading supplier info" ON profiles
--   FOR SELECT USING (
--     auth.uid() = id OR  -- Users can see their own profile
--     EXISTS (  -- Or if they have listings (are suppliers)
--       SELECT 1 FROM supplier_listings 
--       WHERE supplier_id = profiles.id 
--       AND status = 'active'
--     )
--   );

-- Make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Test the policy
SELECT 
  id,
  business_name,
  full_name,
  is_verified_supplier
FROM profiles 
WHERE id = 'e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1';