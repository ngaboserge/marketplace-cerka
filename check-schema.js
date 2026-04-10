// Check current database schema
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kiwtbssgteuszyckttyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3Ric3NndGV1c3p5Y2t0dHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTUwMjcsImV4cCI6MjA5MDczMTAyN30.pmcCxFvVAJvkzNGTUUudz7nq72tCclV9cJZ01keForY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking database schema...\n');
  
  // Check materials table structure
  try {
    const { data: materials, error } = await supabase
      .from('materials')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Materials table error:', error.message);
    } else {
      console.log('✅ Materials table structure:');
      if (materials && materials.length > 0) {
        console.log('   Sample record keys:', Object.keys(materials[0]));
      } else {
        console.log('   Table exists but no records');
      }
    }
  } catch (err) {
    console.log('❌ Materials table check failed:', err.message);
  }

  // Check price_submissions table structure
  try {
    const { data: submissions, error } = await supabase
      .from('price_submissions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Price submissions table error:', error.message);
    } else {
      console.log('✅ Price submissions table structure:');
      if (submissions && submissions.length > 0) {
        console.log('   Sample record keys:', Object.keys(submissions[0]));
      } else {
        console.log('   Table exists but no records');
      }
    }
  } catch (err) {
    console.log('❌ Price submissions table check failed:', err.message);
  }

  // Check conversations table structure
  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Conversations table error:', error.message);
    } else {
      console.log('✅ Conversations table structure:');
      if (conversations && conversations.length > 0) {
        console.log('   Sample record keys:', Object.keys(conversations[0]));
      } else {
        console.log('   Table exists but no records');
      }
    }
  } catch (err) {
    console.log('❌ Conversations table check failed:', err.message);
  }

  // Check messages table structure
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Messages table error:', error.message);
    } else {
      console.log('✅ Messages table structure:');
      if (messages && messages.length > 0) {
        console.log('   Sample record keys:', Object.keys(messages[0]));
      } else {
        console.log('   Table exists but no records');
      }
    }
  } catch (err) {
    console.log('❌ Messages table check failed:', err.message);
  }
}

checkSchema();