-- Fix profiles table structure if needed
-- Run this in Supabase SQL Editor

-- First, check what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add business_name if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'business_name'
    ) THEN
        ALTER TABLE profiles ADD COLUMN business_name TEXT;
    END IF;
    
    -- Add full_name if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'full_name'
    ) THEN
        ALTER TABLE profiles ADD COLUMN full_name TEXT;
    END IF;
    
    -- Add is_verified_supplier if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'is_verified_supplier'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_verified_supplier BOOLEAN DEFAULT false;
    END IF;
    
    -- Add location if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'location'
    ) THEN
        ALTER TABLE profiles ADD COLUMN location TEXT;
    END IF;
    
    -- Add average_rating if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'average_rating'
    ) THEN
        ALTER TABLE profiles ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.0;
    END IF;
    
    -- Add total_reviews if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'total_reviews'
    ) THEN
        ALTER TABLE profiles ADD COLUMN total_reviews INTEGER DEFAULT 0;
    END IF;
END $$;

-- Check the updated structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Show sample data
SELECT 
    id,
    email,
    full_name,
    business_name,
    is_verified_supplier,
    location
FROM profiles 
LIMIT 5;