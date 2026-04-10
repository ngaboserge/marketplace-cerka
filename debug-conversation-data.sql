-- Debug conversation data to see what's missing
-- Run this in Supabase SQL Editor

-- Check current conversations and their last_message field
SELECT 
    id,
    participant_1,
    participant_2,
    last_message,
    last_message_at,
    created_at
FROM conversations 
ORDER BY created_at DESC;

-- Check messages for each conversation
SELECT 
    c.id as conversation_id,
    c.last_message as stored_last_message,
    m.content as actual_last_message,
    m.created_at as message_created_at,
    m.sender_id
FROM conversations c
LEFT JOIN messages m ON c.id = m.conversation_id
WHERE m.id = (
    SELECT id FROM messages 
    WHERE conversation_id = c.id 
    ORDER BY created_at DESC 
    LIMIT 1
)
ORDER BY c.created_at DESC;

-- Check if there are any messages at all
SELECT 
    conversation_id,
    COUNT(*) as message_count,
    MAX(created_at) as latest_message_time,
    (SELECT content FROM messages m2 WHERE m2.conversation_id = messages.conversation_id ORDER BY created_at DESC LIMIT 1) as latest_content
FROM messages 
GROUP BY conversation_id;

-- Update conversations with their actual last messages
UPDATE conversations 
SET 
    last_message = (
        SELECT content 
        FROM messages 
        WHERE messages.conversation_id = conversations.id 
        ORDER BY messages.created_at DESC 
        LIMIT 1
    ),
    last_message_at = (
        SELECT created_at 
        FROM messages 
        WHERE messages.conversation_id = conversations.id 
        ORDER BY messages.created_at DESC 
        LIMIT 1
    )
WHERE EXISTS (
    SELECT 1 FROM messages 
    WHERE messages.conversation_id = conversations.id
);

-- Verify the update
SELECT 
    id,
    participant_1,
    participant_2,
    last_message,
    last_message_at,
    created_at
FROM conversations 
ORDER BY created_at DESC;