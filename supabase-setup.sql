-- Complete cleanup and setup script for MARKETPLACE ONLY
-- Run this in your Supabase SQL Editor

-- STEP 1: Clean up any existing problematic elements
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- STEP 2: Temporarily disable RLS to avoid permission issues during setup
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS supplier_profiles DISABLE ROW LEVEL SECURITY;

-- STEP 3: Drop gigwork tables and recreate marketplace tables
DROP TABLE IF EXISTS worker_profiles CASCADE;
DROP TABLE IF EXISTS employer_profiles CASCADE;
DROP TABLE IF EXISTS supplier_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- STEP 4: Create marketplace-focused tables
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'supplier', 'contributor', 'admin')),
  name TEXT,
  business_name TEXT,
  avatar_url TEXT,
  platform_preference TEXT DEFAULT 'marketplace',
  platform_selected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE supplier_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT,
  company_type TEXT DEFAULT 'other',
  company_description TEXT,
  company_website TEXT,
  company_size TEXT,
  industry TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 5: Enable RLS and create policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Supplier profiles policies
CREATE POLICY "supplier_profiles_select_own" ON supplier_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "supplier_profiles_insert_own" ON supplier_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "supplier_profiles_update_own" ON supplier_profiles FOR UPDATE USING (auth.uid() = user_id);

-- STEP 6: Create update timestamp function and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_profiles_updated_at
  BEFORE UPDATE ON supplier_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();