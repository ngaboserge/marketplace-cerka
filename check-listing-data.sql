-- Check if the listing was actually created and verify photo data
-- Run this in your Supabase SQL Editor

-- 1. Check recent listings
SELECT 
  id,
  title,
  price,
  photos,
  created_at,
  supplier_id
FROM supplier_listings 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Check if photos are stored correctly
SELECT 
  id,
  title,
  CASE 
    WHEN photos IS NULL THEN 'No photos'
    WHEN jsonb_array_length(photos) = 0 THEN 'Empty photos array'
    ELSE 'Photos: ' || jsonb_array_length(photos)::text
  END as photo_status,
  photos
FROM supplier_listings 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;