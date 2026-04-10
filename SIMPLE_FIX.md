# 🚀 Simple 2-Minute Fix for Images

## The Issue
RLS (Row Level Security) is blocking uploads. Here's the fastest fix:

## ✅ Quick Solution

### Step 1: Go to Supabase Dashboard
https://supabase.com/dashboard/project/kiwtbssgteuszyckttyq/storage

### Step 2: Create Images Bucket
1. Click **"New bucket"**
2. Name: `images`
3. **✅ Check "Public bucket"** (This is crucial!)
4. Click **"Create bucket"**

### Step 3: Upload 5 Images
Click on the **"images"** bucket, then **"Upload file"** and upload:
- `cerka-logo.jpeg` (from your `public/images/` folder)
- `aa.JPG` (from your `public/images/` folder)
- `bb.webp` (from your `public/images/` folder)
- `cc.webp` (from your `public/images/` folder)
- `dd.webp` (from your `public/images/` folder)

### Step 4: Test
Open this URL - you should see the Cerka logo:
https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/cerka-logo.jpeg

## 🎉 Done!
Your Cerka app will now work perfectly when deployed!

---

**Alternative: Run SQL First**
If the bucket creation fails, run this SQL in Supabase SQL Editor first:
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO NOTHING;
```

Then upload the files manually.