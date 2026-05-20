-- ============================================================
-- PHASE 1: Supply Chain Cost Breakdown (Private Supplier Tool)
-- ============================================================

-- 1. Cost stage templates per sector
CREATE TABLE IF NOT EXISTS cost_stage_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  sector TEXT,
  stage_order INTEGER NOT NULL,
  stage_name TEXT NOT NULL,
  stage_category TEXT NOT NULL
    CHECK (stage_category IN ('input','labor','processing','transport','overhead','margin')),
  unit_hint TEXT,
  description TEXT,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Supplier private cost entries per listing
CREATE TABLE IF NOT EXISTS listing_cost_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES supplier_listings(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stage_template_id UUID REFERENCES cost_stage_templates(id) ON DELETE SET NULL,
  stage_name TEXT NOT NULL,
  stage_category TEXT NOT NULL
    CHECK (stage_category IN ('input','labor','processing','transport','overhead','margin')),
  cost_rwf NUMERIC NOT NULL CHECK (cost_rwf >= 0),
  notes TEXT,
  season TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: strictly private
ALTER TABLE listing_cost_breakdown ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Suppliers manage own cost breakdown" ON listing_cost_breakdown;
CREATE POLICY "Suppliers manage own cost breakdown"
  ON listing_cost_breakdown
  USING (auth.uid() = supplier_id)
  WITH CHECK (auth.uid() = supplier_id);

CREATE INDEX IF NOT EXISTS idx_cost_breakdown_listing ON listing_cost_breakdown(listing_id);
CREATE INDEX IF NOT EXISTS idx_cost_breakdown_supplier ON listing_cost_breakdown(supplier_id);

-- ============================================================
-- TEMPLATES: Coffee (food sector)
-- ============================================================
INSERT INTO cost_stage_templates (sector, stage_order, stage_name, stage_category, unit_hint, description, is_required)
VALUES
  ('food',1,'Seedling / Planting material','input','per kg output','Coffee seedlings or seeds cost',false),
  ('food',2,'Land preparation','labor','per kg output','Clearing, tilling, terracing',false),
  ('food',3,'Fertilizer & soil amendments','input','per kg output','NPK, organic compost, lime',false),
  ('food',4,'Pesticides & fungicides','input','per kg output','Crop protection chemicals',false),
  ('food',5,'Pruning & maintenance labor','labor','per kg output','Seasonal maintenance work',false),
  ('food',6,'Harvesting labor','labor','per kg output','Cherry picking labor cost',true),
  ('food',7,'Washing station fee','processing','per kg output','CWS processing fee',true),
  ('food',8,'Drying & milling','processing','per kg output','Sun drying, hulling, sorting',false),
  ('food',9,'Packaging','overhead','per kg output','Bags, labels, sealing',false),
  ('food',10,'Transport to market','transport','per kg output','Truck/moto transport cost',true),
  ('food',11,'Supplier margin','margin','per kg output','Your profit margin',true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- TEMPLATES: Construction materials
-- ============================================================
INSERT INTO cost_stage_templates (sector, stage_order, stage_name, stage_category, unit_hint, description, is_required)
VALUES
  ('construction',1,'Purchase / procurement cost','input','per unit','Cost to buy from manufacturer/wholesaler',true),
  ('construction',2,'Transport from source','transport','per unit','Freight from factory/port to warehouse',true),
  ('construction',3,'Warehouse / storage cost','overhead','per unit','Storage and handling fees',false),
  ('construction',4,'Loading & unloading labor','labor','per unit','Manual handling labor',false),
  ('construction',5,'Packaging / repackaging','processing','per unit','Any repackaging costs',false),
  ('construction',6,'Last-mile delivery','transport','per unit','Delivery to customer site',false),
  ('construction',7,'Supplier margin','margin','per unit','Your profit margin',true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- TEMPLATES: Rice (food sector - separate from coffee)
-- ============================================================
INSERT INTO cost_stage_templates (sector, stage_order, stage_name, stage_category, unit_hint, description, is_required)
VALUES
  ('food',12,'Certified rice seeds','input','per kg output','Improved variety seeds',true),
  ('food',13,'Irrigation cost','overhead','per kg output','Water pump fuel or irrigation fee',false),
  ('food',14,'Transplanting labor','labor','per kg output','Seedling transplanting',false),
  ('food',15,'Milling & processing fee','processing','per kg output','Rice milling fee',true)
ON CONFLICT DO NOTHING;

-- Verify
SELECT sector, COUNT(*) as templates FROM cost_stage_templates GROUP BY sector;
