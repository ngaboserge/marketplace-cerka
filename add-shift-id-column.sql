-- Add missing shift_id column to conversations table
-- Run this in Supabase SQL Editor

-- Add shift_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conversations' AND column_name = 'shift_id'
    ) THEN
        ALTER TABLE conversations ADD COLUMN shift_id UUID;
        RAISE NOTICE 'Added shift_id column to conversations table';
    ELSE
        RAISE NOTICE 'shift_id column already exists';
    END IF;
END $$;

-- Check the updated structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'conversations' 
ORDER BY ordinal_position;