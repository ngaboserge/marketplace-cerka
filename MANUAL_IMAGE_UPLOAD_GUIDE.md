# 📤 Manual Image Upload Guide

## Quick Solution: Upload via Supabase Dashboard

### Step 1: Setup Storage Bucket
1. Go to https://supabase.com/dashboard/project/kiwtbssgteuszyckttyq
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"** if no buckets exist
4. Create bucket with these settings:
   - **Name**: `images`
   - **Public bucket**: ✅ **Enable this**
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp,image/gif`

### Step 2: Upload Images
1. Click on the **"images"** bucket
2. Click **"Upload file"** button
3. Upload these 5 files from your `public/images/` folder:

   **Required Files:**
   - `cerka-logo.jpeg` ← **Important: Keep exact filename**
   - `aa.JPG` ← **Important: Keep exact filename with capital JPG**
   - `bb.webp` ← **Important: Keep exact filename**
   - `cc.webp` ← **Important: Keep exact filename**
   - `dd.webp` ← **Important: Keep exact filename**

### Step 3: Verify Upload
After uploading, you should see these URLs work:
- https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/cerka-logo.jpeg
- https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/aa.JPG
- https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/bb.webp
- https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/cc.webp
- https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/dd.webp

## Alternative: Run SQL Setup First

If you get permission errors, run this SQL in your Supabase SQL Editor first:

```sql
-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images', 
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Allow public access
CREATE POLICY "Public Access" ON storage.objects FOR ALL USING (bucket_id = 'images');
```

## Test Your Upload

Open this URL in your browser to test the logo:
https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/cerka-logo.jpeg

If it shows the Cerka logo, you're all set! 🎉

## Troubleshooting

**If images don't show:**
1. ✅ Check bucket is marked as **"Public"**
2. ✅ Verify exact filenames (case-sensitive)
3. ✅ Clear browser cache
4. ✅ Try uploading again

**File Size Issues:**
- Keep images under 5MB
- Compress if needed using online tools

**Permission Issues:**
- Run the SQL setup script first
- Make sure bucket is public
- Check RLS policies are created

---

**Once uploaded, your Cerka app will work perfectly on any hosting platform! 🚀**