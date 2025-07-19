-- Migration: Create 'revenue_types' table to define different revenue categories

CREATE TABLE IF NOT EXISTS revenue_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  default_amount NUMERIC(10, 2) NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'one-time')),
  category TEXT CHECK (category IN ('permit', 'license', 'toll', 'fee', 'tax')),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index for faster lookups on active revenue types
CREATE INDEX IF NOT EXISTS idx_revenue_types_on_is_active ON revenue_types(is_active);

-- Add a comment for clarity
COMMENT ON TABLE revenue_types IS 'Defines the different types of revenue, such as permits, licenses, and fees.'; 