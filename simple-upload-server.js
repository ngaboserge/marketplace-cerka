// Simple local server to upload images to Supabase
// Run with: node simple-upload-server.js

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

async function uploadImages() {
  console.log('🚀 Starting Cerka image upload to Supabase...\n');

  // Images to upload
  const images = [
    { file: 'cerka-logo.jpeg', description: 'Cerka Logo' },
    { file: 'aa.JPG', description: 'Supplier Image' },
    { file: 'bb.webp', description: 'Buyer Image' },
    { file: 'cc.webp', description: 'Connect & Compare Image' },
    { file: 'dd.webp', description: 'Trade & Grow Image' }
  ];

  const results = [];

  for (const image of images) {
    const filePath = path.join(__dirname, 'public', 'images', image.file);
    
    console.log(`📤 Uploading ${image.description} (${image.file})...`);
    
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filePath}`);
        continue;
      }

      // Read file
      const fileBuffer = fs.readFileSync(filePath);
      
      // Get file extension for content type
      const ext = path.extname(image.file).toLowerCase();
      let contentType = 'image/jpeg';
      if (ext === '.png') contentType = 'image/png';
      if (ext === '.webp') contentType = 'image/webp';
      if (ext === '.gif') contentType = 'image/gif';

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('images')
        .upload(image.file, fileBuffer, {
          contentType: contentType,
          upsert: true // Overwrite if exists
        });

      if (error) {
        console.log(`❌ Upload failed for ${image.file}:`, error.message);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(image.file);

      console.log(`✅ Successfully uploaded ${image.file}`);
      console.log(`   URL: ${publicUrl}\n`);
      
      results.push({
        file: image.file,
        description: image.description,
        url: publicUrl,
        success: true
      });

    } catch (err) {
      console.log(`❌ Error uploading ${image.file}:`, err.message);
      results.push({
        file: image.file,
        description: image.description,
        error: err.message,
        success: false
      });
    }
  }

  // Summary
  console.log('\n📋 Upload Summary:');
  console.log('==================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log('\n✅ Successfully uploaded:');
    successful.forEach(result => {
      console.log(`   ${result.description}: ${result.url}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed uploads:');
    failed.forEach(result => {
      console.log(`   ${result.description}: ${result.error}`);
    });
  }

  console.log(`\n🎯 Total: ${successful.length}/${images.length} images uploaded successfully`);
  
  if (successful.length === images.length) {
    console.log('\n🎉 All images uploaded! Your Cerka app is ready to deploy! 🚀');
  } else {
    console.log('\n⚠️  Some images failed. Check the errors above and try again.');
    console.log('💡 Tip: You can also upload manually via Supabase Dashboard');
  }
}

// Run the upload
uploadImages().catch(console.error);