-- =====================================================
-- CERKA MATERIALS MARKETPLACE - COMPLETE DATABASE SCHEMA
-- Independent materials marketplace with price intelligence
-- Combines migrations 010-026 from original platform
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- CUSTOM TYPES
-- =====================================================

CREATE TYPE user_role AS ENUM ('buyer', 'supplier', 'contributor', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deactivated');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE listing_status AS ENUM ('active', 'inactive', 'sold', 'expired');
CREATE TYPE quote_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE platform_type AS ENUM ('gigwork', 'marketplace', 'both');

-- =====================================================
-- USERS & PROFILES
-- =====================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'contributor',
  status user_status DEFAULT 'active',
  email VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  phone VARCHAR(20),
  phone_verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  
  -- Platform selection
  platform_preference platform_type DEFAULT 'both',
  platform_selected_at TIMESTAMPTZ,
  
  -- BASIC INFO
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(200),
  
  -- LOCATION
  city VARCHAR(100),
  district VARCHAR(100),
  address TEXT,
  
  -- VERIFICATION
  verification_status verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE public.supplier_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- BUSINESS INFO
  business_name VARCHAR(200) NOT NULL,
  business_type VARCHAR(100),
  business_license VARCHAR(100),
  tax_id VARCHAR(50),
  
  -- CONTACT
  contact_person VARCHAR(100),
  business_phone VARCHAR(20),
  business_email VARCHAR(255),
  website VARCHAR(255),
  
  -- LOCATION & DELIVERY
  business_address TEXT,
  delivery_areas TEXT[],
  delivery_radius_km INT DEFAULT 50,
  
  -- VERIFICATION
  verification_documents JSONB,
  verification_notes TEXT,
  
  -- REPUTATION
  average_rating DECIMAL(3,2) CHECK (average_rating >= 0 AND average_rating <= 5),
  total_ratings INT DEFAULT 0,
  total_orders INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MATERIALS CATALOG
-- =====================================================

CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  
  -- SPECIFICATIONS
  description TEXT,
  specifications JSONB,
  
  -- METADATA
  keywords TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PRICE SUBMISSIONS & INTELLIGENCE
-- =====================================================

CREATE TABLE public.price_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  
  -- PRICE DATA
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  quantity DECIMAL(10, 2),
  
  -- LOCATION
  location TEXT NOT NULL,
  district TEXT,
  gps_latitude DECIMAL(10, 7),
  gps_longitude DECIMAL(10, 7),
  
  -- EVIDENCE
  photo_url TEXT,
  thumbnail_url TEXT,
  notes TEXT,
  
  -- MODERATION
  status moderation_status DEFAULT 'pending',
  moderated_at TIMESTAMPTZ,
  moderated_by UUID REFERENCES public.profiles(id),
  admin_notes TEXT,
  
  -- RELIABILITY
  reliability_score DECIMAL(5,2) DEFAULT 50.00,
  
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.aggregated_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  district TEXT,
  
  -- AGGREGATED DATA
  median_price DECIMAL(10, 2) NOT NULL,
  min_price DECIMAL(10, 2) NOT NULL,
  max_price DECIMAL(10, 2) NOT NULL,
  avg_price DECIMAL(10, 2) NOT NULL,
  
  -- STATISTICS
  sample_size INT NOT NULL,
  confidence_score DECIMAL(5,2) DEFAULT 50.00,
  data_quality_score DECIMAL(5,2) DEFAULT 50.00,
  
  -- METADATA
  calculation_date TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(material_id, location)
);

CREATE TABLE public.price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  
  -- HISTORICAL DATA
  price DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  
  -- METADATA
  sample_size INT DEFAULT 1,
  data_source VARCHAR(50) DEFAULT 'user_submission',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(material_id, location, date)
);

-- =====================================================
-- SUPPLIER LISTINGS & MARKETPLACE
-- =====================================================

CREATE TABLE public.supplier_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  
  -- LISTING INFO
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- PRICING
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  min_quantity DECIMAL(10, 2) DEFAULT 1,
  max_quantity DECIMAL(10, 2),
  
  -- AVAILABILITY
  stock_quantity DECIMAL(10, 2),
  availability_status VARCHAR(50) DEFAULT 'available',
  
  -- DELIVERY
  delivery_available BOOLEAN DEFAULT true,
  delivery_cost DECIMAL(10, 2),
  delivery_time_days INT,
  
  -- MEDIA
  photos JSONB,
  
  -- STATUS
  status listing_status DEFAULT 'active',
  
  -- ANALYTICS
  view_count INT DEFAULT 0,
  quote_request_count INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.supplier_listings(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  
  -- REQUEST DETAILS
  quantity DECIMAL(10, 2) NOT NULL,
  message TEXT,
  
  -- DELIVERY
  delivery_location TEXT,
  delivery_date DATE,
  
  -- RESPONSE
  quoted_price DECIMAL(10, 2),
  supplier_message TEXT,
  
  -- STATUS
  status quote_status DEFAULT 'pending',
  
  -- TIMESTAMPS
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.supplier_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quote_request_id UUID REFERENCES public.quote_requests(id),
  
  -- RATING
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  
  -- CATEGORIES
  quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
  delivery_rating INT CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(supplier_id, buyer_id, quote_request_id)
);
-- =====================================================
-- MARKET INTELLIGENCE & SIGNALS
-- =====================================================

CREATE TABLE public.price_trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  
  -- TREND DATA
  trend_direction VARCHAR(20) NOT NULL, -- 'up', 'down', 'stable'
  trend_percentage DECIMAL(5,2),
  
  -- TIME PERIODS
  period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- STATISTICS
  start_price DECIMAL(10, 2),
  end_price DECIMAL(10, 2),
  volatility_score DECIMAL(5,2),
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(material_id, location, period_type, end_date)
);

CREATE TABLE public.price_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  location TEXT,
  
  -- SIGNAL INFO
  signal_type VARCHAR(50) NOT NULL, -- 'price_spike', 'price_drop', 'shortage', 'surplus'
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  
  -- DATA
  current_value DECIMAL(10, 2),
  threshold_value DECIMAL(10, 2),
  percentage_change DECIMAL(5,2),
  
  -- DESCRIPTION
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- STATUS
  active BOOLEAN DEFAULT true,
  acknowledged BOOLEAN DEFAULT false,
  
  -- METADATA
  confidence_score DECIMAL(5,2) DEFAULT 50.00,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE public.price_narratives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID REFERENCES public.materials(id),
  location TEXT,
  
  -- NARRATIVE
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  narrative_type VARCHAR(50) NOT NULL, -- 'trend_explanation', 'market_update', 'forecast'
  
  -- METADATA
  confidence_score DECIMAL(5,2) DEFAULT 50.00,
  data_points_used INT,
  
  -- STATUS
  published BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RELIABILITY & QUALITY SCORING
-- =====================================================

CREATE TABLE public.reliability_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- SCORES
  overall_score DECIMAL(5,2) DEFAULT 50.00,
  accuracy_score DECIMAL(5,2) DEFAULT 50.00,
  consistency_score DECIMAL(5,2) DEFAULT 50.00,
  timeliness_score DECIMAL(5,2) DEFAULT 50.00,
  
  -- STATISTICS
  total_submissions INT DEFAULT 0,
  approved_submissions INT DEFAULT 0,
  rejected_submissions INT DEFAULT 0,
  
  -- METADATA
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- =====================================================
-- VERIFICATION & MODERATION
-- =====================================================

CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- REQUEST TYPE
  verification_type VARCHAR(50) NOT NULL, -- 'supplier', 'business', 'identity'
  
  -- DOCUMENTS
  documents JSONB NOT NULL,
  
  -- STATUS
  status verification_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MESSAGING SYSTEM
-- =====================================================

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_request_id UUID REFERENCES public.quote_requests(id),
  
  -- PARTICIPANTS
  participant_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- METADATA
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(participant_1, participant_2, quote_request_id)
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  
  -- STATUS
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS SYSTEM
-- =====================================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  
  -- RELATED ENTITIES
  material_id UUID REFERENCES public.materials(id),
  listing_id UUID REFERENCES public.supplier_listings(id),
  quote_request_id UUID REFERENCES public.quote_requests(id),
  
  -- STATUS
  read_at TIMESTAMPTZ,
  
  -- METADATA
  data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUPPORT SYSTEM
-- =====================================================

CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'medium',
  
  -- STATUS
  status VARCHAR(50) DEFAULT 'open',
  assigned_to UUID REFERENCES public.profiles(id),
  
  -- RELATED ENTITIES
  material_id UUID REFERENCES public.materials(id),
  listing_id UUID REFERENCES public.supplier_listings(id),
  quote_request_id UUID REFERENCES public.quote_requests(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_platform_preference ON public.profiles(platform_preference);

-- Materials indexes
CREATE INDEX idx_materials_category ON public.materials(category);
CREATE INDEX idx_materials_name ON public.materials(name);

-- Price submissions indexes
CREATE INDEX idx_price_submissions_material_id ON public.price_submissions(material_id);
CREATE INDEX idx_price_submissions_location ON public.price_submissions(location);
CREATE INDEX idx_price_submissions_user_id ON public.price_submissions(user_id);
CREATE INDEX idx_price_submissions_status ON public.price_submissions(status);
CREATE INDEX idx_price_submissions_submitted_at ON public.price_submissions(submitted_at DESC);

-- Aggregated prices indexes
CREATE INDEX idx_aggregated_prices_material_location ON public.aggregated_prices(material_id, location);

-- Supplier listings indexes
CREATE INDEX idx_supplier_listings_supplier_id ON public.supplier_listings(supplier_id);
CREATE INDEX idx_supplier_listings_material_id ON public.supplier_listings(material_id);
CREATE INDEX idx_supplier_listings_status ON public.supplier_listings(status);

-- Quote requests indexes
CREATE INDEX idx_quote_requests_buyer_id ON public.quote_requests(buyer_id);
CREATE INDEX idx_quote_requests_supplier_id ON public.quote_requests(supplier_id);
CREATE INDEX idx_quote_requests_status ON public.quote_requests(status);

-- Messages indexes
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read_at ON public.notifications(read_at);

-- =====================================================
-- SEED DATA - MATERIALS CATALOG
-- =====================================================

INSERT INTO public.materials (name, unit, category, subcategory) VALUES
  -- CEMENT & CONCRETE
  ('Cement', 'bag', 'cement', 'portland_cement'),
  ('White Cement', 'bag', 'cement', 'specialty_cement'),
  ('Ready Mix Concrete', 'm3', 'cement', 'concrete'),
  
  -- AGGREGATES
  ('Sand', 'ton', 'aggregates', 'fine_aggregate'),
  ('Coarse Sand', 'ton', 'aggregates', 'fine_aggregate'),
  ('Gravel', 'ton', 'aggregates', 'coarse_aggregate'),
  ('Crushed Stone', 'ton', 'aggregates', 'coarse_aggregate'),
  ('Bricks', 'piece', 'aggregates', 'masonry'),
  ('Concrete Blocks', 'piece', 'aggregates', 'masonry'),
  
  -- STEEL & METAL
  ('Steel Bars (Rebar)', 'kg', 'steel', 'reinforcement'),
  ('Wire Mesh', 'roll', 'steel', 'reinforcement'),
  ('Steel Sheets', 'sheet', 'steel', 'structural'),
  ('Angle Iron', 'meter', 'steel', 'structural'),
  
  -- ROOFING
  ('Iron Sheets', 'sheet', 'roofing', 'metal_roofing'),
  ('Roofing Tiles', 'piece', 'roofing', 'clay_tiles'),
  ('Roofing Timber', 'piece', 'wood', 'structural_timber'),
  
  -- WOOD & TIMBER
  ('Wood Planks', 'piece', 'wood', 'lumber'),
  ('Plywood', 'sheet', 'wood', 'engineered_wood'),
  ('Timber Beams', 'piece', 'wood', 'structural_timber'),
  
  -- FINISHING MATERIALS
  ('Paint', 'liter', 'paint', 'interior_paint'),
  ('Exterior Paint', 'liter', 'paint', 'exterior_paint'),
  ('Tiles', 'box', 'tiles', 'ceramic_tiles'),
  ('Floor Tiles', 'box', 'tiles', 'floor_tiles'),
  
  -- HARDWARE
  ('Nails', 'kg', 'hardware', 'fasteners'),
  ('Screws', 'kg', 'hardware', 'fasteners'),
  ('Hinges', 'piece', 'hardware', 'door_hardware'),
  ('Locks', 'piece', 'hardware', 'security'),
  
  -- ELECTRICAL
  ('Electrical Wire', 'meter', 'electrical', 'wiring'),
  ('Switches', 'piece', 'electrical', 'controls'),
  ('Sockets', 'piece', 'electrical', 'outlets'),
  
  -- PLUMBING
  ('PVC Pipes', 'meter', 'plumbing', 'pipes'),
  ('Water Taps', 'piece', 'plumbing', 'fixtures'),
  ('Toilet', 'piece', 'plumbing', 'fixtures')
ON CONFLICT (name) DO NOTHING;
-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_profiles_updated_at BEFORE UPDATE ON public.supplier_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_price_submissions_updated_at BEFORE UPDATE ON public.price_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_listings_updated_at BEFORE UPDATE ON public.supplier_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON public.verification_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_price_narratives_updated_at BEFORE UPDATE ON public.price_narratives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aggregated_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_narratives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reliability_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Supplier profiles policies
CREATE POLICY "Suppliers can view own profile" ON public.supplier_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Suppliers can update own profile" ON public.supplier_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view supplier profiles" ON public.supplier_profiles FOR SELECT USING (true);

-- =====================================================
-- MATERIALS POLICIES
-- =====================================================

-- Anyone can view materials catalog
CREATE POLICY "Anyone can view materials" ON public.materials FOR SELECT USING (true);

-- =====================================================
-- PRICE SUBMISSIONS POLICIES
-- =====================================================

-- Users can view approved price submissions
CREATE POLICY "Users can view approved submissions" ON public.price_submissions FOR SELECT USING (status = 'approved');

-- Users can create their own submissions
CREATE POLICY "Users can create submissions" ON public.price_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions" ON public.price_submissions FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own pending submissions
CREATE POLICY "Users can update own pending submissions" ON public.price_submissions FOR UPDATE USING (
  auth.uid() = user_id AND status = 'pending'
);

-- Admins can view and moderate all submissions
CREATE POLICY "Admins can view all submissions" ON public.price_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update submissions" ON public.price_submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- AGGREGATED PRICES POLICIES
-- =====================================================

-- Anyone can view aggregated prices
CREATE POLICY "Anyone can view aggregated prices" ON public.aggregated_prices FOR SELECT USING (true);

-- =====================================================
-- PRICE HISTORY POLICIES
-- =====================================================

-- Anyone can view price history
CREATE POLICY "Anyone can view price history" ON public.price_history FOR SELECT USING (true);

-- =====================================================
-- SUPPLIER LISTINGS POLICIES
-- =====================================================

-- Anyone can view active listings
CREATE POLICY "Anyone can view active listings" ON public.supplier_listings FOR SELECT USING (status = 'active');

-- Suppliers can manage their own listings
CREATE POLICY "Suppliers can create listings" ON public.supplier_listings FOR INSERT WITH CHECK (
  auth.uid() = supplier_id AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('supplier', 'admin'))
);

CREATE POLICY "Suppliers can view own listings" ON public.supplier_listings FOR SELECT USING (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can update own listings" ON public.supplier_listings FOR UPDATE USING (auth.uid() = supplier_id);

-- =====================================================
-- QUOTE REQUESTS POLICIES
-- =====================================================

-- Buyers can create quote requests
CREATE POLICY "Buyers can create quotes" ON public.quote_requests FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Users can view their own quote requests (as buyer or supplier)
CREATE POLICY "Users can view own quotes" ON public.quote_requests FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = supplier_id
);

-- Users can update their own quote requests
CREATE POLICY "Users can update own quotes" ON public.quote_requests FOR UPDATE USING (
  auth.uid() = buyer_id OR auth.uid() = supplier_id
);

-- =====================================================
-- SUPPLIER RATINGS POLICIES
-- =====================================================

-- Anyone can view ratings
CREATE POLICY "Anyone can view ratings" ON public.supplier_ratings FOR SELECT USING (true);

-- Buyers can create ratings
CREATE POLICY "Buyers can create ratings" ON public.supplier_ratings FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- =====================================================
-- INTELLIGENCE POLICIES
-- =====================================================

-- Anyone can view price trends
CREATE POLICY "Anyone can view trends" ON public.price_trends FOR SELECT USING (true);

-- Anyone can view price signals
CREATE POLICY "Anyone can view signals" ON public.price_signals FOR SELECT USING (true);

-- Anyone can view published narratives
CREATE POLICY "Anyone can view narratives" ON public.price_narratives FOR SELECT USING (published = true);

-- =====================================================
-- RELIABILITY SCORES POLICIES
-- =====================================================

-- Users can view their own reliability scores
CREATE POLICY "Users can view own scores" ON public.reliability_scores FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- VERIFICATION POLICIES
-- =====================================================

-- Users can create their own verification requests
CREATE POLICY "Users can create verification" ON public.verification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own verification requests
CREATE POLICY "Users can view own verification" ON public.verification_requests FOR SELECT USING (auth.uid() = user_id);

-- Admins can view and update all verification requests
CREATE POLICY "Admins can view all verification" ON public.verification_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update verification" ON public.verification_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- MESSAGING POLICIES
-- =====================================================

-- Users can view conversations they're part of
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);

-- Users can create conversations
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);

-- Users can view messages in their conversations
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
  )
);

-- Users can send messages to their conversations
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
  )
);

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- System can create notifications
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- =====================================================
-- SUPPORT POLICIES
-- =====================================================

-- Users can create support tickets
CREATE POLICY "Users can create tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own tickets
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own tickets
CREATE POLICY "Users can update own tickets" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view and update all tickets
CREATE POLICY "Admins can view all tickets" ON public.support_tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update tickets" ON public.support_tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- ENABLE REALTIME
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.profiles IS 'User profiles for materials marketplace platform';
COMMENT ON TABLE public.supplier_profiles IS 'Extended profiles for suppliers';
COMMENT ON TABLE public.materials IS 'Materials catalog';
COMMENT ON TABLE public.price_submissions IS 'User-submitted price data';
COMMENT ON TABLE public.aggregated_prices IS 'Aggregated price intelligence';
COMMENT ON TABLE public.price_history IS 'Historical price data';
COMMENT ON TABLE public.supplier_listings IS 'Supplier product listings';
COMMENT ON TABLE public.quote_requests IS 'Quote requests between buyers and suppliers';
COMMENT ON TABLE public.supplier_ratings IS 'Ratings and reviews for suppliers';
COMMENT ON TABLE public.price_trends IS 'Price trend analysis';
COMMENT ON TABLE public.price_signals IS 'Market signals and alerts';
COMMENT ON TABLE public.price_narratives IS 'AI-generated market narratives';
COMMENT ON TABLE public.reliability_scores IS 'User reliability scoring';
COMMENT ON TABLE public.verification_requests IS 'Verification requests for suppliers';
COMMENT ON TABLE public.conversations IS 'Message conversations between users';
COMMENT ON TABLE public.messages IS 'Individual messages in conversations';
COMMENT ON TABLE public.notifications IS 'User notifications';
COMMENT ON TABLE public.support_tickets IS 'Customer support tickets';

COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to user profile photo stored in profile-photos bucket';
COMMENT ON COLUMN public.profiles.platform_preference IS 'User preferred platform: gigwork for gig work only, marketplace for marketplace only, both for unified experience';
COMMENT ON COLUMN public.profiles.platform_selected_at IS 'Timestamp when user last selected their platform preference';