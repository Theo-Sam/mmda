-- Migration: Add 'role' field to users table for role-based access control
-- Recommended roles: super_admin, mmda_admin, finance, collector, auditor, business_owner, monitoring_body, business_registration_officer, regional_admin

ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'collector';

-- Optionally, update existing users to a specific role (uncomment and edit as needed)
-- UPDATE users SET role = 'super_admin' WHERE email = 'admin@example.com'; 