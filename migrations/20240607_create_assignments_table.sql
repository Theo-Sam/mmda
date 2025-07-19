-- Migration: Create 'assignments' table to link collectors to businesses or zones

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignmentCode TEXT UNIQUE NOT NULL,
  collector_id UUID NOT NULL REFERENCES auth.users(id),
  business_id UUID REFERENCES businesses(id),
  zone_id UUID REFERENCES zones(id),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  assigned_by UUID REFERENCES auth.users(id),
  district_id UUID NOT NULL REFERENCES districts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_assignment_target CHECK (business_id IS NOT NULL OR zone_id IS NOT NULL)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_assignments_on_collector_id ON assignments(collector_id);
CREATE INDEX IF NOT EXISTS idx_assignments_on_business_id ON assignments(business_id);
CREATE INDEX IF NOT EXISTS idx_assignments_on_zone_id ON assignments(zone_id);

-- Add a comment for clarity
COMMENT ON TABLE assignments IS 'Links collectors to specific businesses or zones for revenue collection.'; 