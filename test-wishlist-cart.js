// Test wishlist and cart functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kiwtbssgteuszyckttyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3Ric3NndGV1c3p5Y2t0dHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTUwMjcsImV4cCI6MjA5MDczMTAyN30.pmcCxFvVAJvkzNGTUUudz7nq72tCclV9cJZ01keForY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWishlistCart() {
    console.log('🧪 Testing wishlist and cart functionality...');
    
    try {
        // Test wishlist table access
        console.log('📋 Testing wishlist_items table...');
        const { data: wishlistData, error: wishlistError } = await supabase
            .from('wishlist_items')
            .select('*')
            .limit(5);
            
        if (wishlistError) {
            console.error('❌ Wishlist table error:', wishlistError.message);
        } else {
            console.log('✅ Wishlist table accessible, found', wishlistData.length, 'items');
        }
        
        // Test cart table access
        console.log('🛒 Testing cart_items table...');
        const { data: cartData, error: cartError } = await supabase
            .from('cart_items')
            .select('*')
            .limit(5);
            
        if (cartError) {
            console.error('❌ Cart table error:', cartError.message);
        } else {
            console.log('✅ Cart table accessible, found', cartData.length, 'items');
        }
        
        // Test notifications table access
        console.log('🔔 Testing notifications table...');
        const { data: notifData, error: notifError } = await supabase
            .from('notifications')
            .select('*')
            .limit(5);
            
        if (notifError) {
            console.error('❌ Notifications table error:', notifError.message);
        } else {
            console.log('✅ Notifications table accessible, found', notifData.length, 'items');
        }
        
        // Test supplier listings for reference
        console.log('📦 Testing supplier_listings for reference...');
        const { data: listingsData, error: listingsError } = await supabase
            .from('supplier_listings')
            .select('id, title, supplier_id')
            .limit(3);
            
        if (listingsError) {
            console.error('❌ Listings table error:', listingsError.message);
        } else {
            console.log('✅ Found', listingsData.length, 'listings for testing:');
            listingsData.forEach(listing => {
                console.log(`  - ${listing.title} (ID: ${listing.id})`);
            });
        }
        
        console.log('🎉 Database functionality test completed!');
        
    } catch (error) {
        console.error('💥 Test error:', error.message);
    }
}

testWishlistCart();