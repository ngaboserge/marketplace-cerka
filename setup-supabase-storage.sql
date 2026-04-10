-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images', 
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policy to allow public uploads to images bucket
CREATE POLICY "Allow public uploads to images bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images');

-- Create RLS policy to allow public access to images
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Create RLS policy to allow public updates to images
CREATE POLICY "Allow public updates to images" ON storage.objects
FOR UPDATE USING (bucket_id = 'images');

-- Create RLS policy to allow public deletes from images
CREATE POLICY "Allow public deletes from images" ON storage.objects
FOR DELETE USING (bucket_id = 'images');

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;