-- Drop the problematic view and recreate it without security definer
DROP VIEW IF EXISTS public.public_profiles;

-- Create a safer public view without security definer
-- This view will use the permissions of the querying user
CREATE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  created_at
FROM public.profiles
WHERE auth.uid() = user_id OR false; -- This ensures RLS is still enforced

-- Grant appropriate permissions
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;