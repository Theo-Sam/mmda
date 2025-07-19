-- Migration: Create 'audit_logs' table to track user actions

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_role TEXT,
  action TEXT NOT NULL,
  details JSONB,
  entity_type TEXT,
  entity_id TEXT,
  district_id UUID REFERENCES districts(id),
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_audit_logs_on_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_on_entity_type_entity_id ON audit_logs(entity_type, entity_id);

-- Add a comment for clarity
COMMENT ON TABLE audit_logs IS 'Tracks significant user actions for security and traceability.'; 