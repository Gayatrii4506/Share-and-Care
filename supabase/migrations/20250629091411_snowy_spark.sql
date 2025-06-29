/*
  # Fix donations foreign key constraint

  1. Changes
    - Update foreign key constraint to reference profiles table instead of auth.users
    - This ensures proper data integrity with the profiles table
    
  2. Security
    - Maintains existing RLS policies
    - No changes to security model
*/

-- Drop the existing foreign key constraint
ALTER TABLE public.donations DROP CONSTRAINT IF EXISTS donations_donor_id_fkey;

-- Add the correct foreign key constraint to reference profiles table
ALTER TABLE public.donations 
ADD CONSTRAINT donations_donor_id_fkey 
FOREIGN KEY (donor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;