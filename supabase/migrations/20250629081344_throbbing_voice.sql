/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `full_name` (text, not null)
      - `role` (text, not null, default 'donor', check constraint)
      - `care_points` (integer, not null, default 0)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `profiles` table
    - Add policy for users to read their own profile data
    - Add policy for users to update their own profile data
    - Add policy for users to insert their own profile data

  3. Changes
    - Creates the main profiles table that links to Supabase auth users
    - Sets up proper foreign key relationship with auth.users table
    - Establishes role-based access with check constraints
    - Implements row-level security for data protection
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'donor' CHECK (role IN ('donor', 'volunteer', 'admin')),
  care_points integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);