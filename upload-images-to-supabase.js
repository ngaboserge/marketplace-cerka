import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://kiwtbssgteuszyckttyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3Ric3NndGV1c3p5Y2t0dHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTUwMjcsImV4cCI6MjA5MDczMTAyN30.pmcCxFvVAJvkzNGTUUudz7nq72tCclV9cJZ01keForY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage(filePath, fileName, bucketName = 'images') {
  try {
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: getContentType(fileName),
        upsert: true // This will overwrite if file exists
      });

    if (error) {
      console.error(`Error uploading ${fileName}:`, error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log(`✅ Uploaded ${fileName}: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error(`Error processing ${fileName}:`, err);
    return null;
  }
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

async function createBucketIfNotExists(bucketName = 'images') {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (error) {
        console.error('Error creating bucket:', error);
        return false;
      }

      console.log(`✅ Created bucket: ${bucketName}`);
    } else {
      console.log(`✅ Bucket ${bucketName} already exists`);
    }

    return true;
  } catch (err) {
    console.error('Error with bucket operations:', err);
    return false;
  }
}

async function uploadAllImages() {
  console.log('🚀 Starting image upload to Supabase Storage...\n');

  // Create bucket if it doesn't exist
  const bucketCreated = await createBucketIfNotExists('images');
  if (!bucketCreated) {
    console.error('❌ Failed to create or access bucket');
    return;
  }

  // Images to upload
  const imagesToUpload = [
    {
      localPath: path.join(__dirname, 'public/images/cerka-logo.jpeg'),
      fileName: 'cerka-logo.jpeg'
    },
    {
      localPath: path.join(__dirname, 'public/images/aa.JPG'),
      fileName: 'aa.JPG'
    },
    {
      localPath: path.join(__dirname, 'public/images/bb.webp'),
      fileName: 'bb.webp'
    },
    {
      localPath: path.join(__dirname, 'public/images/cc.webp'),
      fileName: 'cc.webp'
    },
    {
      localPath: path.join(__dirname, 'public/images/dd.webp'),
      fileName: 'dd.webp'
    }
  ];

  const uploadedUrls = {};

  for (const image of imagesToUpload) {
    if (fs.existsSync(image.localPath)) {
      const url = await uploadImage(image.localPath, image.fileName);
      if (url) {
        uploadedUrls[image.fileName] = url;
      }
    } else {
      console.log(`⚠️  File not found: ${image.localPath}`);
    }
  }

  console.log('\n📋 Upload Summary:');
  console.log('==================');
  Object.entries(uploadedUrls).forEach(([fileName, url]) => {
    console.log(`${fileName}: ${url}`);
  });

  console.log('\n✅ Image upload completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Update your code to use these Supabase URLs instead of local paths');
  console.log('2. The images will now work when deployed to any hosting platform');
  
  return uploadedUrls;
}

// Run the upload
uploadAllImages().catch(console.error);