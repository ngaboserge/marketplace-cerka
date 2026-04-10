-- Add missing columns to profiles table if they don't exist
DO $$ 
BEGIN
    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
        ALTER TABLE profiles ADD COLUMN location TEXT;
    END IF;
    
    -- Add business_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_name') THEN
        ALTER TABLE profiles ADD COLUMN business_name TEXT;
    END IF;
    
    -- Add business_description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_description') THEN
        ALTER TABLE profiles ADD COLUMN business_description TEXT;
    END IF;
    
    -- Add is_verified_supplier column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_verified_supplier') THEN
        ALTER TABLE profiles ADD COLUMN is_verified_supplier BOOLEAN DEFAULT false;
    END IF;
    
    -- Add phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
END $$;