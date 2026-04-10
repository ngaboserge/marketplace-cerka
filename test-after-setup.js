// Test marketplace after database setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kiwtbssgteuszyckttyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3Ric3NndGV1c3p5Y2t0dHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTUwMjcsImV4cCI6MjA5MDczMTAyN30.pmcCxFvVAJvkzNGTUUudz7nq72tCclV9cJZ01keForY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAfterSetup() {
  console.log('🧪 Testing Marketplace After Database Setup...\n');
  
  const results = {
    working: [],
    failed: []
  };

  // Test all marketplace tables
  const tablesToTest = [
    'profiles',
    'supplier_profiles', 
    'materials',
    'listings',
    'listing_analytics',
    'quote_requests',
    'supplier_ratings',
    'buyer_favorites',
    'verification_requests',
    'price_submissions',
    'conversations',
    'messages',
    'aggregated_prices',
    'price_history',
    'reliability_scores'
  ];

  for (const table of tablesToTest) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}:`, error.message);
        results.failed.push(table);
      } else {
        console.log(`✅ ${table}: Working`);
        results.working.push(table);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
      results.failed.push(table);
    }
  }

  // Test materials with new columns
  console.log('\n📦 Testing Materials with New Columns...');
  try {
    const { data: materials, error } = await supabase
      .from('materials')
      .select('id, name, unit, category, sector, icon, is_custom, status')
      .limit(3);
    
    if (error) {
      console.log('❌ Materials columns test failed:', error.message);
    } else {
      console.log('✅ Materials columns test passed');
      if (materials && materials.length > 0) {
        console.log('   Sample material:', {
          name: materials[0].name,
          sector: materials[0].sector,
          icon: materials[0].icon,
          status: materials[0].status
        });
      }
    }
  } catch (err) {
    console.log('❌ Materials columns test error:', err.message);
  }

  // Test creating a sample listing (this will test the full flow)
  console.log('\n🏪 Testing Listing Creation Flow...');
  try {
    // First, we need to be authenticated, but we can't do that in this test
    // So we'll just test the table structure
    const { data, error } = await supabase
      .from('listings')
      .select('id, supplier_id, material_id, price, location, status, created_at')
      .limit(1);
    
    if (error) {
      console.log('❌ Listings structure test failed:', error.message);
    } else {
      console.log('✅ Listings structure test passed');
    }
  } catch (err) {
    console.log('❌ Listings structure test error:', err.message);
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Working tables: ${results.working.length}`);
  console.log(`❌ Failed tables: ${results.failed.length}`);
  
  if (results.working.length > 0) {
    console.log('\nWorking tables:', results.working.join(', '));
  }
  
  if (results.failed.length > 0) {
    console.log('\nFailed tables:', results.failed.join(', '));
  }

  if (results.failed.length === 0) {
    console.log('\n🎉 All database tables are working correctly!');
    console.log('✅ The marketplace platform is ready for use.');
    console.log('\n🚀 Next steps:');
    console.log('1. Create storage buckets for file uploads');
    console.log('2. Test the frontend application');
    console.log('3. Create some test data');
  } else {
    console.log('\n⚠️ Some tables still need attention.');
    console.log('Please check the SQL script execution.');
  }
}

testAfterSetup();