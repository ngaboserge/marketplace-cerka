-- Ensure quote_requests table exists with correct structure

CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES supplier_listings(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  delivery_location TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'responded', 'accepted', 'declined', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Buyers can see their own requests
CREATE POLICY IF NOT EXISTS "Buyers can view own quote requests"
  ON quote_requests FOR SELECT
  USING (auth.uid() = buyer_id);

-- Suppliers can see requests sent to them
CREATE POLICY IF NOT EXISTS "Suppliers can view their quote requests"
  ON quote_requests FOR SELECT
  USING (auth.uid() = supplier_id);

-- Buyers can create quote requests
CREATE POLICY IF NOT EXISTS "Buyers can create quote requests"
  ON quote_requests FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Both buyer and supplier can update status
CREATE POLICY IF NOT EXISTS "Parties can update quote request status"
  ON quote_requests FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);

-- Verify table exists
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'quote_requests'
ORDER BY ordinal_position;