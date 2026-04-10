-- Fix duplicate conversations and create unique index
-- Run this in Supabase SQL Editor

-- Step 1: Find and remove duplicate conversations
-- Keep the oldest conversation for each pair of participants
WITH duplicate_conversations AS (
  SELECT 
    id,
    participant_1,
    participant_2,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY 
        LEAST(participant_1, participant_2), 
        GREATEST(participant_1, participant_2) 
      ORDER BY created_at ASC
    ) as row_num
  FROM conversations
  WHERE participant_1 IS NOT NULL AND participant_2 IS NOT NULL
),
conversations_to_delete AS (
  SELECT id 
  FROM duplicate_conversations 
  WHERE row_num > 1
)
-- First, delete messages from duplicate conversations
DELETE FROM messages 
WHERE conversation_id IN (SELECT id FROM conversations_to_delete);

-- Then delete the duplicate conversations
DELETE FROM conversations 
WHERE id IN (
  SELECT id FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY 
          LEAST(participant_1, participant_2), 
          GREATEST(participant_1, participant_2) 
        ORDER BY created_at ASC
      ) as row_num
    FROM conversations
    WHERE participant_1 IS NOT NULL AND participant_2 IS NOT NULL
  ) ranked
  WHERE row_num > 1
);

-- Step 2: Now create the unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_unique_participants 
ON conversations(LEAST(participant_1, participant_2), GREATEST(participant_1, participant_2))
WHERE participant_1 IS NOT NULL AND participant_2 IS NOT NULL;

-- Step 3: Verify no duplicates remain
SELECT 
  LEAST(participant_1, participant_2) as p1,
  GREATEST(participant_1, participant_2) as p2,
  COUNT(*) as conversation_count
FROM conversations 
WHERE participant_1 IS NOT NULL AND participant_2 IS NOT NULL
GROUP BY LEAST(participant_1, participant_2), GREATEST(participant_1, participant_2)
HAVING COUNT(*) > 1;

-- Step 4: Show remaining conversations
SELECT 
  id,
  participant_1,
  participant_2,
  created_at,
  last_message,
  last_message_at
FROM conversations 
ORDER BY created_at DESC;