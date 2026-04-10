-- Simple storage setup for Cerka images
-- Run this in Supabase SQL Editor

-- Step 1: Create the images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO NOTHING;

-- Step 2: Allow public access to images bucket
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Step 3: Allow public uploads to images bucket  
CREATE POLICY "Public upload access for images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images');

-- Step 4: Verify the bucket was created
SELECT id, name, public FROM storage.buckets WHERE id = 'images';