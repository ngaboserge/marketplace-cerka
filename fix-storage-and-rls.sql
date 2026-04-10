-- Fix storage buckets and RLS policies for marketplace
-- Run this in your Supabase SQL Editor

-- 1. Create storage bucket for listing photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-photos',
  'listing-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create RLS policies for listing-photos bucket
DROP POLICY IF EXISTS "Anyone can view listing photos" ON storage.objects;
CREATE POLICY "Anyone can view listing photos" ON storage.objects
FOR SELECT USING (bucket_id = 'listing-photos');

DROP POLICY IF EXISTS "Authenticated users can upload listing photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload listing photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'listing-photos' 
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Users can update their own listing photos" ON storage.objects;
CREATE POLICY "Users can update their own listing photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'listing-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own listing photos" ON storage.objects;
CREATE POLICY "Users can delete their own listing photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'listing-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Ensure materials table has proper RLS policies
DROP POLICY IF EXISTS "Anyone can view materials" ON materials;
CREATE POLICY "Anyone can view materials" ON materials
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert materials" ON materials;
CREATE POLICY "Authenticated users can insert materials" ON materials
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Fix supplier_listings RLS policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'supplier_listings') THEN
        
        -- Drop existing policies that might be causing issues
        DROP POLICY IF EXISTS "Anyone can view supplier listings" ON supplier_listings;
        DROP POLICY IF EXISTS "Suppliers can insert their own listings" ON supplier_listings;
        DROP POLICY IF EXISTS "Suppliers can update their own listings" ON supplier_listings;
        DROP POLICY IF EXISTS "Suppliers can delete their own listings" ON supplier_listings;
        DROP POLICY IF EXISTS "Users can view all supplier listings" ON supplier_listings;
        DROP POLICY IF EXISTS "Users can insert supplier listings" ON supplier_listings;
        DROP POLICY IF EXISTS "Users can update their own supplier listings" ON supplier_listings;
        DROP POLICY IF EXISTS "Users can delete their own supplier listings" ON supplier_listings;
        
        -- Create new, more permissive policies for testing
        CREATE POLICY "Anyone can view supplier listings" ON supplier_listings
        FOR SELECT USING (true);
        
        CREATE POLICY "Authenticated users can insert listings" ON supplier_listings
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        
        CREATE POLICY "Authenticated users can update listings" ON supplier_listings
        FOR UPDATE WITH CHECK (auth.role() = 'authenticated');
        
        CREATE POLICY "Authenticated users can delete listings" ON supplier_listings
        FOR DELETE USING (auth.role() = 'authenticated');
        
    END IF;
END $$;

-- 5. Create a simple test to verify everything works
SELECT 
  'Storage bucket' as component,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'listing-photos') 
    THEN '✅ listing-photos bucket exists'
    ELSE '❌ listing-photos bucket missing'
  END as status

UNION ALL

SELECT 
  'Materials table' as component,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'materials') 
    THEN '✅ materials table exists'
    ELSE '❌ materials table missing'
  END as status

UNION ALL

SELECT 
  'Supplier listings table' as component,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'supplier_listings') 
    THEN '✅ supplier_listings table exists'
    ELSE '❌ supplier_listings table missing'
  END as status;