// Run SQL setup script
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://kiwtbssgteuszyckttyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3Ric3NndGV1c3p5Y2t0dHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTUwMjcsImV4cCI6MjA5MDczMTAyN30.pmcCxFvVAJvkzNGTUUudz7nq72tCclV9cJZ01keForY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQLSetup() {
  console.log('🚀 Running database setup...\n');
  
  try {
    // Read the SQL file
    const sqlContent = readFileSync('create-missing-tables.sql', 'utf8');
    
    // Split into individual statements (basic approach)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length < 10) continue; // Skip very short statements
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.log(`❌ Statement ${i + 1} failed:`, error.message);
          console.log(`   SQL: ${statement.substring(0, 100)}...`);
          errorCount++;
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Statement ${i + 1} error:`, err.message);
        console.log(`   SQL: ${statement.substring(0, 100)}...`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Results: ${successCount} successful, ${errorCount} failed`);
    
    if (errorCount === 0) {
      console.log('🎉 Database setup completed successfully!');
    } else {
      console.log('⚠️ Database setup completed with some errors. Check the logs above.');
    }
    
  } catch (error) {
    console.error('💥 Setup failed:', error.message);
  }
}

// Note: This approach won't work because Supabase doesn't expose exec_sql via RPC
// We need to run the SQL manually in the Supabase dashboard
console.log('⚠️ This script cannot execute SQL directly.');
console.log('📋 Please copy the contents of create-missing-tables.sql');
console.log('🌐 and run it in your Supabase SQL Editor at:');
console.log('   https://supabase.com/dashboard/project/kiwtbssgteuszyckttyq/sql');

runSQLSetup();