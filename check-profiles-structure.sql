-- Check the actual structure of your profiles table
-- Run this in Supabase SQL Editor

-- Check what columns exist in the profiles table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if there are any profiles at all
SELECT COUNT(*) as total_profiles FROM profiles;

-- Check a sample of profiles to see what data exists
SELECT 
  id,
  email,
  CASE WHEN column_exists('full_name') THEN full_name ELSE 'N/A' END as full_name,
  CASE WHEN column_exists('business_name') THEN business_name ELSE 'N/A' END as business_name,
  CASE WHEN column_exists('name') THEN name ELSE 'N/A' END as name,
  created_at
FROM profiles 
LIMIT 5;

-- Function to check if column exists (helper for above query)
CREATE OR REPLACE FUNCTION column_exists(column_name text) 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = $1
  );
END;
$$ LANGUAGE plpgsql;

-- Simple query to see what's actually in profiles
SELECT * FROM profiles LIMIT 3;