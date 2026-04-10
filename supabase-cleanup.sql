-- Cleanup script to remove problematic triggers and functions
-- Run this FIRST if you're having issues with the main setup

-- Remove the problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Clean up any existing auth hooks that might be causing issues
-- (This is safe to run even if they don't exist)