-- Test if the message trigger is working
-- Run this in Supabase SQL Editor

-- First, check current state
SELECT 'Before test:' as status;
SELECT id, last_message, last_message_at FROM conversations ORDER BY created_at DESC LIMIT 3;

-- Insert a test message (replace conversation_id and sender_id with actual values)
-- You'll need to replace these UUIDs with actual ones from your database
INSERT INTO messages (conversation_id, sender_id, content, created_at)
VALUES (
    (SELECT id FROM conversations ORDER BY created_at DESC LIMIT 1),
    'e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1',
    'Test message to check trigger',
    NOW()
);

-- Check if the trigger updated the conversation
SELECT 'After test:' as status;
SELECT id, last_message, last_message_at FROM conversations ORDER BY created_at DESC LIMIT 3;

-- Clean up the test message
DELETE FROM messages WHERE content = 'Test message to check trigger';