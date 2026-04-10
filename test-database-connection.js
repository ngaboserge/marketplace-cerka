// Simple database connection test
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kiwtbssgteuszyckttyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3Ric3NndGV1c3p5Y2t0dHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTUwMjcsImV4cCI6MjA5MDczMTAyN30.pmcCxFvVAJvkzNGTUUudz7nq72tCclV9cJZ01keForY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    console.log('✅ Basic connection successful');

    // Test 2: Check existing tables
    console.log('\n📋 Checking existing tables...');
    
    // Check profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (profilesError) {
      console.log('❌ Profiles table:', profilesError.message);
    } else {
      console.log('✅ Profiles table exists, records:', profiles?.length || 0);
    }

    // Check supplier_profiles table
    const { data: suppliers, error: suppliersError } = await supabase
      .from('supplier_profiles')
      .select('*')
      .limit(5);
    
    if (suppliersError) {
      console.log('❌ Supplier profiles table:', suppliersError.message);
    } else {
      console.log('✅ Supplier profiles table exists, records:', suppliers?.length || 0);
    }

    // Test 3: Check for marketplace tables that should exist
    const tablesToCheck = [
      'materials',
      'listings', 
      'price_submissions',
      'conversations',
      'messages'
    ];

    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table} table:`, error.message);
        } else {
          console.log(`✅ ${table} table exists`);
        }
      } catch (err) {
        console.log(`❌ ${table} table: Connection error`);
      }
    }

    // Test 4: Authentication
    console.log('\n🔐 Testing authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️ No authenticated user (expected for test)');
    } else if (user) {
      console.log('✅ User authenticated:', user.email);
    } else {
      console.log('ℹ️ No user session');
    }

    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Database connection test completed');
  } else {
    console.log('\n💥 Database connection test failed');
  }
});