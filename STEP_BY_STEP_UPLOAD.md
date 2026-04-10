# 📸 Step-by-Step Image Upload Guide

## Skip the SQL - Manual Upload is Easier!

### Step 1: Go to Supabase Storage
🔗 **Link**: https://supabase.com/dashboard/project/kiwtbssgteuszyckttyq/storage

### Step 2: Create Images Bucket
1. Click the **"New bucket"** button (green button)
2. Fill in the form:
   - **Bucket name**: `images`
   - **✅ Check "Public bucket"** (very important!)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp,image/gif`
3. Click **"Create bucket"**

### Step 3: Upload Your Images
1. Click on the **"images"** bucket you just created
2. Click **"Upload file"** button
3. Select and upload these 5 files from your `public/images/` folder:

   **📁 Files to Upload:**
   ```
   ✅ cerka-logo.jpeg  (Cerka logo)
   ✅ aa.JPG           (Supplier image)  
   ✅ bb.webp          (Buyer image)
   ✅ cc.webp          (Connect & Compare)
   ✅ dd.webp          (Trade & Grow)
   ```

### Step 4: Test Upload Success
Open this URL in your browser:
```
https://kiwtbssgteuszyckttyq.supabase.co/storage/v1/object/public/images/cerka-logo.jpeg
```

**✅ If you see the Cerka logo = SUCCESS!**
**❌ If you get an error = Try again or check bucket is public**

### Step 5: Deploy Your App
Once all 5 images are uploaded, your Cerka app will work perfectly on any hosting platform!

---

## 🔧 Troubleshooting

**Problem**: Can't create bucket
**Solution**: Try running `simple-storage-setup.sql` in SQL Editor first

**Problem**: Images don't show  
**Solution**: Make sure bucket is marked as "Public"

**Problem**: Upload fails
**Solution**: Check file names are exactly correct (case-sensitive)

---

## 🎯 Why This Works
- ✅ Bypasses all RLS policy issues
- ✅ No CORS problems  
- ✅ No browser security restrictions
- ✅ Works with any Supabase project
- ✅ Takes only 5 minutes

**This is the most reliable method!**