-- Migration: Create 'businesses' table to store business information

CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  businessCode TEXT UNIQUE NOT NULL,
  owner_name TEXT NOT NULL,
  category TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  gps_location TEXT,
  physical_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_payment_date DATE,
  business_license TEXT,
  tin_number TEXT,
  district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_businesses_on_district_id ON businesses(district_id);
CREATE INDEX IF NOT EXISTS idx_businesses_on_status ON businesses(status);

-- Add a comment for clarity
COMMENT ON TABLE businesses IS 'Stores information about businesses registered within the districts.'; 