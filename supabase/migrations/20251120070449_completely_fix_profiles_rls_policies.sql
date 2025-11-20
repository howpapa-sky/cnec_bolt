/*
  # Completely fix profiles RLS policies to prevent infinite recursion

  ## Problem
  All previous attempts to fix the super admin policy still cause infinite recursion
  because any subquery to the profiles table within a profiles policy creates a loop.

  ## Solution
  Use a completely different approach:
  1. Keep the simple "Users can view own profile" policy
  2. For super admins, use auth.jwt() to check the role from the JWT token metadata
  3. This avoids ANY query to the profiles table within the policy
  
  ## Changes
  1. Drop ALL existing SELECT policies on profiles
  2. Create two new policies:
     - One for users viewing their own profile (simple, no recursion)
     - One for super admins using JWT metadata (no recursion)
  
  ## Security
  - Same access control: users see own profile, super admins see all
  - No queries to profiles table within policies = no recursion possible
*/

-- Drop all existing SELECT policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;

-- Policy 1: Users can view their own profile
-- This is safe because it only checks auth.uid() against the current row's id
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Super admins can view all profiles
-- This uses auth.jwt() to read role from JWT metadata (no table query needed)
-- Note: This requires the role to be stored in JWT, which happens after first login
CREATE POLICY "Super admins view all via JWT"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'role')::text,
      (auth.jwt() -> 'app_metadata' ->> 'role')::text
    ) = 'super_admin'
  );
