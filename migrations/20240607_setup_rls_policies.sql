-- Migration: Setup RLS Policies for the entire application
-- This migration enables RLS and creates policies for all major tables.

-- Step 1: Create Helper Functions
-- These functions help extract custom claims from the user's JWT.
-- You must ensure that 'role' and 'district_id' are included in the JWT claims.
-- See Supabase docs for creating custom claims: https://supabase.com/docs/guides/auth/custom-claims-and-role-based-access-control-rls

CREATE OR REPLACE FUNCTION get_my_claim(claim TEXT)
RETURNS JSONB
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), '')::JSONB -> claim, NULL);
$$;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(get_my_claim('role')::TEXT, 'anon');
$$;

CREATE OR REPLACE FUNCTION get_my_district_id()
RETURNS UUID
LANGUAGE sql STABLE
AS $$
  SELECT (get_my_claim('district_id')#>>'{}')::UUID;
$$;


-- Step 2: Enable RLS on all tables
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies

-- ============================
-- Table: districts
-- ============================
DROP POLICY IF EXISTS "Allow public read access to all districts" ON public.districts;
CREATE POLICY "Allow public read access to all districts" ON public.districts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow super_admin to manage districts" ON public.districts;
CREATE POLICY "Allow super_admin to manage districts" ON public.districts
  FOR ALL USING (get_my_role() = 'super_admin') WITH CHECK (get_my_role() = 'super_admin');


-- ============================
-- Table: zones
-- ============================
DROP POLICY IF EXISTS "Allow users to view zones in their district" ON public.zones;
CREATE POLICY "Allow users to view zones in their district" ON public.zones
  FOR SELECT USING (district_id = get_my_district_id() OR get_my_role() = 'super_admin');

DROP POLICY IF EXISTS "Allow admins to manage zones in their district" ON public.zones;
CREATE POLICY "Allow admins to manage zones in their district" ON public.zones
  FOR ALL USING (district_id = get_my_district_id() AND get_my_role() IN ('mmda_admin', 'regional_admin'))
  WITH CHECK (district_id = get_my_district_id() AND get_my_role() IN ('mmda_admin', 'regional_admin'));

DROP POLICY IF EXISTS "Allow super_admin full access to zones" ON public.zones;
CREATE POLICY "Allow super_admin full access to zones" ON public.zones
  FOR ALL USING (get_my_role() = 'super_admin') WITH CHECK (get_my_role() = 'super_admin');


-- ============================
-- Table: revenue_types
-- ============================
DROP POLICY IF EXISTS "Allow public read access to all revenue types" ON public.revenue_types;
CREATE POLICY "Allow public read access to all revenue types" ON public.revenue_types
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow super_admin to manage revenue types" ON public.revenue_types;
CREATE POLICY "Allow super_admin to manage revenue types" ON public.revenue_types
  FOR ALL USING (get_my_role() = 'super_admin') WITH CHECK (get_my_role() = 'super_admin');


-- ============================
-- Table: businesses
-- ============================
DROP POLICY IF EXISTS "Allow users to view businesses in their district" ON public.businesses;
CREATE POLICY "Allow users to view businesses in their district" ON public.businesses
  FOR SELECT USING (district_id = get_my_district_id() OR get_my_role() = 'super_admin');

DROP POLICY IF EXISTS "Allow admins to manage businesses in their district" ON public.businesses;
CREATE POLICY "Allow admins to manage businesses in their district" ON public.businesses
  FOR ALL USING (district_id = get_my_district_id() AND get_my_role() IN ('mmda_admin', 'regional_admin', 'business_registration_officer'))
  WITH CHECK (district_id = get_my_district_id() AND get_my_role() IN ('mmda_admin', 'regional_admin', 'business_registration_officer'));

DROP POLICY IF EXISTS "Allow super_admin full access to businesses" ON public.businesses;
CREATE POLICY "Allow super_admin full access to businesses" ON public.businesses
  FOR ALL USING (get_my_role() = 'super_admin') WITH CHECK (get_my_role() = 'super_admin');


-- ============================
-- Table: assignments
-- ============================
DROP POLICY IF EXISTS "Allow admins to view all assignments in their district" ON public.assignments;
CREATE POLICY "Allow admins to view all assignments in their district" ON public.assignments
  FOR SELECT USING (district_id = get_my_district_id() AND get_my_role() IN ('mmda_admin', 'regional_admin'));

DROP POLICY IF EXISTS "Allow collectors to view their own assignments" ON public.assignments;
CREATE POLICY "Allow collectors to view their own assignments" ON public.assignments
  FOR SELECT USING (collector_id = auth.uid());

DROP POLICY IF EXISTS "Allow admins to manage assignments in their district" ON public.assignments;
CREATE POLICY "Allow admins to manage assignments in their district" ON public.assignments
  FOR ALL USING (district_id = get_my_district_id() AND get_my_role() IN ('mmda_admin', 'regional_admin'))
  WITH CHECK (district_id = get_my_district_id() AND get_my_role() IN ('mmda_admin', 'regional_admin'));

DROP POLICY IF EXISTS "Allow super_admin full access to assignments" ON public.assignments;
CREATE POLICY "Allow super_admin full access to assignments" ON public.assignments
  FOR ALL USING (get_my_role() = 'super_admin') WITH CHECK (get_my_role() = 'super_admin');


-- ============================
-- Table: collections
-- ============================
DROP POLICY IF EXISTS "Allow district-level roles to view collections in their district" ON public.collections;
CREATE POLICY "Allow district-level roles to view collections in their district" ON public.collections
  FOR SELECT USING (district_id = get_my_district_id() AND get_my_role() IN ('mmda_admin', 'regional_admin', 'finance', 'auditor'));

DROP POLICY IF EXISTS "Allow collectors to manage their own collections" ON public.collections;
CREATE POLICY "Allow collectors to manage their own collections" ON public.collections
  FOR ALL USING (collector_id = auth.uid()) WITH CHECK (collector_id = auth.uid());

DROP POLICY IF EXISTS "Allow super_admin full access to collections" ON public.collections;
CREATE POLICY "Allow super_admin full access to collections" ON public.collections
  FOR ALL USING (get_my_role() = 'super_admin') WITH CHECK (get_my_role() = 'super_admin');

-- ============================
-- Table: audit_logs
-- ============================
DROP POLICY IF EXISTS "Allow admins to view audit logs in their district" ON public.audit_logs;
CREATE POLICY "Allow admins to view audit logs in their district" ON public.audit_logs
  FOR SELECT USING (district_id = get_my_district_id() AND get_my_role() IN ('mmda_admin', 'regional_admin', 'auditor'));

DROP POLICY IF EXISTS "Allow users to insert their own audit logs" ON public.audit_logs;
CREATE POLICY "Allow users to insert their own audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Allow super_admin full access to audit logs" ON public.audit_logs;
CREATE POLICY "Allow super_admin full access to audit logs" ON public.audit_logs
  FOR ALL USING (get_my_role() = 'super_admin') WITH CHECK (get_my_role() = 'super_admin');

-- Note: No UPDATE or DELETE policies are granted on audit_logs to ensure immutability, except for super_admin. 