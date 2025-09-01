-- Update discussion threads and comments to require authentication
-- This prevents anonymous users from accessing discussion content

-- Update discussion threads policy
DROP POLICY IF EXISTS "Discussion threads are viewable by everyone" ON public.discussion_threads;
CREATE POLICY "Discussion threads are viewable by authenticated users" 
ON public.discussion_threads 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Update discussion comments policy  
DROP POLICY IF EXISTS "Discussion comments are viewable by everyone" ON public.discussion_comments;
CREATE POLICY "Discussion comments are viewable by authenticated users" 
ON public.discussion_comments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);