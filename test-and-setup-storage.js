// Test and setup Supabase storage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kiwtbssgteuszyckttyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3Ric3NndGV1c3p5Y2t0dHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTUwMjcsImV4cCI6MjA5MDczMTAyN30.pmcCxFvVAJvkzNGTUUudz7nq72tCclV9cJZ01keForY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAndSetupStorage() {
  console.log('🔍 Testing Supabase Storage setup...\n');

  try {
    // Test 1: List buckets
    console.log('1. Checking existing buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('❌ Error listing buckets:', bucketsError.message);
      return;
    }
    
    console.log('✅ Found buckets:', buckets.map(b => `${b.name} (public: ${b.public})`).join(', '));
    
    // Test 2: Check if images bucket exists
    const imagesBucket = buckets.find(b => b.name === 'images');
    
    if (!imagesBucket) {
      console.log('\n2. Creating images bucket...');
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.log('❌ Error creating bucket:', createError.message);
        console.log('💡 You need to create the bucket manually in Supabase Dashboard');
        return;
      }
      
      console.log('✅ Created images bucket successfully');
    } else {
      console.log(`\n2. Images bucket exists (public: ${imagesBucket.public})`);
      
      if (!imagesBucket.public) {
        console.log('⚠️  Bucket is not public - you need to make it public in Supabase Dashboard');
      }
    }
    
    // Test 3: Try to upload a small test file
    console.log('\n3. Testing upload permissions...');
    const testContent = 'test';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload('test.txt', testBlob, {
        upsert: true
      });
    
    if (uploadError) {
      console.log('❌ Upload test failed:', uploadError.message);
      console.log('\n🔧 To fix this:');
      console.log('1. Go to https://supabase.com/dashboard/project/kiwtbssgteuszyckttyq/storage');
      console.log('2. Create "images" bucket if it doesn\'t exist');
      console.log('3. Make sure the bucket is marked as "Public"');
      console.log('4. Or run the SQL script: fix-storage-rls.sql');
      return;
    }
    
    console.log('✅ Upload test successful');
    
    // Clean up test file
    await supabase.storage.from('images').remove(['test.txt']);
    
    console.log('\n🎉 Storage setup is working! You can now upload images.');
    console.log('\n📤 Run this command to upload your images:');
    console.log('npm run upload-images');
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

testAndSetupStorage();