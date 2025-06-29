/*
  # Fix donations table and policies

  1. Tables
    - Update donations table to reference auth.users directly
    - Add proper constraints and defaults
  
  2. Security
    - Drop existing conflicting policies
    - Create new RLS policies for donations
    - Add storage policies for donation images
  
  3. Performance
    - Add indexes for better query performance
  
  4. Storage
    - Create donations bucket for images
*/

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read own donations" ON public.donations;
  DROP POLICY IF EXISTS "Users can insert own donations" ON public.donations;
  DROP POLICY IF EXISTS "Users can update own donations" ON public.donations;
  DROP POLICY IF EXISTS "Volunteers and admins can view all donations" ON public.donations;
  DROP POLICY IF EXISTS "Volunteers and admins can update donation status" ON public.donations;
EXCEPTION
  WHEN undefined_table THEN
    NULL; -- Table doesn't exist yet, continue
END $$;

-- Create donations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL,
  item_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('food', 'clothing', 'books', 'medicine', 'hygiene', 'toys')),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  condition text NOT NULL DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair')),
  description text,
  pickup_option boolean NOT NULL DEFAULT true,
  image_url text,
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'verified', 'picked', 'delivered')),
  created_at timestamp with time zone DEFAULT now()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'donations_donor_id_fkey' 
    AND table_name = 'donations'
  ) THEN
    ALTER TABLE public.donations 
    ADD CONSTRAINT donations_donor_id_fkey 
    FOREIGN KEY (donor_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create new policies for donations table
CREATE POLICY "Users can read own donations"
  ON public.donations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = donor_id);

CREATE POLICY "Users can insert own donations"
  ON public.donations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Users can update own donations"
  ON public.donations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

-- Policy for volunteers and admins to view all donations
CREATE POLICY "Volunteers and admins can view all donations"
  ON public.donations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('volunteer', 'admin')
    )
  );

-- Policy for volunteers and admins to update donation status
CREATE POLICY "Volunteers and admins can update donation status"
  ON public.donations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('volunteer', 'admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS donations_donor_id_idx ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS donations_status_idx ON public.donations(status);
CREATE INDEX IF NOT EXISTS donations_category_idx ON public.donations(category);
CREATE INDEX IF NOT EXISTS donations_created_at_idx ON public.donations(created_at DESC);

-- Create storage bucket for donation images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('donations', 'donations', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can upload donation images" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view donation images" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    NULL; -- Policy doesn't exist, continue
END $$;

-- Create storage policies for donation images
CREATE POLICY "Users can upload donation images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'donations');

CREATE POLICY "Anyone can view donation images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'donations');