-- Rename discussion_favorites table to discussion_focus
ALTER TABLE public.discussion_favorites RENAME TO discussion_focus;

-- Update foreign key constraint name
ALTER TABLE public.discussion_focus 
RENAME CONSTRAINT discussion_favorites_thread_id_fkey TO discussion_focus_thread_id_fkey;

ALTER TABLE public.discussion_focus 
RENAME CONSTRAINT discussion_favorites_user_id_fkey TO discussion_focus_user_id_fkey;

-- Update RLS policy names
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.discussion_focus;
DROP POLICY IF EXISTS "Users can create their own favorites" ON public.discussion_focus;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.discussion_focus;

CREATE POLICY "Users can view their own focus" 
ON public.discussion_focus 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own focus" 
ON public.discussion_focus 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own focus" 
ON public.discussion_focus 
FOR DELETE 
USING (auth.uid() = user_id);