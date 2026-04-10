-- Fix RLS policies for conversations table
-- Run this in Supabase SQL Editor

-- First, check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'conversations';

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;

-- Create new RLS policies using the correct column names
-- Policy: Users can see conversations they participate in
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    auth.uid() = participant_1 OR 
    auth.uid() = participant_2
  );

-- Policy: Users can create conversations where they are a participant
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = participant_1 OR 
    auth.uid() = participant_2
  );

-- Policy: Users can update conversations they participate in
CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING (
    auth.uid() = participant_1 OR 
    auth.uid() = participant_2
  );

-- Make sure RLS is enabled
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Check the updated policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'conversations';