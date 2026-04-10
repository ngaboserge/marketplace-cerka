# Storage Buckets Setup

## Required Storage Buckets

You need to create these storage buckets in your Supabase dashboard:

### 1. Go to Storage in Supabase Dashboard
- URL: https://supabase.com/dashboard/project/kiwtbssgteuszyckttyq/storage/buckets

### 2. Create the following buckets:

#### Bucket 1: `listing-photos`
- **Name**: `listing-photos`
- **Public**: ✅ Yes (so product images can be viewed publicly)
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`

#### Bucket 2: `price-submission-photos`
- **Name**: `price-submission-photos`
- **Public**: ✅ Yes (for price verification photos)
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`

#### Bucket 3: `profile-avatars`
- **Name**: `profile-avatars`
- **Public**: ✅ Yes (for user profile pictures)
- **File size limit**: 2MB
- **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`

### 3. Set up RLS Policies for Storage

After creating the buckets, you'll need to set up Row Level Security policies. Go to the SQL Editor and run:

```sql
-- RLS policies for listing-photos bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-photos', 'listing-photos', true) ON CONFLICT DO NOTHING;

CREATE POLICY "listing_photos_select_all" ON storage.objects FOR SELECT USING (bucket_id = 'listing-photos');
CREATE POLICY "listing_photos_insert_own" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "listing_photos_update_own" ON storage.objects FOR UPDATE USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "listing_photos_delete_own" ON storage.objects FOR DELETE USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS policies for price-submission-photos bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('price-submission-photos', 'price-submission-photos', true) ON CONFLICT DO NOTHING;

CREATE POLICY "price_photos_select_all" ON storage.objects FOR SELECT USING (bucket_id = 'price-submission-photos');
CREATE POLICY "price_photos_insert_own" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'price-submission-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "price_photos_update_own" ON storage.objects FOR UPDATE USING (bucket_id = 'price-submission-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "price_photos_delete_own" ON storage.objects FOR DELETE USING (bucket_id = 'price-submission-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS policies for profile-avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-avatars', 'profile-avatars', true) ON CONFLICT DO NOTHING;

CREATE POLICY "avatar_select_all" ON storage.objects FOR SELECT USING (bucket_id = 'profile-avatars');
CREATE POLICY "avatar_insert_own" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatar_update_own" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatar_delete_own" ON storage.objects FOR DELETE USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## ✅ Verification

After setup, you should see:
- 3 storage buckets in your Supabase dashboard
- File upload functionality working in the app
- Users can upload product photos when creating listings
- Users can upload price verification photos
- Users can upload profile avatars