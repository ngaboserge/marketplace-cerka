-- Comprehensive script to ensure messaging is set up correctly
-- Run this in Supabase SQL Editor

-- 1. Check if last_message columns exist
SELECT 'Checking table structure...' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'conversations' 
AND column_name IN ('last_message', 'last_message_at')
ORDER BY column_name;

-- 2. Add missing columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'last_message') THEN
        ALTER TABLE conversations ADD COLUMN last_message TEXT;
        RAISE NOTICE 'Added last_message column';
    ELSE
        RAISE NOTICE 'last_message column already exists';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'last_message_at') THEN
        ALTER TABLE conversations ADD COLUMN last_message_at TIMESTAMPTZ;
        RAISE NOTICE 'Added last_message_at column';
    ELSE
        RAISE NOTICE 'last_message_at column already exists';
    END IF;
END $$;

-- 3. Update existing conversations with their last messages
UPDATE conversations 
SET 
    last_message = subquery.content,
    last_message_at = subquery.created_at
FROM (
    SELECT DISTINCT ON (conversation_id) 
        conversation_id,
        content,
        created_at
    FROM messages 
    ORDER BY conversation_id, created_at DESC
) AS subquery
WHERE conversations.id = subquery.conversation_id
AND (conversations.last_message IS NULL OR conversations.last_message = '');

-- 4. Create or replace the trigger function
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

-- 5. Drop and recreate the trigger
DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON messages;
CREATE TRIGGER trigger_update_conversation_last_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- 6. Verify the setup
SELECT 'Current conversations with messages:' as status;
SELECT 
    c.id,
    c.participant_1,
    c.participant_2,
    c.last_message,
    c.last_message_at,
    (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count
FROM conversations c
ORDER BY c.created_at DESC;

-- 7. Check if trigger exists
SELECT 'Checking trigger:' as status;
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_conversation_last_message';

SELECT 'Setup complete!' as status;