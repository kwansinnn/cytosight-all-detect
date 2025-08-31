-- First, let's check and fix the profiles table RLS policies
-- Drop existing policies to recreate them more securely
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create secure policies that ensure only authenticated users can access their own profiles
CREATE POLICY "Users can view only their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create only their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update only their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled (it should be, but let's be explicit)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a public view for safe profile data that excludes sensitive information
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Create policy for the public view (if needed for public display)
-- This view excludes email addresses and is safe for public access
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.public_profiles 
FOR SELECT 
USING (true);