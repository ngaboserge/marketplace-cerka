-- Add last_message column to conversations table if it doesn't exist
-- Run this in Supabase SQL Editor

DO $$
BEGIN
    -- Add last_message column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'last_message') THEN
        ALTER TABLE conversations ADD COLUMN last_message TEXT;
    END IF;
    
    -- Add last_message_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'last_message_at') THEN
        ALTER TABLE conversations ADD COLUMN last_message_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Update existing conversations with their last message
UPDATE conversations 
SET last_message = (
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
WHERE last_message IS NULL;

-- Create a function to automatically update last_message when a new message is sent
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET 
        last_message = NEW.content,
        last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last_message
DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON messages;
CREATE TRIGGER trigger_update_conversation_last_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- Verify the structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'conversations' 
AND column_name IN ('last_message', 'last_message_at')
ORDER BY column_name;