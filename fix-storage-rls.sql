-- First, create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images', 
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Allow public uploads to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public bucket access" ON storage.buckets;

-- Create comprehensive RLS policies for the images bucket
CREATE POLICY "Allow public uploads to images bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow public updates to images" ON storage.objects
FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Allow public deletes from images" ON storage.objects
FOR DELETE USING (bucket_id = 'images');

-- Enable RLS on storage.objects (should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy for buckets table (without IF NOT EXISTS)
CREATE POLICY "Allow public bucket access" ON storage.buckets
FOR SELECT USING (true);

-- Verify the setup
SELECT 
  id, 
  name, 
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'images';