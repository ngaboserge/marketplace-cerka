// Test messaging functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://kiwtbssgteuszyckttyq.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3Ric3NndGV1c3p5Y2t0dHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NzI0NzQsImV4cCI6MjA0OTI0ODQ3NH0.Ej5u_wOdOJQGGWJWKQWQs7NjqQGQGQGQGQGQGQGQGQGQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMessaging() {
  console.log('Testing messaging functionality...');
  
  try {
    // Test 1: Check conversations table structure
    console.log('\n1. Checking conversations table structure...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'conversations' });
    
    if (columnsError) {
      console.log('Using direct query for table structure...');
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Error accessing conversations table:', error);
      } else {
        console.log('Conversations table accessible, sample structure:', conversations);
      }
    }
    
    // Test 2: Check if we can read profiles
    console.log('\n2. Testing profiles access...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, business_name, full_name')
      .eq('id', 'e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1')
      .maybeSingle();
    
    if (profilesError) {
      console.error('Error accessing profiles:', profilesError);
    } else {
      console.log('Profile data:', profiles);
    }
    
    // Test 3: Check listings with supplier data
    console.log('\n3. Testing listings with supplier data...');
    const { data: listings, error: listingsError } = await supabase
      .from('supplier_listings')
      .select(`
        id,
        title,
        supplier_id,
        material:materials(name, category)
      `)
      .limit(2);
    
    if (listingsError) {
      console.error('Error accessing listings:', listingsError);
    } else {
      console.log('Listings data:', listings);
      
      // For each listing, try to get supplier data
      for (const listing of listings || []) {
        if (listing.supplier_id) {
          const { data: supplier, error: supplierError } = await supabase
            .from('profiles')
            .select('id, business_name, full_name, is_verified_supplier')
            .eq('id', listing.supplier_id)
            .maybeSingle();
          
          console.log(`Supplier for listing ${listing.title}:`, supplier || 'Not found', supplierError || '');
        }
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testMessaging();