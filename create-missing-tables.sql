-- Create missing marketplace tables
-- Run this in your Supabase SQL Editor

-- Create listings table for supplier listings
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  min_quantity INTEGER DEFAULT 1,
  location TEXT NOT NULL,
  city TEXT,
  area TEXT,
  delivery_info TEXT,
  description TEXT,
  photos TEXT[] DEFAULT '{}',
  contact_phone TEXT,
  contact_whatsapp TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create listing analytics table
CREATE TABLE IF NOT EXISTS listing_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  view_count INTEGER DEFAULT 0,
  quote_request_count INTEGER DEFAULT 0,
  contact_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  delivery_location TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'accepted', 'declined', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create supplier ratings table
CREATE TABLE IF NOT EXISTS supplier_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_id, supplier_id)
);

-- Create buyer favorites table
CREATE TABLE IF NOT EXISTS buyer_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_id, supplier_id)
);

-- Create verification requests table
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  documents TEXT[] DEFAULT '{}',
  business_name TEXT,
  business_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES profiles(id),
  admin_notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create aggregated prices table for price intelligence
CREATE TABLE IF NOT EXISTS aggregated_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  median_price DECIMAL(10,2) NOT NULL,
  min_price DECIMAL(10,2) NOT NULL,
  max_price DECIMAL(10,2) NOT NULL,
  submission_count INTEGER NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(material_id, location)
);

-- Create price history table for trends
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  median_price DECIMAL(10,2) NOT NULL,
  min_price DECIMAL(10,2) NOT NULL,
  max_price DECIMAL(10,2) NOT NULL,
  submission_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(material_id, location, date)
);

-- Create reliability scores table
CREATE TABLE IF NOT EXISTS reliability_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  score INTEGER DEFAULT 100,
  total_submissions INTEGER DEFAULT 0,
  approved_count INTEGER DEFAULT 0,
  rejected_count INTEGER DEFAULT 0,
  flagged_count INTEGER DEFAULT 0,
  consistency_bonus INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to existing tables if they don't exist
ALTER TABLE materials ADD COLUMN IF NOT EXISTS sector TEXT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);
ALTER TABLE materials ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT FALSE;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected'));

-- Add missing columns to price_submissions if they don't exist
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS material_id UUID REFERENCES materials(id) ON DELETE CASCADE;
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS quantity INTEGER;
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS gps_latitude DECIMAL(10,8);
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS gps_longitude DECIMAL(11,8);
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged'));
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES profiles(id);
ALTER TABLE price_submissions ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add missing columns to conversations if they don't exist
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS participant_1_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS participant_2_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add missing columns to messages if they don't exist
ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT FALSE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_supplier_id ON listings(supplier_id);
CREATE INDEX IF NOT EXISTS idx_listings_material_id ON listings(material_id);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_price_submissions_material_id ON price_submissions(material_id);
CREATE INDEX IF NOT EXISTS idx_price_submissions_location ON price_submissions(location);
CREATE INDEX IF NOT EXISTS idx_price_submissions_status ON price_submissions(status);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant_1_id, participant_2_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- Enable RLS on new tables
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE aggregated_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reliability_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for listings
CREATE POLICY "listings_select_all" ON listings FOR SELECT USING (status = 'active');
CREATE POLICY "listings_insert_own" ON listings FOR INSERT WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY "listings_update_own" ON listings FOR UPDATE USING (auth.uid() = supplier_id);
CREATE POLICY "listings_delete_own" ON listings FOR DELETE USING (auth.uid() = supplier_id);

-- Create RLS policies for quote_requests
CREATE POLICY "quote_requests_select_own" ON quote_requests FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);
CREATE POLICY "quote_requests_insert_own" ON quote_requests FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "quote_requests_update_own" ON quote_requests FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);

-- Create RLS policies for supplier_ratings
CREATE POLICY "supplier_ratings_select_all" ON supplier_ratings FOR SELECT USING (true);
CREATE POLICY "supplier_ratings_insert_own" ON supplier_ratings FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "supplier_ratings_update_own" ON supplier_ratings FOR UPDATE USING (auth.uid() = buyer_id);

-- Create RLS policies for buyer_favorites
CREATE POLICY "buyer_favorites_select_own" ON buyer_favorites FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "buyer_favorites_insert_own" ON buyer_favorites FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "buyer_favorites_delete_own" ON buyer_favorites FOR DELETE USING (auth.uid() = buyer_id);

-- Create RLS policies for price_submissions
CREATE POLICY "price_submissions_select_approved" ON price_submissions FOR SELECT USING (status = 'approved');
CREATE POLICY "price_submissions_select_own" ON price_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "price_submissions_insert_own" ON price_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "price_submissions_update_own" ON price_submissions FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for conversations and messages
CREATE POLICY "conversations_select_participant" ON conversations FOR SELECT USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);
CREATE POLICY "conversations_insert_participant" ON conversations FOR INSERT WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);
CREATE POLICY "conversations_update_participant" ON conversations FOR UPDATE USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "messages_select_participant" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
  )
);
CREATE POLICY "messages_insert_participant" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
  )
);

-- Create update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listing_analytics_updated_at
  BEFORE UPDATE ON listing_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_requests_updated_at
  BEFORE UPDATE ON verification_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample materials if the table is empty
INSERT INTO materials (name, unit, category, sector, icon) VALUES
  ('Cement', 'bag', 'Building Materials', 'construction', '🏗️'),
  ('Iron Bars', 'kg', 'Building Materials', 'construction', '🔩'),
  ('Sand', 'truck', 'Building Materials', 'construction', '🏖️'),
  ('Bricks', 'piece', 'Building Materials', 'construction', '🧱'),
  ('Rice', 'kg', 'Grains', 'agriculture', '🌾'),
  ('Beans', 'kg', 'Grains', 'agriculture', '🫘'),
  ('Maize', 'kg', 'Grains', 'agriculture', '🌽'),
  ('Potatoes', 'kg', 'Vegetables', 'agriculture', '🥔')
ON CONFLICT (name) DO NOTHING;

-- Create a function to automatically create listing analytics when a listing is created
CREATE OR REPLACE FUNCTION create_listing_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO listing_analytics (listing_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_listing_analytics_trigger
  AFTER INSERT ON listings
  FOR EACH ROW EXECUTE FUNCTION create_listing_analytics();

-- Create a function to update conversation last_message_at when a message is sent
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at, updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();