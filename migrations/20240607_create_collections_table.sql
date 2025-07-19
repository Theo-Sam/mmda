-- Migration: Create 'collections' table to record payment transactions

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receiptCode TEXT UNIQUE NOT NULL,
  business_id UUID NOT NULL REFERENCES businesses(id),
  revenue_type_id UUID NOT NULL REFERENCES revenue_types(id),
  collector_id UUID NOT NULL REFERENCES auth.users(id),
  amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'momo', 'bank', 'cheque', 'pos')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'cancelled')),
  collection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_image_url TEXT,
  notes TEXT,
  district_id UUID NOT NULL REFERENCES districts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_collections_on_business_id ON collections(business_id);
CREATE INDEX IF NOT EXISTS idx_collections_on_revenue_type_id ON collections(revenue_type_id);
CREATE INDEX IF NOT EXISTS idx_collections_on_collector_id ON collections(collector_id);

-- Add a comment for clarity
COMMENT ON TABLE collections IS 'Records every payment transaction, linking businesses, revenue types, and collectors.'; 