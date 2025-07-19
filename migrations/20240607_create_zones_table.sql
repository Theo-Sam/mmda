-- Migration: Create 'zones' table to store geographical zones within a district

CREATE TABLE IF NOT EXISTS zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  zoneCode TEXT UNIQUE NOT NULL,
  district_id UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index for faster lookups on district_id
CREATE INDEX IF NOT EXISTS idx_zones_on_district_id ON zones(district_id);

-- Add a comment for clarity
COMMENT ON TABLE zones IS 'Stores geographical zones within a district for assignments and reporting.'; 