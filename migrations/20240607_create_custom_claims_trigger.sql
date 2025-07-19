-- Migration: Create a trigger to add custom claims (role, district_id) to user JWTs
-- This is essential for the RLS policies to function correctly.

-- Step 1: Create the Trigger Function
-- This function reads the role and district_id from the public.users table
-- and updates the raw_app_meta_data in the auth.users table.
CREATE OR REPLACE FUNCTION public.handle_user_claims()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || 
    jsonb_build_object(
      'role', NEW.role,
      'district_id', NEW.district_id
    )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

-- Step 2: Create the Trigger
-- This trigger fires after a new user is inserted or their role/district is updated.
DROP TRIGGER IF EXISTS on_user_created_or_updated ON public.users;
CREATE TRIGGER on_user_created_or_updated
  AFTER INSERT OR UPDATE OF role, district_id ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_claims();

COMMENT ON TRIGGER on_user_created_or_updated ON public.users 
IS 'When a user is created or their role/district changes, update their custom claims in auth.users.'; 