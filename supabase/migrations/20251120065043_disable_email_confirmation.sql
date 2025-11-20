/*
  # Disable email confirmation for easier signup

  1. Changes
    - Update auth configuration to disable email confirmation
    - This allows users to sign up and log in immediately without waiting for email verification
  
  2. Security Note
    - In production, you may want to enable email confirmation
    - For development and testing, disabled confirmation is more convenient
*/

-- Note: Email confirmation settings are typically managed in the Supabase dashboard
-- under Authentication > Settings > Email Auth
-- This migration documents the intended configuration

-- The actual setting needs to be changed in the Supabase dashboard:
-- 1. Go to Authentication > Settings
-- 2. Under "Email Auth" section
-- 3. Disable "Enable email confirmations"
