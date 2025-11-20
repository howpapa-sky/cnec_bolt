/*
  # Fix profile creation with database trigger

  1. Changes
    - Remove the restrictive INSERT policy
    - Add a database trigger to automatically create profiles when users sign up
    - This solves the RLS issue where unconfirmed users cannot insert their own profile
  
  2. How it works
    - When a new user is created in auth.users, the trigger automatically creates a profile
    - The profile data comes from the user's raw_user_meta_data (set during signup)
    - This approach is more secure and reliable than allowing client-side inserts
  
  3. Security
    - No manual INSERT allowed - only automatic via trigger
    - Users can still view and update their own profiles
*/

-- Drop the problematic INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, company_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'creator_admin'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
