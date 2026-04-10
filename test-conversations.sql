-- Test conversations table
-- Run this in Supabase SQL Editor

-- Check if conversations table exists and its structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'conversations' 
ORDER BY ordinal_position;

-- Check existing conversations
SELECT * FROM conversations LIMIT 5;

-- Test inserting a simple conversation (replace UUIDs with real ones)
-- INSERT INTO conversations (participant_1, participant_2, created_at) 
-- VALUES ('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', NOW());

-- Check messages table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'messages' 
ORDER BY ordinal_position;

-- Check existing messages
SELECT * FROM messages LIMIT 5;