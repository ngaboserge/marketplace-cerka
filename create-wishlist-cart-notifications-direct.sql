-- Create Wishlist, Cart, and Notifications Tables - Step by Step
-- Run this script directly in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 1: Create wishlist_items table
DROP TABLE IF EXISTS public.wishlist_items CASCADE;
CREATE TABLE public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.supplier_listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_listing_wishlist UNIQUE(user_id, listing_id)
);

-- STEP 2: Create cart_items table
DROP TABLE IF EXISTS public.cart_items CASCADE;
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.supplier_listings(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_listing_cart UNIQUE(user_id, listing_id)
);

-- STEP 3: Create notifications table
DROP TABLE IF EXISTS public.notifications CASCADE;
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 4: Create indexes for performance
CREATE INDEX idx_wishlist_user_id ON public.wishlist_items(user_id);
CREATE INDEX idx_wishlist_listing_id ON public.wishlist_items(listing_id);
CREATE INDEX idx_wishlist_created_at ON public.wishlist_items(created_at);

CREATE INDEX idx_cart_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_listing_id ON public.cart_items(listing_id);
CREATE INDEX idx_cart_created_at ON public.cart_items(created_at);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- STEP 5: Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- STEP 6: Create trigger for cart_items updated_at
CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON public.cart_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- STEP 7: Enable Row Level Security
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- STEP 8: Create RLS policies for wishlist_items
CREATE POLICY "wishlist_select_own" ON public.wishlist_items 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "wishlist_insert_own" ON public.wishlist_items 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wishlist_delete_own" ON public.wishlist_items 
    FOR DELETE USING (auth.uid() = user_id);

-- STEP 9: Create RLS policies for cart_items
CREATE POLICY "cart_select_own" ON public.cart_items 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cart_insert_own" ON public.cart_items 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_update_own" ON public.cart_items 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cart_delete_own" ON public.cart_items 
    FOR DELETE USING (auth.uid() = user_id);

-- STEP 10: Create RLS policies for notifications
CREATE POLICY "notifications_select_own" ON public.notifications 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON public.notifications 
    FOR DELETE USING (auth.uid() = user_id);

-- STEP 11: Insert sample notifications for testing
-- Note: Replace the user_id with your actual user ID from auth.users table
INSERT INTO public.notifications (user_id, type, title, message, data, read) VALUES
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'welcome', 'Welcome to Rwanda Market!', 'Start exploring products and connect with suppliers across Rwanda.', '{}', false),
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'system', 'Platform features updated', 'New wishlist and cart functionality is now available!', '{}', false),
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'message', 'New message from Supplier', 'You have received a new message about your inquiry.', '{"conversationId": "123"}', false)
ON CONFLICT DO NOTHING;

-- STEP 12: Verify everything was created successfully
SELECT 'Tables created successfully!' as status;

SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('wishlist_items', 'cart_items', 'notifications')
ORDER BY tablename;