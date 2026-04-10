# Supabase Setup Guide - UPDATED

## ⚠️ CRITICAL: Follow these steps in exact order

### Step 1: Check Supabase Authentication Settings
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. **CRITICAL**: Under **User Signups**, turn OFF **"Enable email confirmations"**
4. Under **User Signups**, make sure **"Enable signups"** is ON
5. Click **Save**

### Step 2: Clean Database Setup
1. Go to **SQL Editor** in your Supabase Dashboard
2. Copy and paste the ENTIRE contents of `supabase-setup.sql`
3. Click **Run** to execute the SQL
4. **Important**: This will drop and recreate all tables cleanly

### Step 3: Test Basic Supabase Connection
1. Open `test-supabase.html` in your browser
2. Click "Test Connection" - should show green success
3. Click "Test Signup" - should create a user successfully
4. If either fails, there's a Supabase configuration issue

### Step 4: Check for Database Hooks
1. In Supabase Dashboard, go to **Database** → **Webhooks**
2. If you see any webhooks, **disable or delete them**
3. Go to **SQL Editor** and run: `SELECT * FROM pg_trigger WHERE tgname LIKE '%auth%';`
4. If you see any auth-related triggers, they might be causing issues

### Step 5: Verify Your Environment
Your `.env` file should have:
```
VITE_SUPABASE_URL=https://kiwtbssgteuszyckttyq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3Ric3NndGV1c3p5Y2t0dHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTUwMjcsImV4cCI6MjA5MDczMTAyN30.pmcCxFvVAJvkzNGTUUudz7nq72tCclV9cJZ01keForY
```

## 🔍 Troubleshooting 500 Errors

If you're still getting 500 errors:

### Check 1: Supabase Project Status
- Go to your Supabase Dashboard
- Check if your project is paused or has any issues
- Look for any error messages or warnings

### Check 2: Database Logs
- Go to **Logs** → **Database** in Supabase Dashboard
- Look for any error messages when you try to signup
- Common issues: constraint violations, trigger errors, permission issues

### Check 3: Authentication Logs
- Go to **Logs** → **Auth** in Supabase Dashboard
- Check for signup attempt logs and any error messages

### Check 4: Manual Database Test
Run this in SQL Editor to test if basic operations work:
```sql
-- Test if you can insert into auth.users (this should fail, but shows if auth is working)
SELECT auth.uid();

-- Check if profiles table exists and is accessible
SELECT * FROM profiles LIMIT 1;
```

## 🚨 If Still Not Working

The 500 error suggests a server-side issue. Try:

1. **Create a new Supabase project** (sometimes projects get corrupted)
2. **Check Supabase status page** for any ongoing issues
3. **Contact Supabase support** if the issue persists

## What the Setup Does

- Completely cleans and recreates all tables
- Removes any problematic triggers or functions
- Sets up proper RLS policies
- Uses `gen_random_uuid()` instead of `uuid_generate_v4()` for better compatibility