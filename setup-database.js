// Database setup script
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kiwtbssgteuszyckttyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3Ric3NndGV1c3p5Y2t0dHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTUwMjcsImV4cCI6MjA5MDczMTAyN30.pmcCxFvVAJvkzNGTUUudz7nq72tCclV9cJZ01keForY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
    console.log('🚀 Starting database setup...');
    
    try {
        // Test basic connection
        console.log('📡 Testing connection...');
        const { data: testData, error: testError } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);
            
        if (testError) {
            console.error('❌ Connection test failed:', testError.message);
            return;
        }
        
        console.log('✅ Connection successful');
        
        // Check if tables already exist
        console.log('🔍 Checking existing tables...');
        
        const { data: wishlistCheck } = await supabase
            .from('wishlist_items')
            .select('id')
            .limit(1);
            
        const { data: cartCheck } = await supabase
            .from('cart_items')
            .select('id')
            .limit(1);
            
        const { data: notifCheck } = await supabase
            .from('notifications')
            .select('id')
            .limit(1);
            
        if (wishlistCheck !== null) {
            console.log('✅ wishlist_items table already exists');
        } else {
            console.log('❌ wishlist_items table missing');
        }
        
        if (cartCheck !== null) {
            console.log('✅ cart_items table already exists');
        } else {
            console.log('❌ cart_items table missing');
        }
        
        if (notifCheck !== null) {
            console.log('✅ notifications table already exists');
        } else {
            console.log('❌ notifications table missing');
        }
        
        console.log('📋 Database setup analysis complete');
        console.log('ℹ️  Note: Table creation requires database admin access');
        console.log('ℹ️  Please run the SQL scripts manually in Supabase dashboard');
        
    } catch (error) {
        console.error('💥 Setup error:', error.message);
    }
}

setupDatabase();