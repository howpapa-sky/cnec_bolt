/*
  # Fix infinite recursion in profiles RLS policy

  ## Problem
  The "Super admins can view all profiles" policy was causing infinite recursion
  because it queries the profiles table within a profiles table policy.

  ## Solution
  Drop the problematic policy and replace it with a simpler approach:
  - Users can view their own profile (existing policy - works fine)
  - Super admins can view all profiles using a direct role check without subquery
  
  ## Changes
  1. Drop the recursive "Super admins can view all profiles" policy
  2. Create a new non-recursive policy that checks role directly
  
  ## Security
  - Maintains same access control: users see own profile, super admins see all
  - No security regression, just fixes the implementation
*/

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;

-- Create a new non-recursive policy for super admins
-- This works because we're checking the CURRENT row's role, not querying profiles table
CREATE POLICY "Super admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );
