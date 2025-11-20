/*
  # Use SECURITY DEFINER function to break infinite recursion

  ## Problem
  Any direct query to profiles table within a profiles RLS policy causes infinite recursion.

  ## Solution
  Create a SECURITY DEFINER function that bypasses RLS to check if user is super admin.
  This function runs with elevated privileges and can query profiles without triggering RLS.
  
  ## Changes
  1. Create a security definer function to check if user is super admin
  2. Update the super admin policy to use this function
  
  ## How it works
  - SECURITY DEFINER means the function runs with the privileges of the function owner (postgres)
  - This bypasses RLS, preventing the recursion
  - The function is simple and safe: just checks if current user's role is super_admin
  
  ## Security
  - Function is read-only and only returns boolean
  - No security risk as it only checks the current user's own role
  - Users still can't modify data they shouldn't access
*/

-- Drop existing super admin policy
DROP POLICY IF EXISTS "Super admins view all via JWT" ON profiles;

-- Create a security definer function to check if current user is super admin
-- SECURITY DEFINER allows it to bypass RLS and avoid infinite recursion
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create super admin policy using the security definer function
CREATE POLICY "Super admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_super_admin());
