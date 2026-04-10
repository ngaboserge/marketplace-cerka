-- Add location column to supplier_listings table
-- This is needed for price aggregation and zone-based analytics

DO $$
BEGIN
  -- Add location column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='supplier_listings' AND column_name='location') THEN
    ALTER TABLE supplier_listings ADD COLUMN location VARCHAR(100);
    
    -- Add index for location-based queries
    CREATE INDEX IF NOT EXISTS idx_supplier_listings_location ON supplier_listings(location);
    
    RAISE NOTICE 'Added location column to supplier_listings table';
  ELSE
    RAISE NOTICE 'Location column already exists in supplier_listings table';
  END IF;
END $$;

-- Update existing listings with default location if needed
UPDATE supplier_listings 
SET location = 'Kigali' 
WHERE location IS NULL OR location = '';

COMMIT;